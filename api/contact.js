/**
 * Secure Serverless / Node.js Contact Form API Endpoint
 * For Vercel or any Node.js serverless runtime.
 * 
 * CRITICAL SECURITY:
 * - NEVER hardcode SMTP credentials in source code.
 * - All credentials must be read from environment variables.
 * - Protects against spam, rate-limits, validates all fields, and returns generic error messages.
 */

try {
    require('dotenv').config();
} catch (e) {
    // dotenv optional in pre-configured environments
}

const nodemailer = require('nodemailer');

// Simple in-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);
    return false;
}

// Clean up old rate limit entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, timestamps] of rateLimitMap.entries()) {
            const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
            if (valid.length === 0) rateLimitMap.delete(ip);
            else rateLimitMap.set(ip, valid);
        }
    }, 5 * 60 * 1000);
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();
}

module.exports = async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

        // 1. Rate Limiting Check
        if (isRateLimited(clientIp)) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Please wait a moment and try again.'
            });
        }

        const body = req.body || {};

        // 2. Honeypot check (anti-bot)
        // If the hidden 'website' or '_gotcha' field is filled by a bot, quietly reject
        if (body.website || body._gotcha) {
            return res.status(200).json({ success: true });
        }

        // 3. Extract & Validate Fields
        const fullName = sanitize(body.fullName);
        const email = sanitize(body.email);
        const phone = sanitize(body.phone || '');
        const company = sanitize(body.company || '');
        const service = sanitize(body.projectType || body.service || 'General Inquiry');
        const budget = sanitize(body.budget || 'Not specified');
        const message = sanitize(body.message);

        if (!fullName || fullName.length < 2 || fullName.length > 100) {
            return res.status(400).json({ success: false, error: 'Please provide a valid full name.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email) || email.length > 150) {
            return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
        }

        if (!message || message.length < 5 || message.length > 5000) {
            return res.status(400).json({ success: false, error: 'Please provide project details (5 to 5000 characters).' });
        }

        // 4. Validate Environment Variables for SMTP
        const {
            SMTP_HOST,
            SMTP_PORT,
            SMTP_USER,
            SMTP_PASS,
            SMTP_SECURE,
            MAIL_TO
        } = process.env;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            console.error('Server Configuration Error: Missing SMTP environment variables.');
            // Never reveal system setup details to the client
            return res.status(500).json({
                success: false,
                error: 'Unable to send your message right now. Please try again or contact us directly at info@neuroniv.com.'
            });
        }

        // 5. Configure Transporter
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT || '587', 10),
            secure: SMTP_SECURE === 'true' || SMTP_PORT === '465',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        const submittedAt = new Date().toUTCString();

        // 6. Professional HTML Email Template
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Project Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070314; color: #ffffff; padding: 30px 15px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #100824; border: 1px solid rgba(232, 121, 249, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="background: linear-gradient(135deg, #1c0f38 0%, #100824 100%); padding: 25px 30px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <h2 style="margin: 0; font-size: 20px; color: #e879f9; letter-spacing: -0.02em;">NeuroNiv — New Project Inquiry</h2>
            <p style="margin: 5px 0 0; font-size: 13px; color: rgba(255,255,255,0.6);">Submitted via website contact form</p>
        </div>
        <div style="padding: 30px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); width: 130px; border-bottom: 1px solid rgba(255,255,255,0.06);">Full Name:</td>
                    <td style="padding: 10px 0; color: #ffffff; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06);">${fullName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Business Email:</td>
                    <td style="padding: 10px 0; color: #38bdf8; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06);"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Phone:</td>
                    <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.06);">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Company:</td>
                    <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.06);">${company || 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Service Area:</td>
                    <td style="padding: 10px 0; color: #e879f9; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06);">${service}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Project Budget:</td>
                    <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.06);">${budget}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">Submitted At:</td>
                    <td style="padding: 10px 0; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.06);">${submittedAt}</td>
                </tr>
            </table>

            <div style="margin-top: 25px;">
                <h4 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6);">Project Details / Scope:</h4>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 15px; font-size: 14px; line-height: 1.6; color: #e5e7eb; white-space: pre-wrap;">${message}</div>
            </div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 15px 30px; font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
            This inquiry was submitted through the NeuroNiv website.
        </div>
    </div>
</body>
</html>
        `;

        // 7. Send Email
        const mailOptions = {
            from: `"NeuroNiv Web Inquiry" <${SMTP_USER}>`,
            replyTo: email,
            to: MAIL_TO || 'votaradi213@rku.ac.in',///info@neuroniv.com
            subject: `New NeuroNiv Project Inquiry — ${service}`,
            text: `
New NeuroNiv Project Inquiry
----------------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Service: ${service}
Budget: ${budget}
Submitted At: ${submittedAt}

Project Details:
${message}

----------------------------
This inquiry was submitted through the NeuroNiv website.
            `,
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('SMTP Mail Error:', err.message);
        // Do not expose internal SMTP failure details to the browser
        return res.status(500).json({
            success: false,
            error: 'Unable to send your message right now. Please try again or contact us directly at info@neuroniv.com.'
        });
    }
};
