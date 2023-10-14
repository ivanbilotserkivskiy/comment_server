import { extname } from 'path';

export const customFileValidator = (req, file, callback) => {
  const allowedExtensions = ['.png', '.jpeg', '.jpg', '.txt'];
  const maxSize = 100000; // 100KB

  const fileExt = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExt)) {
    return callback('Invalid file type', false);
  }

  if (file.size > maxSize) {
    return callback('File size exceeds the maximum allowed size', false);
  }
  callback(null, true);
};
