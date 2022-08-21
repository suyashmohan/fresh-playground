import { Header } from "djwt";

/*
export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);
const exportedKey = JSON.stringify(await crypto.subtle.exportKey("jwk", key));
*/

const importedKey =
  '{"kty":"oct","k":"YdXXXAY01pWb7idBeEr2ywW9TmO9sMeYfqZM7zCJgQ4mxvFjRCgLvWxjQ5_9YrMkKdzg8hWA29-UIDKxPQ0nCYDmftDT3oqSfqD7Eg043TwYMzIQXQXF5aQTN-GbB0CAt3eDaZHbCXXEKX-cZF2qabWF8vBFxaRKy4ctcCbita4","alg":"HS512","key_ops":["sign","verify"],"ext":true}';

export const key = await crypto.subtle.importKey(
  "jwk",
  JSON.parse(importedKey),
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["verify", "sign"],
);

export const header: Header = {
  alg: "HS512",
  typ: "JWT",
};
