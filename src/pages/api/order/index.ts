import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { OrderModel, orderValidationSchema } from 'src/models/order';
import { OrderRepository } from 'src/repositories/orderRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new OrderRepository();
  try {
    const result = await repo.getAll({});
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting orders' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body.data as OrderModel
  const repo = new OrderRepository();
  try {
    const result = orderValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving orders'  });
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
  onError: onApiError('order / index'),
  onNoMatch: onApiNoMatch
});