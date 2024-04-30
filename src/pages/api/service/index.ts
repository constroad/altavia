import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { ServiceRepository } from 'src/repositories/serviceRepository';
import { ServiceModel, serviceValidationSchema } from 'src/models/service';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteRepo = new ServiceRepository();
  try {
    const response = await quoteRepo.getAll();
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting services' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newService = req.body.data as ServiceModel
  const serviceRepo = new ServiceRepository();
  try {
    const result = serviceValidationSchema.safeParse(newService);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await serviceRepo.create(newService);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving services'  });
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
  onError: onApiError('service / index'),
  onNoMatch: onApiNoMatch
});