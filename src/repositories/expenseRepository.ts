import Expense, { IGeneralExpense } from "src/models/generalExpense";
import { BaseRepository } from "./baseRepository";

class ExpenseRepository extends BaseRepository<IGeneralExpense> {
  constructor() {
    super(Expense)
  }
}

export const expenseRepository = new ExpenseRepository()
