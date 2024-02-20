import Quote, { QuoteModel } from '../models/quote';

export class QuoteRepository {
  constructor() { }

  async getAll(): Promise<QuoteModel[]> {
    try {
      const quotes = await Quote.find({});
      return quotes;
    } catch (error) {
      console.error('Error getting quotes:', error);
      throw new Error('Error getting quotes');
    }
  }

  async create(data: Partial<QuoteModel>): Promise<QuoteModel> {
    try {
      const newQuote = new Quote(data);
      await newQuote.save();
      return newQuote;
    } catch (error) {
      console.error('Error saving quote:', error);
      throw new Error('Error saving quote');
    }
  }

  async update(id: string, data: Partial<QuoteModel>): Promise<QuoteModel> {
    try {
      const quoteUpdated = await Quote.findByIdAndUpdate(id, data, { new: true });
      if (!quoteUpdated) {
        throw new Error('Quote no found');
      }
      return quoteUpdated;
    } catch (error) {
      console.error('Error updating quote:', error);
      throw new Error('Error updating quote');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Quote.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Quote no found');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw new Error('Error deleting quote');
    }
  }
}
