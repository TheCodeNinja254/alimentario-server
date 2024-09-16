const { RESTDataSource } = require("apollo-datasource-rest");

class InternalAuthMainClass extends RESTDataSource {
  constructor() {
    super();

    this.signInError = 'Not logged in';
  }
}

module.exports = InternalAuthMainClass;
