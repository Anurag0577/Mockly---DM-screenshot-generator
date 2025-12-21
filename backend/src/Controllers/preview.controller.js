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

/**
 * Converts an image file to base64 data URL
 * @param {string} imagePath - Path to the image file
 * @returns {string} Base64 data URL
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
        instagram: 'whatsapp_bg.jpg', // Add your instagram bg when available
        telegram: 'whatsapp_bg.jpg', // Add your telegram bg when available
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

    if (!bgImg) {
        console.warn('Warning: Background image is null. Screenshot may not have background.');
    }

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

    let browser;
    try {

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath:
                process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
        });

        const page = await browser.newPage();


        await page.setViewport({
            width: 375,
            height: 812,
            deviceScaleFactor: 3
        });


        await page.setContent(finalHtml, {
            waitUntil: 'networkidle0'
        });


        await new Promise(resolve => setTimeout(resolve, 500));


        const elementToCapture = await page.$('#whatsapp-root');

        if (!elementToCapture) {
            throw new Error("Target element #whatsapp-root not found.");
        }

        const imageBuffer = await elementToCapture.screenshot({
            type: 'png'
        });

        // Decrease credit by one on every image generation.

        const userId = req.user._id; // 1. get user id from the req.user
        const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { credit: -1 } }, { new: true }); // 2. decrease credit by 1 

        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);

    } catch (error) {
        console.error('Puppeteer Image Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate image.', details: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }

})

export { previewData };

