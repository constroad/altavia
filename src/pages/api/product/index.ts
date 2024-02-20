import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { ProductRepository } from 'src/repositories/productRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { ProductModel, productValidationSchema } from 'src/models/products';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteRepo = new ProductRepository();
  try {
    const response = await quoteRepo.getAll();
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting products' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newQuote = req.body as ProductModel
  const quoteRepo = new ProductRepository();
  try {
    const result = productValidationSchema.safeParse(newQuote);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await quoteRepo.create(newQuote);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving products'  });
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
  onError: onApiError('product / index'),
  onNoMatch: onApiNoMatch
});