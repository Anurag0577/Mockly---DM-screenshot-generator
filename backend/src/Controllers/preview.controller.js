import { asyncHandler } from "../Utilities/asyncHandler.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Whatsapp from '../Platforms-ui/whatsapp-ui.jsx';
import puppeteer from 'puppeteer';
import Instagram from '../Platforms-ui/Instagram-ui.jsx';
import { User } from "../Models/User.model.js";

// ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_PATH = path.join(__dirname, '../../templates/tailwind.output.css');
const TAILWIND_CSS_STRING = fs.readFileSync(CSS_PATH, 'utf-8');

// Path to assets directory
const ASSETS_PATH = path.join(__dirname, '../Platforms-ui/Assets');

// --- GLOBAL BROWSER INSTANCE FOR REUSE ---
let browserInstance = null;

async function getBrowser() {
    // If browser exists and is connected, return it
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }

    // Otherwise launch a new one
    console.log("Launching new browser instance...");
    browserInstance = await puppeteer.launch({
        headless: true, // or "new" depending on puppeteer version
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // CRITICAL for Render/Docker memory limits
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process", 
            "--disable-gpu",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });

    return browserInstance;
}
// -----------------------------------------

/**
 * Converts an image file to base64 data URL
 */
function imageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString('base64');
        const ext = path.extname(imagePath).toLowerCase();
        let mimeType = 'image/jpeg';

        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.webp') mimeType = 'image/webp';

        return `data:${mimeType};base64,${imageBase64}`;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
}

function getBackgroundImage(platform, isDarkMode) {
    const platformLower = (platform || 'whatsapp').toLowerCase();
    const backgroundMap = {
        whatsapp_light: 'whatsapp_bg.jpg',
        whatsapp_dark: 'whatsappDark.png',
        instagram: 'whatsapp_bg.jpg', 
        telegram: 'whatsapp_bg.jpg', 
    };

    const imageFileName = backgroundMap[`${platformLower}_${isDarkMode ? 'dark' : 'light'}`] || backgroundMap.whatsapp_light;
    const imagePath = path.join(ASSETS_PATH, imageFileName);

    if (!fs.existsSync(imagePath)) {
        console.warn(`Background image not found: ${imagePath}, using default`);
        const defaultPath = path.join(ASSETS_PATH, 'whatsapp_bg.jpg');
        if (!fs.existsSync(defaultPath)) {
            console.error(`Default background image also not found: ${defaultPath}`);
            return null;
        }
        return imageToBase64(defaultPath);
    }

    const base64 = imageToBase64(imagePath);
    if (!base64) {
        console.error('Failed to convert background image to base64');
    }

    return base64;
}


const previewData = asyncHandler(async (req, res) => {
    const { sender, receiver, messages, receiverAvatar, senderAvatar, platform, isDarkMode } = req.body;

    if (!sender || !receiver || !messages) {
        return res.status(401).send('Either sender, receiver or messages not found!')
    }
    const bgImg = getBackgroundImage(platform, isDarkMode);

    let platformComponent;
    switch (platform?.toLowerCase()) {
        case 'instagram':
            platformComponent = <Instagram sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} />;
            break;
        case 'whatsapp':
            platformComponent = <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} />;
            break;
        default:
            platformComponent = <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} />;
    }

    const componentHTML = ReactDOMServer.renderToString(
        <div className={isDarkMode ? 'dark' : ''}>
            {platformComponent}
        </div>
    );

    const finalHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                ${TAILWIND_CSS_STRING}
            </style>
        </head>
        <body>
            <div id="whatsapp-root" style="display: inline-block;">
                ${componentHTML}
            </div>
        </body>
        </html>
    `;

    let page = null; // We only track the page here, not the browser

    try {
        // 1. Get the shared browser instance
        const browser = await getBrowser();
        
        // 2. Open a new tab (page)
        page = await browser.newPage();

        await page.setViewport({
            width: 375,
            height: 812,
            deviceScaleFactor: 3
        });

        // 3. Set content with INCREASED timeout and FASTER wait condition
        await page.setContent(finalHtml, {
            waitUntil: 'domcontentloaded', // Much faster than networkidle0
            timeout: 60000 // 60 seconds to prevent timeout errors
        });

        // Small buffer to ensure fonts/images render if slightly delayed
        // (Since we removed networkidle0, this is a safe backup)
        await new Promise(resolve => setTimeout(resolve, 300));

        const elementToCapture = await page.$('#whatsapp-root');

        if (!elementToCapture) {
            throw new Error("Target element #whatsapp-root not found.");
        }

        const imageBuffer = await elementToCapture.screenshot({
            type: 'png'
        });

        // Decrease credit logic
        const userId = req.user._id; 
        await User.findByIdAndUpdate(userId, { $inc: { credit: -1 } }, { new: true });

        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);

    } catch (error) {
        console.error('Puppeteer Image Generation Error:', error);
        
        // If the actual browser crashed, force reset so next request works
        if(browserInstance && !browserInstance.isConnected()) {
             browserInstance = null; 
        }

        res.status(500).json({ message: 'Failed to generate image.', details: error.message });
    } finally {
        // CRITICAL: Close only the page, keep browser open for next user
        if (page) {
            await page.close();
        }
    }
})

export { previewData };