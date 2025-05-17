/**
 * Enhanced Email Template Tester
 *
 * This script renders all email templates with sample data and saves them as HTML files
 * that you can open in your browser to preview how they look.
 * It also enhances the templates with a golden yellow color scheme.
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
const enhancedTemplatesDir = path.join(__dirname, 'test-emails', 'enhanced-templates');

// Create output directories if they don't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(enhancedTemplatesDir)) {
    fs.mkdirSync(enhancedTemplatesDir, { recursive: true });
}

// Brand colors
const brandColors = {
    primary: '#FFD700', // Golden Yellow
    primaryDark: '#E6C200', // Darker Golden Yellow
    primaryLight: '#FFF0A0', // Light Golden Yellow
    secondary: '#333333', // Dark Gray
    accent: '#4A90E2', // Blue accent
    text: '#333333', // Text color
    textLight: '#666666', // Light text color
    background: '#FFFFFF', // Background color
    backgroundLight: '#FFFDF5', // Light background with yellow tint
    success: '#28A745', // Green for success messages
    warning: '#FFC107', // Yellow for warnings
    error: '#DC3545', // Red for errors
};

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

// Function to enhance a template with golden yellow branding
function enhanceTemplate(html) {
    // Replace blue color with golden yellow in styles
    let enhancedHtml = html
        // Replace header background color
        .replace(/#4A90E2/g, brandColors.primary)
        .replace(/#3A7BC8/g, brandColors.primaryDark)

        // Update button styles
        .replace(/background-color: #4A90E2;/g, `background-color: ${brandColors.primary}; color: ${brandColors.secondary};`)
        .replace(/color: white;/g, `color: ${brandColors.secondary};`)

        // Update hover states
        .replace(/background-color: #3A7BC8;/g, `background-color: ${brandColors.primaryDark}; color: ${brandColors.secondary};`)

        // Update code container
        .replace(/background-color: #F9FAFB;/g, `background-color: ${brandColors.backgroundLight};`)
        .replace(/color: #4A90E2;/g, `color: ${brandColors.primaryDark};`)

        // Update footer
        .replace(/background-color: #F9FAFB;/g, `background-color: ${brandColors.backgroundLight};`)

        // Update links
        .replace(/color: #4A90E2; text-decoration: none;/g, `color: ${brandColors.primaryDark}; text-decoration: none;`);

    // Add custom font import
    enhancedHtml = enhancedHtml.replace(
        /<head>/,
        `<head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
    );

    // Update font family
    enhancedHtml = enhancedHtml.replace(
        /font-family: ['"]?Inter['"]?, -apple-system/g,
        `font-family: 'Poppins', -apple-system`
    );

    // Add a subtle golden gradient to the header
    enhancedHtml = enhancedHtml.replace(
        /background-color: #FFD700;/g,
        `background-image: linear-gradient(to right, ${brandColors.primary}, ${brandColors.primaryDark});`
    );

    // Add a subtle shadow to the container
    enhancedHtml = enhancedHtml.replace(
        /box-shadow: 0 4px 6px -1px rgba\(0, 0, 0, 0.1\), 0 2px 4px -1px rgba\(0, 0, 0, 0.06\);/g,
        `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);`
    );

    return enhancedHtml;
}

// Create an index.html file that links to all rendered templates
function createIndexFile(renderedFiles, enhancedFiles) {
    const indexPath = path.join(outputDir, 'index.html');
    let indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preplings Email Templates Preview</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.5;
                color: ${brandColors.text};
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            h1 {
                color: ${brandColors.primary};
                border-bottom: 2px solid ${brandColors.primary};
                padding-bottom: 10px;
                text-align: center;
                font-weight: 700;
            }
            h2 {
                color: ${brandColors.secondary};
                margin-top: 40px;
                font-weight: 600;
                border-left: 4px solid ${brandColors.primary};
                padding-left: 10px;
            }
            .intro {
                text-align: center;
                margin-bottom: 30px;
            }
            .template-list {
                list-style: none;
                padding: 0;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
            .template-item {
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                transition: transform 0.2s, box-shadow 0.2s;
                border: 1px solid #eee;
            }
            .template-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            }
            .template-link {
                display: block;
                color: ${brandColors.primary};
                font-weight: 600;
                font-size: 18px;
                margin-bottom: 10px;
                text-decoration: none;
            }
            .template-link:hover {
                color: ${brandColors.primaryDark};
            }
            .template-description {
                color: ${brandColors.textLight};
                font-size: 14px;
                margin-bottom: 15px;
            }
            .template-preview {
                display: block;
                background-color: ${brandColors.primary};
                color: ${brandColors.secondary};
                text-align: center;
                padding: 8px 16px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            .template-preview:hover {
                background-color: ${brandColors.primaryDark};
            }
            .enhanced-preview {
                background-color: ${brandColors.secondary};
                color: ${brandColors.primary};
            }
            .enhanced-preview:hover {
                background-color: #222;
            }
            .logo {
                text-align: center;
                margin-bottom: 20px;
            }
            .logo img {
                max-width: 200px;
                height: auto;
            }
            footer {
                margin-top: 50px;
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: ${brandColors.textLight};
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="logo">
            <img src="https://preplings.com/logo.png" alt="Preplings Logo">
        </div>
        <h1>Email Templates Preview</h1>
        <div class="intro">
            <p>Click on any template below to preview how it looks. Each template is available in the original design and an enhanced golden yellow design.</p>
        </div>

        <h2>Email Templates</h2>
        <ul class="template-list">
    `;

    // Add links to each rendered template
    renderedFiles.forEach((file, index) => {
        const fileName = path.basename(file);
        const templateName = fileName.replace('.html', '');
        const enhancedFileName = path.basename(enhancedFiles[index]);

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
            default:
                description = `${templateName.replace(/-/g, ' ')} email template`;
        }

        indexContent += `
            <li class="template-item">
                <a href="${fileName}" class="template-link" target="_blank">${templateName.replace(/-/g, ' ')}</a>
                <div class="template-description">${description}</div>
                <div style="display: flex; gap: 10px;">
                    <a href="${fileName}" class="template-preview" target="_blank">Original</a>
                    <a href="enhanced-templates/${enhancedFileName}" class="template-preview enhanced-preview" target="_blank">Enhanced</a>
                </div>
            </li>
        `;
    });

    indexContent += `
        </ul>
        <footer>
            <p>&copy; ${new Date().getFullYear()} Preplings. All rights reserved.</p>
        </footer>
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

        console.log(`📋 Found ${templateFiles.length} templates: ${templateFiles.join(', ')}`);

        const renderedFiles = [];
        const enhancedFiles = [];

        // Render each template
        for (const templateName of templateFiles) {
            try {
                const templatePath = path.join(templatesDir, `${templateName}.ejs`);
                const templateContent = fs.readFileSync(templatePath, 'utf8');

                // Render the template with sample data
                const renderedHtml = await ejs.render(templateContent, sampleData, { async: true });

                // Save the original rendered HTML
                const outputPath = path.join(outputDir, `${templateName}.html`);
                fs.writeFileSync(outputPath, renderedHtml);

                // Create enhanced version with golden yellow branding
                const enhancedHtml = enhanceTemplate(renderedHtml);
                const enhancedOutputPath = path.join(enhancedTemplatesDir, `${templateName}.html`);
                fs.writeFileSync(enhancedOutputPath, enhancedHtml);

                console.log(`✅ Rendered ${templateName}.ejs (original and enhanced)`);
                renderedFiles.push(outputPath);
                enhancedFiles.push(enhancedOutputPath);
            } catch (error) {
                console.error(`❌ Error rendering ${templateName}.ejs:`, error.message);
            }
        }

        // Create and open index file
        if (renderedFiles.length > 0) {
            const indexPath = createIndexFile(renderedFiles, enhancedFiles);
            console.log(`\n✨ All templates rendered! Opening preview...`);
            console.log(`📁 Original templates: ${outputDir}`);
            console.log(`📁 Enhanced templates: ${enhancedTemplatesDir}`);
            openInBrowser(indexPath);
        } else {
            console.error('❌ No templates were successfully rendered.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Create a template for a new golden yellow branded email
function createGoldenTemplate() {
    const goldenTemplatePath = path.join(outputDir, 'golden-template.html');

    const goldenTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preplings Email Template</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Base styles */
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #F3F4F6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Container */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Logo container */
        .logo-container {
            text-align: center;
            padding: 1.5rem 0 1rem 0;
        }

        .logo {
            max-width: 150px;
            height: auto;
        }

        /* Header */
        .header {
            background-image: linear-gradient(to right, #FFD700, #E6C200);
            padding: 1.5rem;
            text-align: center;
            color: #333333;
        }

        .header h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
        }

        /* Content */
        .content {
            padding: 2rem 1.5rem;
        }

        /* Code container */
        .code-container {
            background-color: #FFFDF5;
            border: 1px solid #E5E7EB;
            border-radius: 0.5rem;
            padding: 1.25rem;
            margin: 1.5rem 0;
            text-align: center;
        }

        .verification-code {
            font-size: 2rem;
            font-weight: 700;
            color: #E6C200;
            letter-spacing: 0.25rem;
        }

        .expiry-note {
            font-size: 0.875rem;
            color: #666666;
            text-align: center;
            margin-top: 0.5rem;
        }

        /* Message */
        .message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        /* Button */
        .button-container {
            text-align: center;
            margin: 1.5rem 0;
        }

        .button {
            display: inline-block;
            background-color: #FFD700;
            color: #333333;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 600;
            transition: background-color 0.2s;
        }

        .button:hover {
            background-color: #E6C200;
        }

        /* Footer */
        .footer {
            background-color: #FFFDF5;
            padding: 1.25rem;
            text-align: center;
            font-size: 0.875rem;
            color: #666666;
            border-top: 1px solid #E5E7EB;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
            .container {
                border-radius: 0;
            }

            .content {
                padding: 1.5rem 1rem;
            }

            .verification-code {
                font-size: 1.75rem;
                letter-spacing: 0.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="https://preplings.com/logo.png" alt="Preplings Logo" class="logo">
        </div>
        <div class="header">
            <h1>Your Email Title Here</h1>
        </div>
        <div class="content">
            <div class="message">
                <p>Hello [Name],</p>
                <p>This is a sample golden yellow branded email template for Preplings. You can use this as a starting point for creating new email templates.</p>
            </div>

            <div class="code-container">
                <div class="verification-code">123456</div>
                <p class="expiry-note">This code will expire in 15 minutes</p>
            </div>

            <p>Additional information can go here.</p>
            <p>Best regards,<br>The Preplings Team</p>

            <div class="button-container">
                <a href="https://preplings.com" class="button">Call to Action</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Preplings. All rights reserved.</p>
            <p>If you have any questions, please contact our support team at <a href="mailto:care@preplings.com" style="color: #E6C200; text-decoration: none;">care@preplings.com</a></p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(goldenTemplatePath, goldenTemplate);
    console.log(`✅ Created golden template: ${goldenTemplatePath}`);
    return goldenTemplatePath;
}

// Run the script
async function main() {
    try {
        // Create a golden template as a reference
        const goldenTemplatePath = createGoldenTemplate();

        // Render all templates
        await renderTemplates();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
