// Input sanitization and validation helpers

export const sanitizeString = (str, maxLength = 255) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, maxLength);
};

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 150;
};

export const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8 && password.length <= 128;
};
