import { deleteCookie, getCookie, setCookie } from './cookie';

describe('cookie utilities', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name)
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  });

  it('sets and reads an encoded cookie value', () => {
    setCookie('accessToken', 'Bearer тестовый токен');

    expect(getCookie('accessToken')).toBe('Bearer тестовый токен');
  });

  it('supports cookie names containing regular expression characters', () => {
    setCookie('token.name', 'value');

    expect(getCookie('token.name')).toBe('value');
  });

  it('returns undefined for a missing cookie', () => {
    expect(getCookie('missing')).toBeUndefined();
  });

  it('supports numeric and Date expiration values', () => {
    setCookie('numeric-expiration', 'value', { expires: 60 });
    setCookie('date-expiration', 'value', {
      expires: new Date(Date.now() + 60_000)
    });

    expect(getCookie('numeric-expiration')).toBe('value');
    expect(getCookie('date-expiration')).toBe('value');
  });

  it('supports boolean cookie properties', () => {
    setCookie('secure-token', 'value', { secure: true });

    expect(document.cookie).not.toContain('secure=true');
  });

  it('deletes a cookie', () => {
    setCookie('temporary', 'value');
    deleteCookie('temporary');

    expect(getCookie('temporary')).toBeUndefined();
  });
});
