const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar Date

  type Query {
    getRegions: RegionsData
    getSignedInCustomer: SignedInCustomerResponse
    getSignedInUser: SignedInUserResponse
    getEstates(regionId: Int!, pageSize: Int, pageNo: Int): EstatesData
    getDisplayProducts: DisplayProductsResponse
    getCartItems: CartProductsResponse
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

  type createLeadResult {
    status: Boolean!
    message: String!
    estateName: String
    preferredDate: Date
    preferredTimePeriod: String
  }

  type ZonesData {
    getZonesStatus: Boolean!
    zones: [Zones]
  }
  type Zones {
    id: Int
    zoneName: String
    assignedDealerId: String
    status: Int
    createdAt: String
  }

  type RegionsData {
    getRegionsStatus: Boolean!
    regions: [Regions]
  }

  type Regions {
    regionId: String
    regionName: String
  }

  type EstatesData {
    getEstatesStatus: Boolean!
    getEstatesCount: Int
    estates: [Estates]
  }

  type Estates {
    estateId: Int
    id: Int
    estateName: String!
    regionId: Int
    status: String
    contractorAgencyId: String
    oltName: String
    noOfHouses: String
    occupancy: String
    coordinates: String
    houseNumbers: String
    zoneId: Int
    tierNumber: String
    createdBy: String
    createdAt: String
    updatedAt: String
    deletedAt: String
  }

  type Lead {
    tId: Int!
    firstName: String
    middleName: String
    lastName: String
    sponsorMsisdn: String
    sponsorAlternativeMsisdn: String
    emailAddress: String
    productId: String
    preferredDate: String
    preferredTimePeriod: String
    estateId: String
    estateName: String
    areaName: String
    streetName: String
    houseNumber: String
    doctypeId: Int
    documentNumber: Int
    productType: String
  }

  input AddToCartRequest {
    productId: Int!
    customerSpecification: String
    quantity: Int!
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
