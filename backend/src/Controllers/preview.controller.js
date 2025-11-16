import { asyncHandler } from "../Utilities/asyncHandler.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import React from 'react'; 
import ReactDOMServer from 'react-dom/server';
import Whatsapp from '../Platforms-ui/whatsapp-ui.jsx';

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

const previewData = asyncHandler((req, res) => {
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

    res.status(200).json({message: "Data received successfully!", previewHtml: finalHtml});
})

export {previewData};

