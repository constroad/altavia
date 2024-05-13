import { endOfWeek, getMonth, startOfWeek, format } from "date-fns";
import { es } from 'date-fns/locale/es';

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export type TaskType = {
  _id?: string;
  date: string;
  reporter?: string;
  assignee?: string;
  title: string;
  content?: string;
  status: Status
}

export type NoteType = {
  _id?: string;
  date: string;
  reporter?: string;
  title: string;
  text?: string;
}

const currentDay = new Date()

export const initialTask: TaskType = {
  date: '',
  reporter: '',
  assignee: '',
  title: '',
  content: '',
  status: Status.PENDING
}

export const initialNote = {
  date: '',
  reporter: '',
  title: '',
  text: '',
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

export function sameDay(firstDay: Date, secondDay: Date) {
  return firstDay.getFullYear() === secondDay.getFullYear() &&
         firstDay.getMonth() === secondDay.getMonth() &&
         firstDay.getDate() === secondDay.getDate();
}
