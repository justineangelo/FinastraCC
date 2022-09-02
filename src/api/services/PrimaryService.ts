import APIService, { APIMethod } from "api/Service";

class PrimaryService<T> extends APIService<T> {
  getUsers(): PrimaryService<T> {
    this.requestName = "PrimaryService: getUsers()";
    this.setMethod(
      APIMethod.get(
        "36a8af85464d998221c71ea3eaa57225/raw/6fe851e029ee98e9ec85ceb87433ed5ed0f06e36/users.json"
      )
    );

    return this;
  }

  getCourses(): PrimaryService<T> {
    this.requestName = "PrimaryService: getCourses()";
    this.setMethod(
      APIMethod.get(
        "9c9e3590fb23274263678b6c4bcf9963/raw/600c8281f9db7eaba959a732912eba350bf7387d/user-course-selection.json"
      )
    );

    return this;
  }

  getCurrencies(): PrimaryService<T> {
    this.requestName = "PrimaryService: getCurrencies()";
    this.setMethod(
      APIMethod.get(
        "9f93162c5fb799b7c084bb28fc69a2f1/raw/94c55f89dc4c1e2e7ca49de5658c3441a2b348af/Updated-Common-Currency.json"
      )
    );

    return this;
  }

  constructor() {
    super();

    this.setAPIServer("primary");
  }
}

export default PrimaryService;
