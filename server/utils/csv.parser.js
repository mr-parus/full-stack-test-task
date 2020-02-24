import csvParse from 'csv-parse';
import stream from 'stream';

const { Readable } = stream;

/**
 * Parses the input stream/string in csv format
 *
 * @param {Readable|string} source - source stream
 * @param {{onRecord: function}} options - options provided to 'csv-parseCSV' parser
 * @returns {Promise<array>}
 */
export const parseCSV = (source, options = {}) => {
  return new Promise((resolve, reject) => {
    const inputStream = typeof source === 'string' ? Readable.from(source) : source;
    const { onRecord } = options;
    const rows = [];

    const parser = csvParse({
      delimiter: ',',
      skip_empty_lines: true,
      // skip_lines_with_error: true,
      trim: true,
      on_record: onRecord
    });

    parser.on('end', () => resolve(rows));
    parser.on('error', reject);
    parser.on('readable', onReadable);

    inputStream.pipe(parser);

    function onReadable() {
      let record;
      // eslint-disable-next-line no-cond-assign
      while ((record = this.read())) {
        rows.push(record);
      }
    }
  });
};
