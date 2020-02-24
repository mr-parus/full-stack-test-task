import Busboy from 'busboy';

/**
 * Parses one file from a Node request
 * and returns it as a Stream
 *
 * @param  {http.IncomingMessage} req
 * @return {Promise<{ file: Stream, filename: string }>}
 */
export const parseOneFile = req => {
  return new Promise((resolve, reject) => {
    const { headers } = req;
    const busboy = new Busboy({
      headers,
      limits: {
        files: 1
      }
    });

    const result = {};

    busboy.once('error', reject);
    busboy.once('file', onFile);
    busboy.once('finish', () => resolve(result));

    req.pipe(busboy);

    function onFile(fieldName, file, fileName, encoding, mimeType) {
      result.file = file;
      result.fileName = fileName;
      result.mimeType = mimeType;
      resolve(result);
    }
  });
};
