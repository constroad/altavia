// /pages/api/sendMail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sender, name, message, phone, nroCubos, company } = req.body;

    const msg = `
<html>
  <body>
    <strong>Nombre:</strong> ${name}<br>
    <strong>Empresa:</strong> ${company}<br>
    <strong>Teléfono:</strong> ${phone}<br>
    <strong>Nro. cubos:</strong> ${nroCubos}<br>
    <strong>Mensaje:</strong> ${message}<br>
  </body>
</html>
`;

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        cc: sender,
        to: process.env.EMAIL,
        subject: `Solicitud de cotizacion de ${sender}`,
        html: msg,
      };

      // Envía el correo electrónico
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
      console.error('Error al enviar el correo', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
