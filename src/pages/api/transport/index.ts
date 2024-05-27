import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { TransportModel, transportValidationSchema } from 'src/models/transport';
import { TransportRepository } from 'src/repositories/transportRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new TransportRepository();
  try {
    const result = await repo.getAll();
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting transports' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body.data as TransportModel
  const repo = new TransportRepository();
  try {
    const result = transportValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving transport'  });
  }
}


router
  .use(ApiTimeTracker)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getAll)
  .post(addRecord)


export default router.handler({
  onError: onApiError('transport / index'),
  onNoMatch: onApiNoMatch
});