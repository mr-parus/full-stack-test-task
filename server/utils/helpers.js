import fs from 'fs';

export const getLinesCount = filePath => {
  return new Promise((resolve, reject) => {
    let i;
    let count = 0;
    fs.createReadStream(filePath)
      .on('data', chunk => {
        for (i = 0; i < chunk.length; ++i) if (chunk[i] === 10) count++;
      })
      .on('end', () => resolve(count))
      .on('error', e => reject(e));
  });
};
