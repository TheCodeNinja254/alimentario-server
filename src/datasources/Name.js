const { RESTDataSource } = require("apollo-datasource-rest");
const config = require("dotenv");

config.config();

let name = "Stephen";
class Name extends RESTDataSource {
  async getName() {
    return {
      name,
    };
  }

  async writeName(args) {
    const { name: paramName } = args;
    name = paramName;
    return true;
  }
}

module.exports = Name;
