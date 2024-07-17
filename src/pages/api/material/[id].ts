import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { MaterialRepository } from 'src/repositories/materialRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as Record<string, string>;
  const repo = new MaterialRepository();
  try {
    const result = await repo.getById(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting material' });
  }
}

const updateRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new MaterialRepository();
  const { id } = req.query as Record<string, string>;
  console.log('update material:', req.body)
  try {
    const response = await repo.update(id, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating material' });
  }
}

const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new MaterialRepository();
  const { id } = req.query;
    try {
      await repo.delete(id as string);
      res.status(200).json({ message: 'registro eliminada exitosamente' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting material' });
    }
}

router
  .use(ApiTimeTracker)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getById)
  .put(updateRecord)
  .delete(deleteRecord);


export default router.handler({
  onError: onApiError('material / [id]'),
  onNoMatch: onApiNoMatch
});