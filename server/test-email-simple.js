// CommonJS version for compatibility
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

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

// Create a test transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'care@preplings.com',
        pass: process.env.EMAIL_PASSWORD || 'AWMA4KAjFaep'
    },
    debug: true
});

// Test the connection
async function testConnection() {
    try {
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
        console.error('❌ Error:', error);
        if (error.response) {
            console.error('Server response:', error.response);
        }
    }
}

// Run the test
testConnection().catch(console.error);
