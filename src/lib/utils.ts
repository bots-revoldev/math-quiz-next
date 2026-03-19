import { v4 as uuidv4 } from 'uuid';

export function generateMagicToken() {
  return uuidv4();
}
