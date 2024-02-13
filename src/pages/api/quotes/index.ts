import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { QuoteRepository } from 'src/repositories/quoteRepository';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
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

const updateQuote = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteRepo = new QuoteRepository();
  const { id } = req.query;
  try {
    const response = await quoteRepo.update(id as string, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating quote' });
  }
}

const deleteQuote = async (req: NextApiRequest, res: NextApiResponse) => {
  const quoteRepo = new QuoteRepository();
  const { id } = req.query;
    try {
      console.log('deleteQuote:', {query: req.query })
      await quoteRepo.delete(id as string);
      res.status(200).json({ message: 'Cotización eliminada exitosamente' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Error deleting quote' });
    }
}

router
  .use(ApiTimeTracker)
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getQuotes)
  .post(addQuote)
  .put(updateQuote)
  .delete(deleteQuote);


export default router.handler({
  onError: onApiError('quotes / index'),
  onNoMatch: onApiNoMatch
});