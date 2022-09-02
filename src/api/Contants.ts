import { Platform } from "react-native";
import app from "../../app.json";

class Constants {
  static loggingEnabled = true;
  static userAgentAppName = app.expo.name;
  static userAgentSDKVersion = app.expo.version;
  static userAgentOSVersion = `${Platform.OS}${Platform.Version}`;
  static readonly servers = {
    primary: "https://gist.githubusercontent.com/JCGonzaga01/",
    exchange: "https://v6.exchangerate-api.com/v6/",
  };
  static readonly apiKey = "679aae77947f03c9abd287ec";
}

export default Constants;
