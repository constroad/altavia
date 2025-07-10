import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { CONSTROAD_SERVER_URL, GROUP_ERRORS_TRACKING, WtspMessageType } from 'src/common/consts'

const API_TEXT_ME_BOT_URL = CONSTROAD_SERVER_URL
const API_WHATSAPP = process.env.API_WHATSAPP
const PHONE_SENDER = '51949376824'
const BASE_URL = `${API_TEXT_ME_BOT_URL}/message/${PHONE_SENDER}`

const sendWhatsAppTextMessage = async (params: {
  phone: string,
  message: string,
}) => {
  const { phone, message } = params

  const isDev = process.env.NODE_ENV === 'development'
  let validPhoneNumber = phone
  if (!phone.includes('+51') && !phone.includes('@g.us')) {
    validPhoneNumber = `+51${phone}`
  }

  const url = `${BASE_URL}/text`
  console.log('url:', url)
  await axios.post(url, {
    "to": isDev ? GROUP_ERRORS_TRACKING : validPhoneNumber,
    "message": message
  })
}

const sendWhatsAppImageMessage = async (phone: string, message: string, fileUrl: string) => {
  const url = `${BASE_URL}/image`
  return axios.post(url, {
    to: phone,
    caption: message,
    fileUrl,
  })
}

const sendWhatsAppFileMessage = async (phone: string, message: string, fileUrl: string) => {
  const url = `${BASE_URL}/file`
  return axios.post(url, {
    to: phone,
    caption: message,
    fileUrl,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { type, phone, message, fileUrl } = await req.json()

    console.log('API-sendMessage', {
      type,
      phone,
      message,
      fileUrl,
      API_WHATSAPP,
    })

    if (!phone) {
      return NextResponse.json({ message: 'phone is missing' }, { status: 400 })
    }

    let validPhoneNumber = phone
    if (!phone.includes('+51') && !phone.includes('@g.us')) {
      validPhoneNumber = `+51${phone}`
    }

    if (type === WtspMessageType.SendText) {
      await sendWhatsAppTextMessage({ phone: validPhoneNumber, message})
      return NextResponse.json({
        status: 'ok',
        message: 'Message sent successfully',
      })
    }

    if (!fileUrl) {
      return NextResponse.json({ message: 'fileUrl is missing' }, { status: 400 })
    }

    if (type === WtspMessageType.SendImage) {
      await sendWhatsAppImageMessage(validPhoneNumber, message, fileUrl)
      return NextResponse.json({
        status: 'ok',
        message: 'Image sent successfully',
      })
    }

    if (type === WtspMessageType.SendDocument) {
      await sendWhatsAppFileMessage(validPhoneNumber, message, fileUrl)
      return NextResponse.json({
        status: 'ok',
        message: 'File sent successfully',
      })
    }

    return NextResponse.json({ message: 'type is not valid' }, { status: 400 })

  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      { message: 'Error sending WhatsApp message' },
      { status: 500 }
    )
  }
}

