import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { QuoteRepository } from 'src/repositories/quoteRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, convertDateMiddleware, onApiError, onApiNoMatch } from 'src/common/utils';
import { QuoteModel, quoteValidationSchema } from 'src/models/quote';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteRepo = new QuoteRepository();
  try {
    const quotes = await quoteRepo.getAll();
    res.status(200).json(quotes);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting quotes' });
  }
}

const addQuote = async (req: NextApiRequest, res: NextApiResponse) => {
  const newQuote = req.body as QuoteModel
  const quoteRepo = new QuoteRepository();
  try {
    const result = quoteValidationSchema.safeParse(newQuote);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const quoteResponse = await quoteRepo.create(newQuote);
    res.status(201).json(quoteResponse);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving quotes'  });
  }
}


router
  .use(ApiTimeTracker)
  .use(convertDateMiddleware('date'))
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getQuotes)
  .post(addQuote)


export default router.handler({
  onError: onApiError('quotes / index'),
  onNoMatch: onApiNoMatch
});