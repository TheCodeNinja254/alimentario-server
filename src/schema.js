const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar Date

  type Query {
    getSignedInCustomer: SignedInCustomerResponse
    getSignedInUser: SignedInUserResponse
    getDisplayProducts: DisplayProductsResponse
    getCartItems: CartProductsResponse
    getCountries: CountriesResponse
    getCounties: CountiesResponse
    getLocales: LocalesResponse
    getDeliveryLocations: DeliveryLocationsResponse
  }

  type Mutation {
    customerAuthentication(
      email: String!
      password: String!
    ): CustomerLoginResponse!
    customerAccountCreation(input: CustomerAccountRequest): Result!
    addToCart(input: AddToCartRequest): Result!
    removeCartItem(id: Int!): Result!
    signOut: Result!
    addCountry(input: AddCountryInput): Result!
    removeCountry(id: Int!): Result!
    addCounty(input: AddCountyInput): Result!
    removeCounty(id: Int!): Result!
    addLocale(input: AddLocaleInput): Result!
    removeLocale(id: Int!): Result!
    addDeliveryLocation(input: AddDeliveryLocation): Result!
    removeDeliveryLocation(id: Int!): Result!
  }

  type Result {
    status: Boolean!
    message: String!
    role: String
  }

  type DisplayProductsResponse {
    status: Boolean!
    message: String
    productsList: [DisplayProductsData]
  }

  type CountriesResponse {
    status: Boolean!
    message: String
    countriesList: [CountriesData]
  }

  type CountiesResponse {
    status: Boolean!
    message: String
    countiesList: [CountiesData]
  }

  type DeliveryLocationsResponse {
    status: Boolean!
    message: String
    locationsList: [DeliveryLocationsData]
  }

  type LocalesResponse {
    status: Boolean!
    message: String
    countiesList: [LocalesData]
  }

  type CountriesData {
    id: Int!
    countryName: String!
    countyFlagUri: String
  }

  type CountiesData {
    id: Int!
    countyName: String!
  }

  type LocalesData {
    id: Int!
    localeName: String!
  }

  type DeliveryLocationsData {
    id: Int!
    countryId: Int!
    countyId: Int!
    localeId: Int!
    deliveryPreciseLocation: String
    deliveryAdditionalNotes: String
    alternativePhoneNumber: String
    countryName: String
    countyFlagUri: String
    countyName: String
    countyName: String
  }

  type CartProductsResponse {
    status: Boolean!
    message: String
    cartItemsList: [CartProductsData]
  }

  type SignedInCustomerResponse {
    status: Boolean!
    customer: SignedInCustomerData
    business: AssociatedCustomerBusinessData
  }

  type SignedInCustomerData {
    username: String
    customerStatus: String
    firstName: String
    lastName: String
    msisdn: String
    businessId: Int
    emailAddress: String
    verificationStatus: Int
    bearerToken: String
  }

  type AssociatedCustomerBusinessData {
    businessName: String
    registeredAddress: String
    businessLocationLatitude: String
    businessLocationLongitude: String
    businessType: String
    primaryEmailAddress: String
    primaryContact: String
    preferredCreditPeriod: String
  }

  type SignedInUserResponse {
    status: Boolean!
    user: SignedInUserData
  }
  type SignedInUserData {
    username: String
    userStatus: String
    firstName: String
    lastName: String
    msisdn: String
    userRole: Int
    emailAddress: String
    verificationStatus: Int
    bearerToken: String
  }

  type CustomerLoginResponse {
    status: Boolean!
    message: String!
    username: String
    firstName: String
    lastName: String
    msisdn: String
    customerStatus: String
    businessId: String
    emailAddress: String
    verificationStatus: String
  }

  type DisplayProductsData {
    id: Int!
    productName: String
    productDescription: String
    productPicMain: String
    productPicTwo: String
    productPicThree: String
    productPicFour: String
    productUnitOfMeasure: String
    productInstructionsLink: String
    productVideoLink: String
    stockStatus: Int
    productPrice: Int
    productStatus: Int
    productCategory: Int
    expiryDate: Date
  }

  type CartProductsData {
    id: Int
    productName: String
    productDescription: String
    productPicMain: String
    productPicTwo: String
    productPicThree: String
    productPicFour: String
    productUnitOfMeasure: String
    productInstructionsLink: String
    productVideoLink: String
    stockStatus: Int
    productPrice: Int
    productStatus: Int
    expiryDate: Date
    customerSpecification: String
    createdAt: Date
    quantity: Int
  }

  input AddToCartRequest {
    productId: Int!
    customerSpecification: String
    quantity: Int!
  }

  input AddCountryInput {
    countryName: String!
  }

  input AddCountyInput {
    countryName: String!
    countryId: Int!
  }

  input AddLocaleInput {
    localeName: String!
    countyId: Int!
  }

  input AddDeliveryLocation {
    countyId: Int!
    localeId: Int!
    deliveryPreciseLocation: String
    deliveryAdditionalNotes: String
    alternativePhoneNumber: String
  }

  input CustomerAccountRequest {
    firstName: String!
    lastName: String
    password: String!
    msisdn: String
    emailAddress: String!
  }
`;

module.exports = typeDefs;
