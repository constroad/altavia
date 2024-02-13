import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export const ApiTimeTracker = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  const start = Date.now();
  await next(); // call next in chain
  const end = Date.now();
  console.log(`Request took ${end - start}ms`);
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

export const onApiNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}