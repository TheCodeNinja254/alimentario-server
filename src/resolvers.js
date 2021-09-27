const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

module.exports = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      throw new Error("Please pass a date");
    },
  }),
  Query: {
    getRegions: (_, args, { dataSources }) => dataSources.location.getRegions(),
    getEstates: (_, args, { dataSources }) =>
      dataSources.location.getEstates(args),
  },
  Mutation: {
    createLead: (_, args, { dataSources }) => dataSources.lead.createLead(args),
    checkLeadDetails: (_, args, { dataSources }) =>
      dataSources.lead.checkLeadDetails(args),
  },
};
