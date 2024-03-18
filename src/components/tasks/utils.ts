import { endOfWeek, getMonth, startOfWeek, format } from "date-fns";
import { es } from 'date-fns/locale/es';

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  DONE = 'done'
}

export type NoteObject = {
  title?: string;
  text?: string;
}

export type TaskObject = {
  title?: string;
  content: string;
  status: Status
}

export type TaskType = {
  date: string;
  reporter?: string;
  assignee?: string;
  notes: NoteObject[];
  tasks: TaskObject[]
}

export const initialTask = {
  date: '',
  reporter: '',
  assignee: '',
  notes: [{
    title: '',
    text: '',
  }],
  tasks: [{
    title: '',
    content: '',
    status: Status.PENDING
  }]
}

export const getCurrentMonth = (startDayWeek: Date) => {
  const startOfMonth = getMonth(startOfWeek(startDayWeek, { weekStartsOn: 0 }));
  const endOfMonth = getMonth(endOfWeek(startDayWeek, { weekStartsOn: 0 }));

  let currentMonth = '';
  if (startOfMonth === endOfMonth) {
    currentMonth = format(startOfWeek(startDayWeek, { weekStartsOn: 0 }), 'MMMM', { locale: es });
  } else {
    const firstDayOfMonth = format(startOfWeek(startDayWeek, { weekStartsOn: 0 }), 'MMMM', { locale: es });
    const lastDayOfMonth = format(endOfWeek(startDayWeek, { weekStartsOn: 0 }), 'MMMM', { locale: es });
    currentMonth = `${firstDayOfMonth} / ${lastDayOfMonth}`;
  }

  return currentMonth;
}

export const getCurrentYear = () => {

}
