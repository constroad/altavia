import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { NextHandler, createRouter } from "next-connect";
import { WHAPI_TOKEN, WHAPI_URL } from 'src/common/consts';

const router = createRouter<NextApiRequest, NextApiResponse>();

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { type, body, to, mentions} = req.body

  try {
    await axios.post(`${WHAPI_URL}${type}`, {
      "to": to,
      "body": body,
      "mentions": mentions,
    }, {
      headers: {
        'Authorization': `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    res.status(200).json({
      status: 'ok',
      message: 'success sent message'
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error sending wtsp msm' });
  }
}

router
  .use(ApiTimeTracker)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await next(); // call next in chain
  })
  .post(sendMessage)


export default router.handler({
  onError: onApiError('whatsapp / message'),
  onNoMatch: onApiNoMatch
});

