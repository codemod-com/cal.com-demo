import { Logger } from "tslog";

import { IS_PRODUCTION } from "./constants";

const logger = new Logger({
  minLevel: !!process.env.NEXT_PUBLIC_DEBUG ? 2 : 4,
  maskValuesOfKeys: ["password", "passwordConfirmation", "credentials", "credential"],
  prettyLogTimeZone: IS_PRODUCTION ? "UTC" : "local",
  // dateTimePattern: "hour:minute:second.millisecond",
  // displayFunctionName: false,
  // displayFilePath: "hidden",
  // exposeErrorCodeFrame: !IS_PRODUCTION,
  stylePrettyLogs: true,
  prettyLogStyles: {
    name: "yellow",
    dateIsoStr: "blue",
    // number: "blue",
    // bigint: "blue",
    // boolean: "blue",
  },
});

export default logger;
