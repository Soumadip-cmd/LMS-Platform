
import nodemailer from "nodemailer";
import path from "path";
import ejs from 'ejs';
// Configure email transport
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: 'preplings@zohomail.in',
        pass: 'EvGdpzjJprNs'
    },
    debug: true
});


export const sendEmail = async (to, subject, template, data) => {
    try {
        // Get template path
        const templatePath = path.join(process.cwd(), 'mails', 'templates', `${template}.ejs`);
        
        // Render template with data
        const html = await ejs.renderFile(templatePath, data);
        
        // Send email
        await transporter.sendMail({
            from: `"Preplings" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Failed to send email");
    }
};