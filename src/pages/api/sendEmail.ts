// /pages/api/sendMail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name, message, phone, nroCubos, razonSocial, ruc } = req.body;

    const phoneNumber = phone === '' ? '- - -' : phone
    const cubos = nroCubos === '' ? '1' : nroCubos
    const Ruc = ruc === '' ? '- - -' : ruc  

    const msg = `
<html>
  <body>
    <strong style="font-size: 20px;">Estamos procesando tu cotización!</strong><br><br>
    <strong>Nombre:</strong> ${name}<br>
    <strong>Razón social:</strong> ${razonSocial}<br>
    <strong>RUC:</strong> ${Ruc}<br><br>
    <strong>Nro. cubos:</strong> ${cubos}<br>
    <strong>Mensaje:</strong> ${message}<br><br>
    <strong>Correo electrónico:</strong> ${email}<br>
    <strong>Teléfono:</strong> ${phoneNumber}<br>
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
        cc: process.env.EMAIL,
        to: email,
        subject: `Solicitud de cotizacion para ${razonSocial}`,
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
