const fs = require('fs');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer-core');
const { replacePlaceholders } = require('./placeholders');

// Read files
const letterContent = fs.readFileSync('letter.html', 'utf8');
const recipients = fs.readFileSync('list.txt', 'utf8').trim().split('\n');

// Set to true to send attachment, false to not send
const sendAttachment = true;

// Create transporter
const emailTransporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
        user: 'AKIA36SILFG4J3KCP4WM',
        pass: 'BFqfZQUrC1QSx2wuSvKP5wywPQvQ7k3UiMDAakfBJOO3'
    }
});

// Email options
let mailOptions = {
    subject: 'Good Morning ##victimemail##', // Subject with placeholders
    html: letterContent, // Letter content
    priority: 'low' // Default priority is set to low
};

// Send emails one by one
async function sendEmails() {
    for (const recipient of recipients) {
        const subject = replacePlaceholders('Good Morning ##victimemail## ##victimdomain1##', [recipient]);
        const from = replacePlaceholders('"##num3##" <info@schreinerei-spuck.de>', [recipient]);
        const html = replacePlaceholders(letterContent, [recipient]);

        // Replace placeholders in attachment filename
        let attachmentFileName = replacePlaceholders('##victimdomain2##_attachment.pdf', [recipient]);

        // Add attachment if sendAttachment is true
        if (sendAttachment) {
            const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' }); // Specify the path to Chrome executable
            const page = await browser.newPage();
            await page.setContent(html);
            await page.pdf({ path: attachmentFileName, format: 'A4' });
            await browser.close();

            mailOptions.attachments = [{
                filename: attachmentFileName,
                path: attachmentFileName,
                contentType: 'application/pdf',
            }];
        }

        const mailOptionsWithAttachment = { ...mailOptions, to: recipient, subject, from, html };

        // Send email
        try {
            await emailTransporter.sendMail(mailOptionsWithAttachment);
            console.log('Email sent to:', recipient);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Start sending emails
sendEmails();
