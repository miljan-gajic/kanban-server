export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type LoginResponse = Tokens & { expiresIn: number };
