
import { MongoError } from 'mongodb';

export default class StorageErrorHandler {
  /** Handles storage errors during entity creation or its update */
  static async createOrUpdate<T>(fn: () => T): Promise<T> {
    return this.handleForInternalServerError(fn);
  }

  /** Handles storage error during finding a single entity */
  static async findOne<T>(fn: () => T): Promise<T> {
    let result: T;

    try {
      result = await fn();
    } catch (error) {    
      throw new Error('interval server');
    }

    if (!result) {
      throw new Error('Entity not found.');
    }

    return result;
  }

  /** Handles storage error while trying to get entities count */
  static async count<T>(fn: () => T): Promise<T> {
    return await this.handleForInternalServerError(fn);
  }

  /** Handles storage error while trying to find many entities */
  static async findMany<T>(fn: () => T): Promise<T> {
    return await this.handleForInternalServerError(fn);
  }

  /** Handles storage error during deleting an entity by its id */
  static async deleteById<T>(fn: () => T): Promise<T> {
    return await this.handleForInternalServerError(fn);
  }

  /** Handles storage error during deleting an entity by its id */
  static async deleteMany<T>(fn: () => T): Promise<T> {
    return await this.handleForInternalServerError(fn);
  }

  /** Processes action with InternalServerError exception handling only. */
  private static async handleForInternalServerError<T>(
    fn: () => T
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof MongoError) {
        this.handleMongoError(error);
      }
      throw error;
    }
  }
  private static handleMongoError(error: MongoError): void {
    switch (error.code) {
      case 11000: // Duplicate key error
        throw new Error('Duplicate key error.');
      case 18:
        throw new Error('Unauthorized');
      case 2:
      case 11600:
        throw new Error('Not found error.');
      case 9001: // permission denied
        throw new Error('Permission denied.');
      default:
        throw new Error(error.message);
    }
  }
}
