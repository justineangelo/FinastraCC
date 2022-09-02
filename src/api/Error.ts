interface RequestAPIError {
  status: number;
  _response: string;
}

interface ResponseAPIError {
  status: number;
  data: { msg?: unknown; errors?: unknown };
}

class APIError {
  code: number;
  message: string;
  raw: unknown;

  private constructor(code: number, message: string, raw?: unknown) {
    this.code = code;
    this.message = message;
    this.raw = raw;
  }

  static loadError(error?: {
    request?: RequestAPIError;
    response?: ResponseAPIError;
    message?: string;
  }): APIError {
    const responseError = new APIError(1, "Something went wrong.");

    if (error?.request) {
      const errorMessage = error.request._response;
      const jsonErr = JSON.parse(errorMessage);

      responseError.code = error.request.status;
      if (jsonErr["error-type"]) {
        responseError.message = jsonErr["error-type"];
      } else {
        responseError.message = errorMessage;
      }
      responseError.raw = error.request;
    } else if (error?.message) {
      responseError.code = -1;
      responseError.message = error.message;
      responseError.raw = error;
    }

    return responseError;
  }
}

export { APIError };
