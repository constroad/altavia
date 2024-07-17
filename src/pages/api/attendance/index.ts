import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from 'src/common/utils';
import { AttendanceRepository } from 'src/repositories/attendanceRepository';
import { AttendanceModel, attendanceValidationSchema } from 'src/models/attendance';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = new AttendanceRepository();
  try {
    const { employeeId, date } = req.query
    let filter: any = {}
    if (employeeId) {
      filter.employeeId = employeeId
    }
    if (date) {
      const dateFilter = new Date(date as string);
      const startOfDay = new Date(dateFilter.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateFilter.setHours(23, 59, 59, 999));
      filter = {
        ...filter,
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      };
    }
    const result = await repo.getAll(filter);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting attendances' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newRecord = req.body as AttendanceModel
  const repo = new AttendanceRepository();
  try {
    const result = attendanceValidationSchema.safeParse(newRecord);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const response = await repo.create(newRecord);
    res.status(201).json(response);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving attendance'  });
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
  onError: onApiError('attendance / index'),
  onNoMatch: onApiNoMatch
});