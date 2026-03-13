'use client';

interface SetCookieOptions {
  path?: string;
  maxAge?: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
}

export const setCookie = (name: string, value: string, options: SetCookieOptions = {}) => {
  const { path = '/', maxAge, sameSite = 'Lax', secure = process.env.NODE_ENV === 'production' } = options;

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${path}`,
    maxAge !== undefined && `max-age=${maxAge}`,
    `SameSite=${sameSite}`,
    secure && 'Secure',
  ].filter(Boolean);

  document.cookie = parts.join('; ');
};

export const getCookie = (name: string): string | null => {
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => {
      const [cookieName] = c.split('=');
      return decodeURIComponent(cookieName) === name;
    });

  if (!cookie) return null;

  const [, cookieValue] = cookie.split('=');
  return decodeURIComponent(cookieValue);
};

export const deleteCookie = (name: string, options: Pick<SetCookieOptions, 'path'> = {}) => {
  setCookie(name, '', { ...options, maxAge: 0 });
};
