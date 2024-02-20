import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { ProductRepository } from 'src/repositories/productRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as Record<string, string>;
  const repo = new ProductRepository();
  try {
    const result = await repo.getById(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting product' });
  }
}

const updateRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new ProductRepository();
  const { id } = req.query as Record<string, string>;
  try {
    const response = await repo.update(id, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating product' });
  }
}

const deleteRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new ProductRepository();
  const { id } = req.query;
    try {
      await repo.delete(id as string);
      res.status(200).json({ message: 'registro eliminada exitosamente' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting product' });
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
  onError: onApiError('product / [id]'),
  onNoMatch: onApiNoMatch
});