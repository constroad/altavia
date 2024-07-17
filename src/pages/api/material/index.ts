
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { MaterialRepository } from 'src/repositories/materialRepository';
import { MaterialModel, materialValidationSchema } from 'src/models/material';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new MaterialRepository();
  try {
    const filter: any = {}
    const result = await repo.getAll(filter);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting materials' });
  }
}
const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body.data as MaterialModel
  const repo = new MaterialRepository();
  try {
    const result = materialValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios" });
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving material' });
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
  onError: onApiError('material / index'),
  onNoMatch: onApiNoMatch
});