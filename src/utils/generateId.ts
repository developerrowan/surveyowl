import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export default function generateId(length?: number): string {
  const nanoid = customAlphabet(alphabet, length || 6);

  return nanoid();
}
