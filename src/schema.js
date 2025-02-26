const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar Date

  type Query {
    getSignedInCustomer: SignedInCustomerResponse
    getSignedInUser: SignedInUserResponse
    getDisplayProducts(
      productCategory: Int!
      productFamily: String!
    ): DisplayProductsResponse
#      Added guestId here for future use
    getCartItems(guestId: String): CartProductsResponse
    getPOSCartItems(guestId: String): CartProductsResponse
    getCountries: CountriesResponse
    getCounties(countryId: Int!): CountiesResponse
    getLocales(countyId: Int!): LocalesResponse
    getMyOrders(pageSize: Int!, orderStatus: String): OrdersResponse
    getOrders(pageSize: Int!, orderStatus: String): OrdersResponse
    getAllOrders(pageSize: Int!, orderStatus: String, hasSearch: Boolean, searchValue: String, isPreorder: Int): OrdersResponse
    getDeliveryLocations: DeliveryLocationsResponse
    checkPaymentStatus(
      paymentCorrelationId: String!
    ): CheckPaymentStatusResponse
  }

  type Mutation {
    customerAuthentication(
      email: String!
      password: String!
    ): CustomerLoginResponse!
    userAuthentication(
      email: String!
      password: String!
    ): UserLoginResponse!
    customerAccountCreation(input: CustomerAccountRequest): Result!
    addToCart(input: AddToCartRequest): Result!
    addToPOSCart(input: AddToCartRequest): AddToPOSCartResponse!
    removeCartItem(id: Int!): Result!
    removePOSCartItem(id: Int!): Result!
    signOut: Result!
    userSignOut: Result!
    addCountry(input: AddCountryInput): Result!
    removeCountry(id: Int!): Result!
    addCounty(input: AddCountyInput): Result!
    removeCounty(id: Int!): Result!
    addLocale(input: AddLocaleInput): Result!
    removeLocale(id: Int!): Result!
    addDeliveryLocation(input: AddDeliveryLocation): Result!
    removeDeliveryLocation(id: Int!): Result!
    addOrder(input: ConfirmOrderInput): AddOrderResponse!
    updateOrderStatus(input: UpdateOrderStatusInput): Result!
    lipaNaMpesaOnline(
      amount: String!
      phoneNumber: String!
      paymentCorrelationId: String!
    ): LipaNaMPesaOnlineResponse!
  }

  type Result {
    status: Boolean!
    message: String!
  }
  
  type POSCartBody {
      guestId: String
  }
  
  type AddToPOSCartResponse {
    status: Boolean!
    message: String!
    body: POSCartBody
  }

  type LipaNaMPesaOnlineResponse {
    status: Boolean!
    responseMessage: String
    customerMessageExtended: String
    customerMessage: String
  }

  type CheckPaymentStatusResponse {
    pollingComplete: Boolean
    status: Boolean!
    message: String
    paymentDetails: PaymentDetailsData
  }

  type PaymentDetailsData {
    id: Int
    paymentMethod: String
    amountPaid: Int
    resultCode: String
    resultDesc: String
    mpesaReceiptNumber: String
    transactionDate: String
  }

  type AddOrderResponse {
    status: Boolean!
    message: String!
    paymentCorrelationId: String!
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
    localesList: [LocalesData]
  }

  type OrdersResponse {
    status: Boolean!
    message: String
    myOrders: MyOrdersObject
  }
  
  type AdminOrdersResponse {
    status: Boolean!
    message: String
    orders: MyOrdersObject
  }

  type MyOrdersObject {
    currentSelection: Int
    totalElements: Int
    content: [OrdersData]
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
    id: Int
    localeName: String
  }

  type OrdersData {
    orderId: Int
    paymentId: Int
    amountDue: Int
    deliveryLocationId: Int
    orderStatus: String
    orderType: String
    addedBy: String
    updatedBy: String
    createdAt: Date
    updatedAt: Date
    countryId: Int
    countyId: Int
    localeId: Int
    customerInfo: CustomerInfo
    deliveryLocation: DeliveryLocationsData
    specifications: [SpecificationsData]
  }

  type CustomerInfo {
    firstName: String
    lastName: String
    msisdn: String
    emailAddress: String
    username: String
  }

  type SpecificationsData {
    id: Int
    orderId: Int
    productId: Int
    productQuantity: Int
    orderSpecification: String
    addedBy: String
    updatedBy: String
    createdAt: Date
    updatedAt: Date
    productName: String
    productDescription: String
    productPicMain: String
    productPicTwo: String
    productPicThree: String
    productPicFour: String
    productUnitOfMeasure: String
    productInstructionsLink: String
    productVideoLink: String
    stockStatus: String
    productStatus: Int
    productPrice: Int
    productCategory: Int
    expiryDate: Date
    productStorageFacility: Int
  }

  type DeliveryLocationsData {
    id: Int
    countryId: Int
    countyId: Int
    localeId: Int
    deliveryPreciseLocation: String
    deliveryAdditionalNotes: String
    alternativePhoneNumber: String
    countryName: String
    countyFlagUri: String
    countyName: String
    localeName: String
  }

  type CartProductsResponse {
    status: Boolean!
    message: String
    preOrderItemsFound: Boolean
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
    userRole: String
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
  
  type UserLoginResponse {
    status: Boolean!
    message: String!
    username: String
    firstName: String
    lastName: String
    msisdn: String
    userRole: String
    userStatus: String
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
    tag: String
    productFamily: String
    vendor: String
    originCountry: String
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
    productId: Int
  }

  input AddToCartRequest {
    productId: Int!
    customerSpecification: String
    quantity: Int!
    orderType: String
    guestId: String
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

  input ConfirmOrderInput {
    cartItemsList: [CartItemsInput]
    amountDue: Int!
    deliveryLocationId: Int!
    orderType: String!
    isPreorder: Boolean,
    preferredDeliveryTime: String
  }

  input UpdateOrderStatusInput {
    orderId: Int!
    status: String!
  }

  input CartItemsInput {
    id: Int!
    productId: Int!
    quantity: Int!
    customerSpecification: String!
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
