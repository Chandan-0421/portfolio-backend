const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// server.js ke andar "app.use(express.json());" ke niche ye daalo:
app.get('/', (req, res) => {
    res.send("Backend is live and running! 🚀");
});

// Route for Form Submission
app.post('/send-message', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Nodemailer Transporter Setup
        const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Port 465 ke liye true rahega
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Ye connection ko fail hone se rokta hai
    },
    connectionTimeout: 10000, // 10 seconds wait karega
    greetingTimeout: 10000,
    socketTimeout: 10000
});

        // Email Format
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Message tumhare email par aayega
            replyTo: email, // Jab tum reply karoge toh direct user ko jayega
            subject: `💼 New Portfolio Message from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">New Message Received! 🚀</h2>
                    </div>
                    <div style="padding: 20px; background-color: #f8fafc; color: #334155;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                        <p><strong>Message:</strong></p>
                        <p style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <div style="background-color: #e2e8f0; text-align: center; padding: 10px; font-size: 12px; color: #64748b;">
                        Sent from Chandan's Portfolio
                    </div>
                </div>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        
        console.log(`Email successfully sent from ${name}`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message.',
            error: error.message,
            code: error.code
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});