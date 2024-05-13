import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from 'src/config/mongoose';
import { NextHandler, createRouter } from "next-connect";
import { ApiTimeTracker, convertDateMiddleware, onApiError, onApiNoMatch } from 'src/common/utils';
import { NoteModel, noteValidationSchema } from 'src/models/notes';
import { NoteRepository } from 'src/repositories/noteRepository';

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const noteRepo = new NoteRepository();
  try {
    const notes = await noteRepo.getAll();
    res.status(200).json(notes);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting notes' });
  }
}

const addRecord = async (req: NextApiRequest, res: NextApiResponse) => {
  const newNote = req.body.data as NoteModel
  const newNoteUpdated = { ...newNote, date: new Date(newNote.date) }

  const noteRepo = new NoteRepository();
  try {
    const result = noteValidationSchema.safeParse(newNoteUpdated);

    if (!result.success) {
      console.log(result.error)
      res.status(400).json({ message: "Revise parametros obligatorios"});
      return
    }

    const noteResponse = await noteRepo.create(newNote);
    res.status(201).json(noteResponse);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error when saving note'  });
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
  onError: onApiError('notes / index'),
  onNoMatch: onApiNoMatch
});