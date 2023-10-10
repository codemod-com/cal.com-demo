import { AB_TEST_BUCKET_PROBABILITY } from "@calcom/lib/constants";

const cryptoRandom = () => {
  return crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1);
};

export const getBucket = () => {
  return cryptoRandom() * 100 < AB_TEST_BUCKET_PROBABILITY ? "future" : "legacy";
};
