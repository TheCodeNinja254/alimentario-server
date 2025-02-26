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
    getSignedInCustomer: (_, __, { dataSources }) => dataSources.authenticationSessions.getSignedInCustomer(),
    getDisplayProducts: (_, args, { dataSources }) => dataSources.products.getDisplayProducts(args),
    getCartItems: (_, __, { dataSources }) => dataSources.cart.getCartItems(),
    getSignedInUser: (_, __, { dataSources }) => dataSources.authenticationSessions.getSignedInUser(),
    getCountries: (_, __, { dataSources }) => dataSources.countries.getCountries(),
    getCounties: (_, args, { dataSources }) => dataSources.counties.getCounties(args),
    getLocales: (_, args, { dataSources }) => dataSources.deliveryAreas.getLocales(args),
    getMyOrders: (_, args, { dataSources }) => dataSources.orders.getMyOrders(args),
    getAllOrders: (_, args, { dataSources }) => dataSources.ordersInternalView.getAllOrders(args),
    getDeliveryLocations: (_, args, { dataSources }) => dataSources.deliveryLocations.getDeliveryLocations(args),
    checkPaymentStatus: (_, args, { dataSources }) => dataSources.mpesaIntegration.checkPaymentStatus(args),
    getPOSCartItems: (_, args, { dataSources }) => dataSources.posCart.getPOSCartItems(args),
  },
  Mutation: {
    customerAuthentication: (_, args, { dataSources }) => dataSources.customerAuthentication.customerAuthentication(args),
    userAuthentication: (_, args, { dataSources }) => dataSources.userAuthentication.userAuthentication(args),
    customerAccountCreation: (_, args, { dataSources }) => dataSources.customerAccount.customerAccountCreation(args),
    addToCart: (_, args, { dataSources }) => dataSources.cart.addToCart(args),
    removeCartItem: (_, args, { dataSources }) => dataSources.cart.removeCartItem(args),
    signOut: (_, __, { dataSources }) => dataSources.customerAuthentication.signOut(),
    userSignOut: (_, __, { dataSources }) => dataSources.userAuthentication.userSignOut(),
    addDeliveryLocation: (_, args, { dataSources }) => dataSources.deliveryLocations.addDeliveryLocation(args),
    removeDeliveryLocation: (_, args, { dataSources }) => dataSources.deliveryLocations.removeDeliveryLocation(args),
    addCountry: (_, args, { dataSources }) => dataSources.countries.addCountry(args),
    removeCountry: (_, args, { dataSources }) => dataSources.countries.removeCountry(args),
    removeCounty: (_, args, { dataSources }) => dataSources.counties.removeCounty(args),
    addCounty: (_, args, { dataSources }) => dataSources.counties.addCounty(args),
    addLocale: (_, args, { dataSources }) => dataSources.deliveryAreas.addLocale(args),
    removeLocale: (_, args, { dataSources }) => dataSources.deliveryAreas.removeLocale(args),
    addOrder: (_, args, { dataSources }) => dataSources.orders.addOrder(args),
    updateOrderStatus: (_, args, { dataSources }) => dataSources.ordersInternalView.updateOrderStatus(args),
    lipaNaMpesaOnline: (_, args, { dataSources }) => dataSources.mpesaIntegration.lipaNaMpesaOnline(args),
    addToPOSCart: (_, args, { dataSources }) => dataSources.posCart.addToPOSCart(args),
    removePOSCartItem: (_, args, { dataSources }) => dataSources.posCart.removePOSCartItem(args),
  },
};
