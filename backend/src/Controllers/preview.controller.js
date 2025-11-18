import { asyncHandler } from "../Utilities/asyncHandler.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import React from 'react'; 
import ReactDOMServer from 'react-dom/server';
import Whatsapp from '../Platforms-ui/whatsapp-ui.jsx';
import puppeteer from 'puppeteer';

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

/**
 * Gets the background image path based on platform
 * @param {string} platform - Platform name (whatsapp, instagram, telegram, etc.)
 * @returns {string} Base64 data URL of the background image
 */
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
    
    console.log(`Looking for background image at: ${imagePath}`);
    console.log(`Assets path: ${ASSETS_PATH}`);
    console.log(`File exists: ${fs.existsSync(imagePath)}`);
    
    // Check if file exists, if not use default
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
    if (base64) {
        console.log(`Background image converted successfully. Base64 length: ${base64.length}`);
    } else {
        console.error('Failed to convert background image to base64');
    }
    
    return base64;
}

/**
 * Generates the full, styled HTML string for Puppeteer consumption.
 * @param {string} messageData - The text input from the frontend.
 * @returns {string} The complete HTML document.
 */

const previewData = asyncHandler( async(req, res) => {
    const {sender, receiver, messages, receiverAvatar, senderAvatar, platform, isDarkMode} = req.body;

    if( !sender || !receiver || !messages){
        return res.status(401).send('Either sender, receiver or messages not found!')
    }

    // Get background image as base64 from backend assets
    const bgImg = getBackgroundImage(platform, isDarkMode);
    
    // Log if background image is missing
    if (!bgImg) {
        console.warn('Warning: Background image is null. Screenshot may not have background.');
    } else {
        console.log('Background image loaded successfully');
    }

    // 4. SSR: Render the React component with data into a plain HTML string
    const componentHTML = ReactDOMServer.renderToString(
        // Pass the message data as a prop
        <div className={isDarkMode ? 'dark' : ''}>
            <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} bgImg={bgImg} /> 
        </div>
    );

    // 5. Construct the final HTML document with EMBEDDED CSS
    const finalHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                /* 6. EMBED THE STYLES HERE */
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
        // Launch the browser instance
        browser = await puppeteer.launch({ 
            headless: 'new', // Use 'new' headless mode for modern performance
            // These arguments are crucial for running Puppeteer reliably on production Linux servers (like a VPS or Docker)
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }); 
        
        const page = await browser.newPage();
        
        // Set a consistent size for the viewport. Adjust width/height as needed for your chat UI.
        await page.setViewport({ 
            width: 375, 
            height: 812, 
            deviceScaleFactor: 3 // Renders the content 3x sharper
        });

        // Load the complete HTML string. Puppeteer renders this with the embedded CSS.
        await page.setContent(finalHtml, {
            waitUntil: 'networkidle0' // Waits until network activity has been idle for 500ms (useful for loading fonts/icons)
        });

        // Wait a bit more to ensure background images are fully loaded
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. Find the target element using its ID (which was '#whatsapp-root' in the template)
        const elementToCapture = await page.$('#whatsapp-root');
        
        if (!elementToCapture) {
            // Handle case where the element wasn't rendered
            throw new Error("Target element #whatsapp-root not found.");
        }

        // 2. Take a screenshot of only the bounding box of the element, returning a binary buffer
        const imageBuffer = await elementToCapture.screenshot({
            type: 'png' // PNG is usually better for sharp UI screenshots
        });

        // 1. Set the Content-Type header to tell the client this is an image
        res.set('Content-Type', 'image/png');
        
        // 2. Send the raw image data buffer
        res.send(imageBuffer);

    } catch (error) {
        console.error('Puppeteer Image Generation Error:', error);
        // Send a JSON error response
        res.status(500).json({ message: 'Failed to generate image.', details: error.message });
    } finally {
        // 3. IMPORTANT: Always close the browser instance to prevent memory leaks
        if (browser) {
            await browser.close();
        }
    }

    // res.status(200).json({message: "Data received successfully!", previewHtml: finalHtml});
})

export {previewData};

