import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name, message, phone, companyName, ruc, startCity, endCity } = body

  const phoneNumber = phone === '' ? '- - -' : phone
  const Ruc = ruc === '' ? '- - -' : ruc
  const company = companyName === '' ? '- - -' : companyName
  const firstCity = startCity === '' ? '- - -' : startCity
  const secondCity = endCity === '' ? '- - -' : endCity

  const msg = `
    <html>
      <body>
        <strong style="font-size: 20px;">Estamos procesando tu cotización!</strong><br><br>
        <strong>Nombre:</strong> ${name}<br>
        <strong>Razón social:</strong> ${company}<br>
        <strong>RUC:</strong> ${Ruc}<br><br>
        <strong>Mensaje:</strong> ${message}<br><br>
        <strong>Correo electrónico:</strong> ${email}<br>
        <strong>Teléfono:</strong> ${phoneNumber}<br>
        <strong>Ciudad de partida:</strong> ${firstCity}<br>
        <strong>Ciudad de destino:</strong> ${secondCity}<br>
      </body>
    </html>
  `

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: email,
      subject: `Solicitud de cotizacion para ${companyName}`,
      html: msg,
    }

    await transporter.sendMail(mailOptions)

    return new Response(JSON.stringify({ message: 'Correo enviado con éxito' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error al enviar el correo', error)
    return new Response(JSON.stringify({ message: 'Error al enviar el correo' }), {
      status: 500,
    })
  }
}
