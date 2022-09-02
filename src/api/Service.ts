/* eslint-disable  @typescript-eslint/no-explicit-any */
import axios, { CancelTokenSource } from "axios";
import Constants from "./Contants";
import { APIError } from "./Error";
import { Logger } from "./Logger";

type APIServer = "primary" | "exchange";

class APIMethod {
  private method: string;
  private path: string;

  getMethod(): string {
    return this.method;
  }

  getPath(): string {
    return this.path;
  }

  static get(path?: string): APIMethod {
    return new APIMethod("get", path);
  }

  private constructor(method: string, path?: string) {
    this.method = method;
    this.path = path ?? "";
  }
}

class APIService<T> {
  requestName = "";
  private apiServer: APIServer = "primary";
  private apiMethod = APIMethod.get("");
  private cancelToken?: CancelTokenSource;
  private headers?: { [key: string]: string | number };
  private queryParameters?: { [key: string]: string | number };
  private requestBody?: any;

  setAPIServer(apiServer: APIServer) {
    this.apiServer = apiServer;
    return this;
  }

  setMethod(apiMethod: APIMethod) {
    this.apiMethod = apiMethod;
    return this;
  }

  setHeaders(headers: { [key: string]: string | number }) {
    this.headers = headers;
    return this;
  }

  setQueryParameters(queryParameters: { [key: string]: string | number }) {
    this.queryParameters = queryParameters;
    return this;
  }

  setRequestBody(requestBody: any) {
    this.requestBody = requestBody;
    return this;
  }

  execute(): Promise<T> {
    return new Promise((resolve, reject) => {
      Logger.log(
        "<=============================================================================================>"
      );
      Logger.log(
        `${this.requestName ? this.requestName : ""} Operation Started`
      );
      const api = generateServer(this.apiServer);
      this.cancelToken = axios.CancelToken.source();

      api({
        cancelToken: this.cancelToken?.token,
        headers: this.updatedHeaders(),
        method: this.apiMethod.getMethod(),
        url: this.apiMethod.getPath(),
        params: this.queryParameters,
        data: this.requestBody,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(APIError.loadError(error));
        })
        .finally(() => {
          Logger.log(
            `${this.requestName ? this.requestName : ""} Operation finished`
          );
          Logger.log(
            "<=============================================================================================>"
          );
        });
    });
  }

  cancel(message?: string) {
    if (message) {
      this.cancelToken?.cancel(message);
    } else {
      this.cancelToken?.cancel(
        `${
          this.requestName ? this.requestName : ""
        } Operation is forcefully cancelled`
      );
    }
  }

  constructor() {
    //private constructor
  }

  private updatedHeaders() {
    const userAgent = `finastra/${Constants.userAgentAppName}/${Constants.userAgentSDKVersion}/${Constants.userAgentOSVersion}`;

    if (this.headers) {
      const updatedHeaders = this.headers;

      updatedHeaders["User-Agent"] = userAgent;
      return updatedHeaders;
    } else {
      return { "User-Agent": userAgent };
    }
  }
}

const generateServer = (server: APIServer) => {
  return axios.create({ baseURL: Constants.servers[server] });
};

export { APIMethod };

export default APIService;
