import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { DispatchRepository } from 'src/repositories/dispatchRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as Record<string, string>;
  const repo = new DispatchRepository();
  try {
    const result = await repo.getById(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting dispatch' });
  }
}

const updateRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new DispatchRepository();
  const { id } = req.query as Record<string, string>;
  try {
    const response = await repo.update(id, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating dispatch' });
  }
}

const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new DispatchRepository();
  const { id } = req.query;
    try {
      await repo.delete(id as string);
      res.status(200).json({ message: 'registro eliminada exitosamente' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting dispatch' });
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
  onError: onApiError('dispatch / [id]'),
  onNoMatch: onApiNoMatch
});
