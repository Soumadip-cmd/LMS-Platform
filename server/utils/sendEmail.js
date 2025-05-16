
import nodemailer from "nodemailer";
import path from "path";
import ejs from 'ejs';
// Configure email transport
// Log email configuration for debugging
console.log('Email Configuration:', {
    host: process.env.EMAIL_SERVICE || 'smtp.zoho.in',
    port: 465,
    user: process.env.EMAIL_USER || 'care@preplings.com'
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE || 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'care@preplings.com',
        pass: process.env.EMAIL_PASSWORD || 'AWMA4KAjFaep',
        type: 'login'  // Explicitly set authentication type
    },
    debug: true  // Enable debug for troubleshooting
});


export const sendEmail = async (to, subject, template, data) => {
    try {
        // In development mode, just log the email details and don't actually send
        if (process.env.NODE_ENV === 'development') {
            console.log('=================================================');
            console.log(`📧 EMAIL WOULD BE SENT TO: ${to}`);
            console.log(`📧 SUBJECT: ${subject}`);
            console.log(`📧 TEMPLATE: ${template}`);

            // If this is an OTP email, log the OTP prominently
            if (template.includes('otp') && data.otp) {
                console.log(`🔑 VERIFICATION CODE: ${data.otp}`);
            }

            console.log('📧 DATA:', data);
            console.log('=================================================');

            // Return without actually sending the email
            return;
        }

        // Get template path
        const templatePath = path.join(process.cwd(), 'mails', 'templates', `${template}.ejs`);

        // Render template with data
        const html = await ejs.renderFile(templatePath, data);

        // Send email
        await transporter.sendMail({
            from: `"Preplings" <${process.env.EMAIL_FROM || 'care@preplings.com'}>`,
            to,
            subject,
            html
        });

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Email sending failed:", error);

        // In development mode, don't throw an error, just log it
        if (process.env.NODE_ENV === 'development') {
            console.log('Email would have been sent in production mode');
        } else {
            throw new Error("Failed to send email");
        }
    }
};