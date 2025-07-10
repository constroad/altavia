import { connectToMongoDB } from "@/config/mongoose";
import { alertRepository } from "@/repositories/alertRepository";
import { GROUP_ADMINISTRACION_ALTAVIA, GROUP_ERRORS_TRACKING } from "@/common/consts";
import { json } from "@/common/utils/response";
import { sendWhatsAppTextMessage } from '@/services/whatsapp';

function getDaysUntil(date: Date): number {
  const now = new Date();
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const due = new Date(date);
  const dueUTC = new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate()));

  const diff = dueUTC.getTime() - utcToday.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}


type AlertLevel = '7d' | '3d' | '1d' | '0d';

const levelLabels: Record<AlertLevel, string> = {
  '7d': '🗓️ *[Vencen en 7 días]*',
  '3d': '⚠️ *[Vencen en 3 días]*',
  '1d': '🔴 *[Vencen mañana]*',
  '0d': '🚨 *[¡VENCEN HOY!]*',
};

function buildAlertMessage(alerts: any[]) {
  if (!alerts.length) return null;

  const grouped: Record<AlertLevel, string[]> = {
    '7d': [],
    '3d': [],
    '1d': [],
    '0d': [],
  };

  alerts.forEach((alert) => {
    const label = `${alert.name}`;
    grouped[alert.alertLevel as AlertLevel]?.push(`- ${label}`);
  });

  let message = `🤖 *AltaviaBot*:\n\n📢 *Alerta de vencimiento:*\n\n`;

  (['7d', '3d', '1d', '0d'] as AlertLevel[]).forEach((level) => {
    if (grouped[level].length) {
      message += `${levelLabels[level]}\n${grouped[level].join('\n')}\n\n`;
    }
  });

  message += `Por favor tomar acciones inmediatas. @Altavía`;
  return message.trim();
}

export async function GET() {
  await connectToMongoDB();

  const today = new Date();
  const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));

  const utcSevenDaysFromNow = new Date(utcToday);
  utcSevenDaysFromNow.setUTCDate(utcSevenDaysFromNow.getUTCDate() + 7);
  utcSevenDaysFromNow.setUTCHours(23, 59, 59, 999);

  const alerts = await alertRepository.findAll({
    status: 'Pending',
    dueDate: { $gte: utcToday, $lte: utcSevenDaysFromNow }
  });

  const filtered = alerts
    .map((alert) => {
      const daysUntil = getDaysUntil(alert.dueDate);
      let alertLevel: AlertLevel | null = null;

      if (daysUntil === 7) alertLevel = '7d';
      else if (daysUntil === 3) alertLevel = '3d';
      else if (daysUntil === 1) alertLevel = '1d';
      else if (daysUntil === 0) alertLevel = '0d';

      return alertLevel
        ? { ...alert.toObject(), alertLevel, daysUntil }
        : null;
    })
    .filter(Boolean);

  const message = buildAlertMessage(filtered);

  if (message) {
    const response = await sendWhatsAppTextMessage({
      // phone: GROUP_ADMINISTRACION_ALTAVIA,
      phone: GROUP_ERRORS_TRACKING,
      message,
    });

    console.log("Mensaje enviado:", response);
  }

  return json({ total: filtered.length, alerts: filtered });
}
