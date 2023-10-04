import { Logger } from "tslog";

// import { IS_PRODUCTION } from "./constants";

const logger = new Logger({
  minLevel: !!process.env.NEXT_PUBLIC_DEBUG ? 2 : 4,
  maskValuesOfKeys: ["password", "passwordConfirmation", "credentials", "credential"],
  // dateTimePattern: "hour:minute:second.millisecond",
  // displayFunctionName: false,
  // displayFilePath: "hidden",
  // dateTimeTimezone: IS_PRODUCTION ? "utc" : Intl.DateTimeFormat().resolvedOptions().timeZone,
  // prettyInspectHighlightStyles: {
  //   name: "yellow",
  //   number: "blue",
  //   bigint: "blue",
  //   boolean: "blue",
  // },
  // exposeErrorCodeFrame: !IS_PRODUCTION,
});

export default logger;
