import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { TELEGRAM_GROUP_ID_ERRORS } from "../consts";
import { sendTelegramTextMessage } from "./general";

export const ApiTimeTracker = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  const start = Date.now();
  await next(); // call next in chain
  const end = Date.now();
  console.log(`Request took ${end - start}ms`);
}

export async function withApiTimeTracker<T>(
  handler: () => Promise<T>,
  context?: { method?: string; url?: string }
): Promise<T> {
  const start = Date.now();
  try {
    const result = await handler();
    return result;
  } finally {
    const end = Date.now();
    console.log(`[API] ${context?.method || ''} ${context?.url || ''} - ${end - start}ms`);
  }
}


export const convertDateMiddleware = (field: string)=>(req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (req.body[field]) {
    req.body[field] = new Date(req.body[field]);
  }
  next();
}

export const onApiError = (apiName: string) => async (err: any, req: NextApiRequest, res: NextApiResponse) => {
  const requestMethod = req.method;
  const query = req?.query || {};
  const body = req?.body || {};
  console.log(err?.stack ?? {}, {
    method: requestMethod,
    query,
    body
  })
//   await SlackNotification({
//     channel: CHANNEL_DEV_ALERTS,
//     message: `
// :x: Chainverse API ERROR <!here>
// ---------------------
// apiName: ${apiName}
// method: ${requestMethod}
// query: ${JSON.stringify(query)}
// body: ${JSON.stringify(body)}
// stack: ${err.stack}
//         `
//   })

  res.status(500).end(`Internal Server Error in ${apiName} api`)
}

export const onPageError = (pageName: string) => async (err: any) => {  
  console.log(err)

  const message = `
  ConstRoad PAGE ERROR!
  ---------------------
  page: ${pageName}  
  message: ${err.message ?? ''}  
  errorFull: ${JSON.stringify(err)}
  `
  sendTelegramTextMessage(message, TELEGRAM_GROUP_ID_ERRORS)  
}

export const onApiNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}