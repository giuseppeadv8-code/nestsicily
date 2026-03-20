import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, phonePrefix, phone, email, projectType, budget } = req.body;
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

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
