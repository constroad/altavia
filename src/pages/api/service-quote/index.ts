import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { ServiceQuoteRepository } from 'src/repositories/serviceQuoteRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, convertDateMiddleware, onApiError, onApiNoMatch } from 'src/common/utils';
import { ServiceQuoteModel, serviceQuoteValidationSchema } from 'src/models/service-quote';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getServiceQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  const serviceQuoteRepo = new ServiceQuoteRepository();
  try {
    const serviceQuotes = await serviceQuoteRepo.getAll();
    res.status(200).json(serviceQuotes);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting service quotes' });
  }
}

const addServiceQuote = async (req: NextApiRequest, res: NextApiResponse) => {
  const newServiceQuote = req.body as ServiceQuoteModel
  const serviceQuoteRepo = new ServiceQuoteRepository();
  try {
    const result = serviceQuoteValidationSchema.safeParse(newServiceQuote);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const serviceQuoteResponse = await serviceQuoteRepo.create(newServiceQuote);
    res.status(201).json(serviceQuoteResponse);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving service quotes'  });
  }
}


router
  .use(ApiTimeTracker)
  .use(convertDateMiddleware('date'))
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getServiceQuotes)
  .post(addServiceQuote)


export default router.handler({
  onError: onApiError('service quotes / index'),
  onNoMatch: onApiNoMatch
});