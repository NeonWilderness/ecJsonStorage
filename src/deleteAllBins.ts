/**
 * Utility script to delete all bins but one as specified in .env.JSONBIN
 */
import { ECJsonStorage, type resGetBins, type resError } from './index';
import { config } from 'dotenv-safe';
config();

const deleteBins = async (remainingBin: string) => {
  try {
    const json = new ECJsonStorage(process.env.JSONAPI!, process.env.JSONSEC!);

    const data = await json.getBins();
    if (data.status !== 'ok') throw new Error((data as resError).statusText);
    const { bins } = data as resGetBins;

    let binsDeleted = 0;
    for (let bin of bins!) {
      if (bin === remainingBin) continue;
      const data = await json.deleteBin(bin);
      if (data.status !== 'ok') throw new Error((data as resError).statusText);
      console.log(`Bin "${bin}" successfully deleted.`);
      binsDeleted++;
    }
    console.log(`${binsDeleted} bins deleted.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

deleteBins(process.env.JSONBIN!);
