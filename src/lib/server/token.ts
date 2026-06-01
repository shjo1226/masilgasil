import { createHmac, timingSafeEqual } from "node:crypto";

type TokenKind = "access" | "refresh";

export interface AuthTokenPayload {
  sub: string;
  kind: TokenKind;
  nickname?: string;
  profileImg?: string | null;
  exp: number;
  iat: number;
}

const getSecret = () => process.env.NEXTAUTH_SECRET ?? "masilgasil-local-secret";

const encodeBase64Url = (value: string) => Buffer.from(value).toString("base64url");

const decodeBase64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const sign = (header: object, payload: AuthTokenPayload) => {
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", getSecret()).update(unsignedToken).digest("base64url");

  return `${unsignedToken}.${signature}`;
};

const verifySignature = (token: string) => {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error("Invalid token format");
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createHmac("sha256", getSecret()).update(unsignedToken).digest();
  const actualSignature = Buffer.from(encodedSignature, "base64url");

  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthTokenPayload;

  if (payload.exp * 1000 <= Date.now()) {
    throw new Error("Token expired");
  }

  return payload;
};

export const issueAccessToken = (
  payload: Pick<AuthTokenPayload, "sub" | "nickname" | "profileImg">,
  expiresInSeconds = 60 * 60,
) => {
  const now = Math.floor(Date.now() / 1000);

  return sign(
    { alg: "HS256", typ: "JWT" },
    {
      ...payload,
      kind: "access",
      iat: now,
      exp: now + expiresInSeconds,
    },
  );
};

export const issueRefreshToken = (
  payload: Pick<AuthTokenPayload, "sub">,
  expiresInSeconds = 60 * 60 * 24 * 30,
) => {
  const now = Math.floor(Date.now() / 1000);

  return sign(
    { alg: "HS256", typ: "JWT" },
    {
      ...payload,
      kind: "refresh",
      iat: now,
      exp: now + expiresInSeconds,
    },
  );
};

export const verifyAccessToken = (token: string) => {
  const payload = verifySignature(token);

  if (payload.kind !== "access") {
    throw new Error("Invalid access token");
  }

  return payload;
};

export const verifyRefreshToken = (token: string) => {
  const payload = verifySignature(token);

  if (payload.kind !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return payload;
};
