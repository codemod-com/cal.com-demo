const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const buildNonce = (uint8array: Uint8Array): string => {
  const bytes = uint8array.map((value) => value & 0x3f);

  const nonceCharacters: string[] = [];

  bytes.forEach((value) => {
    nonceCharacters.push(BASE64_ALPHABET.charAt(value));
  });

  return nonceCharacters.join("");
};
