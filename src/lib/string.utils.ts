export const isNumber = (str: string): boolean => /^[0-9]*$/.test(str);

export const isEmail = (str: string): boolean => /^[A-Za-z0-9_.\-]{1,64}@[A-Za-z0-9_.\-]{1,260}$/.test(str);
