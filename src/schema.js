const { gql } = require("apollo-server-koa");

const typeDefs = gql`
  scalar Date

  type Query {
    getRegions: RegionsData
    getEstates(regionId: Int!, pageSize: Int, pageNo: Int): EstatesData
  }

  type Mutation {
    createLead(input: LeadDetails!): createLeadResult!
    userAuthentication(email: String!, password: String!): Result!
    checkLeadDetails(input: LeadCheckData!): SingleLeadData
  }

  type Result {
    status: Boolean!
    message: String!
    role: String
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

  type SingleLeadData {
    getLeadStatus: Boolean!
    message: String
    leads: [Lead]
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

  input LeadDetails {
    firstName: String!
    middleName: String
    lastName: String
    sponsorMsisdn: String!
    sponsorAlternativeMsisdn: String
    emailAddress: String
    productId: Int!
    preferredDate: String
    preferredTimePeriod: String
    passedEstateId: Int
    areaName: String
    regionId: Int
    newEstateName: String
    streetName: String
    houseNumber: String
    doctypeId: String
    documentNumber: String
    productType: String
    addOns: String
  }

  input LeadCheckData {
    uniqueIdentity: String!
  }
`;

module.exports = typeDefs;
