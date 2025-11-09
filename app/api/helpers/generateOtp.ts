export const generateOTP = (length = 6): string => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  
  // Convert number to string and take the last `length` digits
  const otp = array[0].toString().slice(-length).padStart(length, "0");
  return otp;
};
