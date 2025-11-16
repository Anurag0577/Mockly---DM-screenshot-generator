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

/**
 * Generates the full, styled HTML string for Puppeteer consumption.
 * @param {string} messageData - The text input from the frontend.
 * @returns {string} The complete HTML document.
 */

const previewData = asyncHandler( async(req, res) => {
    const {sender, receiver, messages, receiverAvatar, senderAvatar} = req.body;

    if( !sender || !receiver || !messages){
        return res.status(401).send('Either sender, receiver or messages not found!')
    }

    // 4. SSR: Render the React component with data into a plain HTML string
    const componentHTML = ReactDOMServer.renderToString(
        // Pass the message data as a prop
        <Whatsapp sender={sender} receiver={receiver} messages={messages} receiverAvatar={receiverAvatar} senderAvatar={senderAvatar} /> 
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

