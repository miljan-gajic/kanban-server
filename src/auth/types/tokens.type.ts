export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type LoginResponse = Tokens & { expiresIn: number };

export type CookieInResponse = {
  cookie: string;
  token: string;
};

export type TokensWithCookies = {
  access_token: CookieInResponse;
  refresh_token: CookieInResponse;
};
