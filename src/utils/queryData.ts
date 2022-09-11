import { Model } from 'mongoose';

// checks if the collection is empty. If already populated, there is no need scraping the data again and inserting into the db
export const queryDataUtil = async (dbModel: Model<any>): Promise<number> => {
  try {
    const data = await dbModel.find().limit(1);
    return data.length;
  } catch (error) {
    throw error;
  }
};
