import Constants from "api/Contants";
import APIService, { APIMethod } from "api/Service";

class ExchangeService<T> extends APIService<T> {
  getRateForCurrency(code: string): ExchangeService<T> {
    this.requestName = "ExchangeService: getRate()";
    this.setMethod(APIMethod.get(`${Constants.apiKey}/pair/USD/${code}`));

    return this;
  }

  constructor() {
    super();

    this.setAPIServer("exchange");
  }
}

export default ExchangeService;
