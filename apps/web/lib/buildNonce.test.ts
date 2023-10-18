import { describe, it, expect } from "vitest";

import { buildNonce } from "./buildNonce";

describe("buildNonce", () => {
  it("should return an empty string for an empty array", () => {
    const nonce = buildNonce(new Uint8Array());

    expect(nonce).toEqual("");
  });

  it("should return a base64 string for values from 0 to 63", () => {
    const array = Array(64)
      .fill(0)
      .map((_, i) => i);
    const nonce = buildNonce(new Uint8Array(array));

    expect(nonce).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  });

  it("should return a base64 string for values from 64 to 127", () => {
    const array = Array(64)
      .fill(0)
      .map((_, i) => i + 64);
    const nonce = buildNonce(new Uint8Array(array));

    expect(nonce).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  });

  it("should return a base64 string for values from 128 to 191", () => {
    const array = Array(64)
      .fill(0)
      .map((_, i) => i + 128);
    const nonce = buildNonce(new Uint8Array(array));

    expect(nonce).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  });

  it("should return a base64 string for values from 192 to 255", () => {
    const array = Array(64)
      .fill(0)
      .map((_, i) => i + 192);
    const nonce = buildNonce(new Uint8Array(array));

    expect(nonce).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  });
});
