import { isValidInt } from './isValidInt';
import { isValidString } from './isValidString';

export const validation = ({
  comment_text,
  username,
  email,
  parent_id,
  tred_id,
}) => {
  if (!isValidString(comment_text, true, 65535)) {
    return 'not valid comment text';
  }

  if (!isValidString(username, true, 255)) {
    return 'not valid username';
  }

  if (!isValidString(email, true, 255)) {
    return 'not valid email';
  }

  if (parent_id && !isValidInt(+parent_id, true)) {
    return 'parent_id is not a number';
  }

  if (tred_id && !isValidInt(+tred_id)) {
    return 'tred_id is not a number';
  }

  return null;
};
