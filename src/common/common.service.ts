import crypto from 'crypto';

// Generate random token
export const generateRandomToken = (): string => {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
};
