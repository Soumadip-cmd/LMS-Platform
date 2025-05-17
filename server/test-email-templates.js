/**
 * Test Email Templates
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
    // Common data for all templates
    common: {
        websiteUrl: 'https://preplings.com',
    },
    // Template-specific data
    verification: {
        name: 'John Doe',
        otp: '123456',
    },
    'email-verification': {
        name: 'Jane Smith',
        otp: '789012',
    },
    'otp-verification': {
        name: 'Alex Johnson',
        otp: '345678',
        provider: 'Email',
    },
    'otp-google-verification': {
        name: 'Michael Brown',
        otp: '901234',
        provider: 'Google',
    },
    'reset-password': {
        name: 'Sarah Wilson',
        otp: '567890',
    },
    'password-changed': {
        name: 'David Miller',
    },
    'welcome': {
        name: 'Emily Davis',
    },
    'contact-confirmation': {
        firstName: 'Robert',
        lastName: 'Taylor',
        subject: 'Course Enrollment Question',
        referenceId: 'REF-12345',
        submissionDate: new Date().toLocaleDateString(),
    },
    // Add any other templates here
};

// Create an index.html file that links to all rendered templates
function createIndexFile(renderedFiles) {
    const indexPath = path.join(outputDir, 'index.html');
    let indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preplings Email Templates Preview</title>
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
            }
            .template-item {
                margin-bottom: 15px;
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
            .template-description {
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <h1>Preplings Email Templates Preview</h1>
        <p>Click on any template below to preview how it looks:</p>
        <ul class="template-list">
    `;

    // Add links to each rendered template
    renderedFiles.forEach(file => {
        const fileName = path.basename(file);
        const templateName = fileName.replace('.html', '');
        let description = 'Email template preview';

        // Add specific descriptions for each template
        switch(templateName) {
            case 'verification':
                description = 'Account verification email with OTP code';
                break;
            case 'email-verification':
                description = 'Email verification template with OTP code';
                break;
            case 'otp-verification':
                description = 'OTP verification for standard login';
                break;
            case 'otp-google-verification':
                description = 'OTP verification for Google login';
                break;
            case 'reset-password':
                description = 'Password reset request email';
                break;
            case 'password-changed':
                description = 'Password change confirmation email';
                break;
            case 'welcome':
                description = 'Welcome email for new users';
                break;
            case 'contact-confirmation':
                description = 'Contact form submission confirmation';
                break;
        }

        indexContent += `
            <li class="template-item">
                <a href="${fileName}" class="template-link" target="_blank">${templateName}</a>
                <div class="template-description">${description}</div>
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

// Function to render a template with sample data
async function renderTemplate(templateName) {
    try {
        // Read the template file
        const templatePath = path.join(templatesDir, `${templateName}.ejs`);

        // Check if the template file exists
        if (!fs.existsSync(templatePath)) {
            console.warn(`⚠️ Template file not found: ${templatePath}`);
            return null;
        }

        const templateContent = fs.readFileSync(templatePath, 'utf8');

        // Combine common data with template-specific data
        const data = {
            ...sampleData.common,
            ...(sampleData[templateName] || {}),
        };

        // Render the template
        const renderedHtml = await ejs.render(templateContent, data, { async: true });

        // Save the rendered HTML to a file
        const outputPath = path.join(outputDir, `${templateName}.html`);
        fs.writeFileSync(outputPath, renderedHtml);

        console.log(`✅ Rendered ${templateName}.ejs to ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error(`❌ Error rendering ${templateName}.ejs:`, error.message);
        return null;
    }
}

// Render all templates
async function renderAllTemplates() {
    console.log('🚀 Starting email template test...');
    console.log(`📁 Templates directory: ${templatesDir}`);
    console.log(`📁 Output directory: ${outputDir}`);

    // Get all template files from the directory
    const templateFiles = fs.readdirSync(templatesDir)
        .filter(file => file.endsWith('.ejs'))
        .map(file => file.replace('.ejs', ''));

    console.log(`📋 Found ${templateFiles.length} templates: ${templateFiles.join(', ')}`);

    const renderedFiles = [];

    for (const template of templateFiles) {
        const outputPath = await renderTemplate(template);
        if (outputPath) {
            renderedFiles.push(outputPath);
        }
    }

    // Create index file
    const indexPath = createIndexFile(renderedFiles);
    console.log(`✅ Created index file: ${indexPath}`);

    console.log('\n✨ All templates rendered!');
    console.log('📋 Summary:');
    renderedFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${path.basename(file)}`);
    });

    console.log('\n📝 Instructions:');
    console.log('   1. Opening index.html in your default browser...');
    console.log(`   2. All files are located in: ${outputDir}`);

    // Open the index file in the default browser
    openInBrowser(indexPath);
}

// Run the script
renderAllTemplates().catch(error => {
    console.error('❌ Error:', error);
});
