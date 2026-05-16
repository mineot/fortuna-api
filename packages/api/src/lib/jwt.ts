import { SignJWT, jwtVerify } from 'jose';

export interface JwtUserPayload {
  sub: string;
}

const encoder = new TextEncoder();

const toSecret = (secret: string): Uint8Array => encoder.encode(secret);

export const signAccessToken = async (
  payload: JwtUserPayload,
  secret: string,
  expiresIn: string,
): Promise<string> => {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(toSecret(secret));
};

export const verifyAccessToken = async (
  token: string,
  secret: string,
): Promise<JwtUserPayload> => {
  const { payload } = await jwtVerify(token, toSecret(secret), {
    algorithms: ['HS256'],
  });

  if (!payload.sub) {
    throw new Error('Missing token subject.');
  }

  return {
    sub: payload.sub,
  };
};
