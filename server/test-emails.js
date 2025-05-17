/**
 * Simple Email Template Tester
 * 
 * This script renders all email templates with sample data and saves them as HTML files
 * that you can open in your browser to preview how they look.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { exec } from 'child_process';

// Get current file directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory paths
const templatesDir = path.join(__dirname, 'mails', 'templates');
const outputDir = path.join(__dirname, 'test-emails');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Sample data for templates
const sampleData = {
    name: 'John Doe',
    otp: '123456',
    websiteUrl: 'https://preplings.com',
    provider: 'Google',
    firstName: 'John',
    lastName: 'Doe',
    subject: 'Course Enrollment',
    referenceId: 'REF-12345',
    submissionDate: new Date().toLocaleDateString()
};

// Function to open a file in the default browser
function openInBrowser(filePath) {
    const absolutePath = path.resolve(filePath);
    const command = process.platform === 'win32' 
        ? `start "" "${absolutePath}"` 
        : process.platform === 'darwin' 
            ? `open "${absolutePath}"` 
            : `xdg-open "${absolutePath}"`;
    
    exec(command, (error) => {
        if (error) {
            console.error(`Failed to open ${filePath} in browser:`, error);
        }
    });
}

// Create an index.html file that links to all rendered templates
function createIndexFile(renderedFiles) {
    const indexPath = path.join(outputDir, 'index.html');
    let indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Templates Preview</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #4A90E2;
                border-bottom: 2px solid #4A90E2;
                padding-bottom: 10px;
            }
            .template-list {
                list-style: none;
                padding: 0;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
            }
            .template-item {
                padding: 15px;
                background-color: #f5f5f5;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .template-link {
                display: block;
                color: #4A90E2;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 5px;
                text-decoration: none;
            }
            .template-link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>Email Templates Preview</h1>
        <p>Click on any template below to preview how it looks:</p>
        <ul class="template-list">
    `;

    // Add links to each rendered template
    renderedFiles.forEach(file => {
        const fileName = path.basename(file);
        const templateName = fileName.replace('.html', '');
        
        indexContent += `
            <li class="template-item">
                <a href="${fileName}" class="template-link" target="_blank">${templateName}</a>
            </li>
        `;
    });

    indexContent += `
        </ul>
    </body>
    </html>
    `;

    fs.writeFileSync(indexPath, indexContent);
    return indexPath;
}

// Main function to render all templates
async function renderTemplates() {
    console.log('🚀 Starting email template test...');
    
    try {
        // Get all template files
        const templateFiles = fs.readdirSync(templatesDir)
            .filter(file => file.endsWith('.ejs'))
            .map(file => file.replace('.ejs', ''));
        
        console.log(`Found ${templateFiles.length} templates: ${templateFiles.join(', ')}`);
        
        const renderedFiles = [];
        
        // Render each template
        for (const templateName of templateFiles) {
            try {
                const templatePath = path.join(templatesDir, `${templateName}.ejs`);
                const templateContent = fs.readFileSync(templatePath, 'utf8');
                
                // Render the template with sample data
                const renderedHtml = await ejs.render(templateContent, sampleData, { async: true });
                
                // Save the rendered HTML
                const outputPath = path.join(outputDir, `${templateName}.html`);
                fs.writeFileSync(outputPath, renderedHtml);
                
                console.log(`✅ Rendered ${templateName}.ejs`);
                renderedFiles.push(outputPath);
            } catch (error) {
                console.error(`❌ Error rendering ${templateName}.ejs:`, error.message);
            }
        }
        
        // Create and open index file
        if (renderedFiles.length > 0) {
            const indexPath = createIndexFile(renderedFiles);
            console.log(`\n✨ All templates rendered! Opening preview...`);
            openInBrowser(indexPath);
        } else {
            console.error('❌ No templates were successfully rendered.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
renderTemplates();
