import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export async function generateHashedPassword(password?: string): Promise<{
  tempPassword: string;
  hashedPassword: string;
}> {
  const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
  const passwordToHash = password ?? randomBytes(8).toString('hex');
  return {
    tempPassword: passwordToHash,
    hashedPassword: await bcrypt.hash(passwordToHash, saltRounds),
  };
}
