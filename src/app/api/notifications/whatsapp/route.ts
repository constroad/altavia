import { NextRequest } from 'next/server'
import axios from 'axios'
import { WHAPI_TOKEN, WHAPI_URL } from 'src/common/consts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, to, body: messageBody, mentions } = body

    await axios.post(`${WHAPI_URL}${type}`, {
      to,
      body: messageBody,
      mentions,
    }, {
      headers: {
        Authorization: `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    return new Response(JSON.stringify({
      status: 'ok',
      message: 'Message sent successfully',
    }), { status: 200 })

  } catch (error: any) {
    console.error(error.message)
    return new Response(JSON.stringify({ message: 'Error sending WhatsApp message' }), {
      status: 500,
    })
  }
}
