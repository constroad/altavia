import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, convertDateMiddleware, onApiError, onApiNoMatch } from 'src/common/utils';
import { TaskModel, taskValidationSchema } from 'src/models/tasks';
import { TaskRepository } from 'src/repositories/taskRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const taskRepo = new TaskRepository();
  try {
    const tasks = await taskRepo.getAll();
    res.status(200).json(tasks);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting tasks' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newTask = req.body as TaskModel
  const taskRepo = new TaskRepository();
  try {
    const result = taskValidationSchema.safeParse(newTask);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const taskResponse = await taskRepo.create(newTask);
    res.status(201).json(taskResponse);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving task'  });
  }
}


router
  .use(ApiTimeTracker)
  .use(convertDateMiddleware('date'))
  .use(async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await connectToMongoDB();
    await next(); // call next in chain
  })
  .get(getAll)
  .post(addRecord)


export default router.handler({
  onError: onApiError('tasks / index'),
  onNoMatch: onApiNoMatch
});