import path from 'path';
import { fileURLToPath } from 'url';

export const catchSync = (func, ...args) => {
  try {
    // eslint-disable-next-line prefer-spread
    return [null, func.apply(null, args)];
  } catch (error) {
    return [error];
  }
};

export const catchAsync = async (func, ...args) => {
  try {
    // eslint-disable-next-line prefer-spread
    return [null, await func.apply(null, args)];
  } catch (error) {
    return [error];
  }
};

export const fileURLtoDirPath = fileUrl => path.dirname(fileURLToPath(fileUrl));
