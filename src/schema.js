const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar Date

  enum Region {
    africa
  }

  type Query {
    getCountries(param: String): [Countries]
  }

  type Countries {
    country: String
    region: String
  }
`;

module.exports = typeDefs;
