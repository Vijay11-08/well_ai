/**
 * NeuroNiv Unified Development & Production Server
 * Serves static website assets and routes API calls (e.g. /api/contact)
 * using Node.js built-in HTTP module and configured SMTP environment variables.
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const contactHandler = require('./api/contact');

const PORT = parseInt(process.env.PORT || '8080', 10);
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Set CORS and Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // Route: /api/contact
    if (pathname === '/api/contact' || pathname === '/api/contact/') {
        if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
            return;
        }

        let bodyData = '';
        req.on('data', chunk => {
            bodyData += chunk;
            // Prevent payload flood (max 1MB)
            if (bodyData.length > 1024 * 1024) {
                res.statusCode = 413;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Payload too large' }));
                req.destroy();
            }
        });

        req.on('end', async () => {
            try {
                req.body = bodyData ? JSON.parse(bodyData) : {};
            } catch (parseErr) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
                return;
            }

            // Decorate res object for serverless-compatible handler
            res.status = function (statusCode) {
                res.statusCode = statusCode;
                return res;
            };
            res.json = function (jsonObj) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonObj));
                return res;
            };

            try {
                await contactHandler(req, res);
                console.log(`[API] POST /api/contact -> ${res.statusCode} (From: ${req.body.email || 'N/A'})`);
            } catch (handlerErr) {
                console.error('[API Error] Uncaught error in contact handler:', handlerErr);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
                }
            }
        });
        return;
    }

    // Static File Serving
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
    }

    if (pathname.endsWith('/')) {
        pathname += 'index.html';
    }

    let safePath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!safePath.startsWith(ROOT_DIR)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if it's a route without .html extension (e.g. /about -> /about.html)
            const htmlCandidate = safePath + '.html';
            if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
                safePath = htmlCandidate;
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end('<h1>404 Not Found</h1><p>The requested page was not found on NeuroNiv server.</p>');
                return;
            }
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);

        if (req.method === 'HEAD') {
            res.end();
            return;
        }

        const stream = fs.createReadStream(safePath);
        stream.pipe(res);
        stream.on('error', streamErr => {
            console.error('Stream error:', streamErr);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.end('Server Error reading file');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NeuroNiv Server running at: http://localhost:${PORT}`);
    console.log(`📧 Contact API endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`🔐 SMTP Host: ${process.env.SMTP_HOST || 'Not configured'} | User: ${process.env.SMTP_USER || 'Not configured'}`);
    console.log(`🎯 Recipient Target: ${process.env.MAIL_TO || 'Not configured'}`);
    console.log(`=======================================================`);
});
