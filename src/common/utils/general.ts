import { TELEGRAM_GROUP_ID_ERRORS, TELEGRAM_TOKEN } from "../consts";

function escapeMarkdown(message: string) {
  const escapeMessage = message.replace(/([_\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  return escapeMessage
}

export function escapeMarkdownV2(text: string) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

