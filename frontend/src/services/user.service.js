import { apiBaseUrl } from '../config';

export const uploadByCSV = async (file, { onUploadProgress }) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onerror = (error) => reject(error);
    xhr.upload.onprogress = onUploadProgress;
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.response);
        return xhr.status === 200 ? resolve(data) : reject(data);
      } catch (e) {
        resolve(new Error('Impossible to read the response! Try to try later.'));
      }
    };

    const payload = new FormData();
    payload.append('file', file);

    xhr.open('POST', `${apiBaseUrl}/users/upload`);
    xhr.send(payload);
  });
};

export const search = async (query = '') => {
  try {
    const url = new URL(`${apiBaseUrl}/users/search`);
    url.search = new URLSearchParams({ query });

    const result = await fetch(url);
    const { data: { users = [] } = {} } = await result.json();

    return users;
  } catch (error) {
    throw new Error('Impossible to read the response! Try to try later.');
  }
};

export default {
  search,
  uploadByCSV
};
