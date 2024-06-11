import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { DispatchModel, dispatchValidationSchema } from 'src/models/dispatch';
import { DispatchRepository } from 'src/repositories/dispatchRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new DispatchRepository();
  try {
    const { page = 1, limit = 10, startDate, endDate, clientId } = req.query;
    const query: any = {
      page,
      limit
    };
    // if (startDate || endDate) {
    //   query.date = {};
    //   if (startDate) {
    //     query.date.$gte = new Date(startDate as string);
    //   }
    //   if (endDate) {
    //     query.date.$lte = new Date(endDate as string);
    //   }
    // }    
    if (clientId) {
      query.clientId = clientId
    }
    if (startDate || endDate) {
      query.$and = [];
      if (startDate) {
        query.$and.push({ 
          date: { 
            $gte: new Date(new Date(startDate as string).toISOString()).toISOString() 
          } 
        });
      }
      if (endDate) {
        query.$and.push({ 
          date: { 
            $lte: new Date(new Date(endDate as string).toISOString()).toISOString() 
          } 
        });
      }
    }
    const result = await repo.getAll(query);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting dispatchs' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body.data as DispatchModel
  const repo = new DispatchRepository();
  try {
    const result = dispatchValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving dispatch'  });
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
  onError: onApiError('dispatch / index'),
  onNoMatch: onApiNoMatch
});