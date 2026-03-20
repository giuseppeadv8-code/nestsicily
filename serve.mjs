import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const resend = new Resend('re_3ABoBewh_8Dx9quGjKnMZ5RmmtFjEU9cd');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  // API endpoint for contact form
  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { firstName, lastName, phonePrefix, phone, email, projectType, budget } = data;

        const projectLabel = projectType === 'buy' ? 'Buy a Property' : 'Renovate';

        await resend.emails.send({
          from: 'NEST Website <onboarding@resend.dev>',
          to: 'nestsicily@gmail.com',
          subject: `New Contact Request from ${firstName} ${lastName}`,
          html: `
            <h2>New Contact Request</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Phone:</strong> ${phonePrefix} ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Project Type:</strong> ${projectLabel}</p>
            <p><strong>Budget:</strong> ${budget}</p>
          `,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Email send error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Failed to send email' }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, decodeURIComponent(req.url === '/' ? '/index.html' : req.url));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
