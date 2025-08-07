export const generateTransactionId = () => {
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, '0');

  const year = pad(now.getFullYear() % 100);       // YY
  const month = pad(now.getMonth() + 1);           // MM (0-based)
  const date = pad(now.getDate());                 // DD
  const hours = pad(now.getHours());               // HH
  const minutes = pad(now.getMinutes());           // MM
  const seconds = pad(now.getSeconds());           // SS

  return `${year}${month}${date}${hours}${minutes}${seconds}`;
};
