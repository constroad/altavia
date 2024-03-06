import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { ProviderRepository } from 'src/repositories/providerRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as Record<string, string>;
  const repo = new ProviderRepository();
  try {
    const result = await repo.getById(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting provider' });
  }
}

const updateRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new ProviderRepository();
  const { id } = req.query as Record<string, string>;
  try {
    const response = await repo.update(id, req.body.data);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating provider' });
  }
}

const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new ProviderRepository();
  const { id } = req.query;
    try {
      await repo.delete(id as string);
      res.status(200).json({ message: 'registro eliminado exitosamente' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting provider' });
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
  onError: onApiError('provider / [id]'),
  onNoMatch: onApiNoMatch
});