export const generateSecureCode = (): string => {
  // Generate 16 random digits
  const digits = [];
  for (let i = 0; i < 16; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  
  // Format as groups of 4 digits
  const code = digits.join('');
  return `${code.slice(0, 4)} ${code.slice(4, 8)} ${code.slice(8, 12)} ${code.slice(12, 16)}`;
};