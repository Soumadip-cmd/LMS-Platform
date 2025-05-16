import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the environment variables for debugging
console.log('Email Configuration from ENV:', {
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    // Don't log the actual password for security reasons
    EMAIL_PASSWORD_SET: process.env.EMAIL_PASSWORD ? 'Yes' : 'No'
});

// Try different configurations
const testConfigurations = [
    {
        name: 'Configuration 1: Basic Zoho',
        config: {
            host: 'smtp.zoho.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || 'care@preplings.com',
                pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B'
            }
        }
    },
    {
        name: 'Configuration 2: With Login Type',
        config: {
            host: 'smtp.zoho.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || 'care@preplings.com',
                pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B',
                type: 'login'
            }
        }
    },
    {
        name: 'Configuration 3: Zoho Mail Service',
        config: {
            service: 'Zoho',
            auth: {
                user: process.env.EMAIL_USER || 'care@preplings.com',
                pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B'
            }
        }
    },
    {
        name: 'Configuration 4: Alternative Port',
        config: {
            host: 'smtp.zoho.in',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'care@preplings.com',
                pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B'
            }
        }
    },
    {
        name: 'Configuration 5: SMTP Pro Zoho',
        config: {
            host: 'smtppro.zoho.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || 'care@preplings.com',
                pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B'
            }
        }
    }
];

// Test each configuration
async function testEmailConfigurations() {
    console.log('Starting email configuration tests...');

    for (const { name, config } of testConfigurations) {
        console.log(`\nTesting ${name}...`);
        console.log('Configuration:', JSON.stringify(config, null, 2));

        try {
            // Create transporter
            const transporter = nodemailer.createTransport(config);

            // Verify connection
            console.log('Verifying connection...');
            await transporter.verify();
            console.log('✅ Connection successful!');

            // Try sending a test email
            console.log('Sending test email...');
            const info = await transporter.sendMail({
                from: `"Preplings Test" <${process.env.EMAIL_FROM || 'care@preplings.com'}>`,
                to: 'freelixe04@gmail.com', // Use your test email
                subject: 'Test Email from Preplings',
                text: 'This is a test email to verify the email configuration.',
                html: '<b>This is a test email to verify the email configuration.</b>'
            });

            console.log('✅ Email sent successfully!');
            console.log('Message ID:', info.messageId);
        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Server response:', error.response);
            }
        }
    }

    console.log('\nEmail configuration tests completed.');
}

// Run the tests
testEmailConfigurations().catch(console.error);
