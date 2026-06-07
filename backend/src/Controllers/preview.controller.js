import { asyncHandler } from "../Utilities/asyncHandler.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Whatsapp from '../Platforms-ui/whatsapp-ui.jsx';
import puppeteer from 'puppeteer';
import Instagram from '../Platforms-ui/Instagram-ui.jsx';
import twemoji from 'twemoji';
import https from 'https';
import { User } from "../Models/User.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_PATH = path.join(__dirname, '../../templates/tailwind.output.css');
const TAILWIND_CSS_STRING = fs.readFileSync(CSS_PATH, 'utf-8');


const ASSETS_PATH = path.join(__dirname, '../Platforms-ui/Assets');


let browserInstance = null;

async function getBrowser() {

    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }

    // Otherwise launch a new one
    console.log("Launching new browser instance...");
    browserInstance = await puppeteer.launch({
        headless: true, 
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", 
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
    const { sender, receiver, messages, receiverAvatar, senderAvatar, platform, isDarkMode, isHeaderFooterRendered } = req.body;

    if (!sender || !receiver || !messages) {
        return res.status(401).send('Either sender, receiver or messages not found!')
    }
    const bgImg = getBackgroundImage(platform, isDarkMode);

    let platformComponent;
    switch (platform?.toLowerCase()) {
        case 'instagram':
            platformComponent = <Instagram sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} isHeaderFooterRendered={isHeaderFooterRendered} />;
            break;
        case 'whatsapp':
            platformComponent = <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} isHeaderFooterRendered={isHeaderFooterRendered}/>;
            break;
        default:isDarkMode
            platformComponent = <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} isHeaderFooterRendered={isHeaderFooterRendered}/>;
    }

    let componentHTML = ReactDOMServer.renderToString(
        <div className={isDarkMode ? 'dark' : ''}>
            {platformComponent}
        </div>
    );

    
    try {
        componentHTML = twemoji.parse(componentHTML, {
            folder: 'svg',
            ext: '.svg',
            base: 'https://twemoji.maxcdn.com/v/latest/',
        });


        const imgSrcRegex = /<img[^>]+src="([^"]+\.svg)"[^>]*>/g;
        const urls = new Set();
        let match;
        while ((match = imgSrcRegex.exec(componentHTML)) !== null) {
            urls.add(match[1]);
        }

        async function fetchSvgAsDataUrl(url) {
            return new Promise((resolve) => {
                try {
                    const req = https.get(url, (res) => {
                        let raw = '';
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => raw += chunk);
                        res.on('end', () => {
                            try {
                                const b64 = Buffer.from(raw).toString('base64');
                                resolve(`data:image/svg+xml;base64,${b64}`);
                            } catch (e) {
                                console.warn('Failed to base64-encode SVG from', url, e);
                                resolve(url);
                            }
                        });
                    });
                    req.on('error', (err) => {
                        console.warn('Failed to fetch Twemoji SVG', url, err);
                        resolve(url);
                    });
                } catch (e) {
                    console.warn('Error during https.get for', url, e);
                    resolve(url);
                }
            });
        }

        if (urls.size > 0) {
            const replacements = {};
            await Promise.all(Array.from(urls).map(async (u) => {
                const dataUrl = await fetchSvgAsDataUrl(u);
                replacements[u] = dataUrl;
            }));

            for (const [orig, dataUrl] of Object.entries(replacements)) {
                componentHTML = componentHTML.split(orig).join(dataUrl);
            }
        }

    } catch (e) {
        console.warn('Twemoji parse or inline failed, continuing with original HTML', e);
    }

    const finalHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                body, html {
                    font-family: 'Roboto', sans-serif;
                }
                /* Ensure Twemoji images match the surrounding text size and baseline */
                img.emoji, .emoji {
                    width: 1em !important;
                    height: 1em !important;
                    display: inline-block !important;
                    vertical-align: -0.125em !important;
                }
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

    let page = null; 

    try {
 
        const browser = await getBrowser();
        

        page = await browser.newPage();

        await page.setViewport({
            width: 375,
            height: 812,
            deviceScaleFactor: 3
        });


        await page.setContent(finalHtml, {
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });


        await page.evaluate(() => document.fonts.ready);


        await new Promise(resolve => setTimeout(resolve, 300));

        const elementToCapture = await page.$('#whatsapp-root');

        if (!elementToCapture) {
            throw new Error("Target element #whatsapp-root not found.");
        }

        const imageBuffer = await elementToCapture.screenshot({
            type: 'png'
        });


        const userId = req.user._id; 
        await User.findByIdAndUpdate(userId, { $inc: { credit: -1 } }, { new: true });

        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);

    } catch (error) {
        console.error('Puppeteer Image Generation Error:', error);
        
 
        if(browserInstance && !browserInstance.isConnected()) {
             browserInstance = null; 
        }

        res.status(500).json({ message: 'Failed to generate image.', details: error.message });
    } finally {

        if (page) {
            await page.close();
        }
    }
})

export { previewData };