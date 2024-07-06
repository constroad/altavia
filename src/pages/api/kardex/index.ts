
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { KardexRepository } from 'src/repositories/kardexRepository';
import { KardexModel, kardexValidationSchema } from 'src/models/kardex';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new KardexRepository();
  const { month, year } = req.query;
  try {
    let filter = {};
    let params
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };

      params = {
        month, year, startDate, endDate
      }
    }

    const result = await repo.getAll(filter, params);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting materials' });
  }
}
const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body.data as KardexModel
  const repo = new KardexRepository();
  try {
    const result = kardexValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios" });
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving kardex' });
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
  onError: onApiError('kardex / index'),
  onNoMatch: onApiNoMatch
});