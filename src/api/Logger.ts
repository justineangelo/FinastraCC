import Constants from "./Contants";

class Logger {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  static log(message: any, ...optionalParams: unknown[]) {
    if (Constants.loggingEnabled) {
      console.log(message, ...optionalParams);
    }
  }
}

export { Logger };
