const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

/*
 * Import models
 * */
const {
  BusinessContactPersonModel,
} = require("./Definitions/BusinessContactPerson");
const { CustomerModel } = require("./Definitions/Customer");
const { GalleryPhotoModel } = require("./Definitions/GalleryPhoto");
const { OrderModel } = require("./Definitions/Order");
const { OrderSpecificationModel } = require("./Definitions/OrderSpecification");
const { PaymentModel } = require("./Definitions/Payment");
const { ProductModel } = require("./Definitions/Product");
const {
  ShareholdersDirectorModel,
} = require("./Definitions/ShareholdersDirector");
const { StandingOrderModel } = require("./Definitions/StandingOrder");
const { StorageFacilityModel } = require("./Definitions/StorageFacility");
const { TransactionModel } = require("./Definitions/Transaction");
const { UserModel } = require("./Definitions/User");
const { WholesaleBusinessModel } = require("./Definitions/WholesaleBusiness");

/*
 * Declare & Invoke models
 * */
const BusinessContactPerson = BusinessContactPersonModel(sequelize, Sequelize);
const Customer = CustomerModel(sequelize, Sequelize);
const GalleryPhoto = GalleryPhotoModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const OrderSpecification = OrderSpecificationModel(sequelize, Sequelize);
const Payment = PaymentModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const ShareholdersDirector = ShareholdersDirectorModel(sequelize, Sequelize);
const StandingOrder = StandingOrderModel(sequelize, Sequelize);
const StorageFacility = StorageFacilityModel(sequelize, Sequelize);
const Transaction = TransactionModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const WholesaleBusiness = WholesaleBusinessModel(sequelize, Sequelize);

/*
 * Define Database Associations
 *
 * */

// A retail customer can only manage one business, a business can be managed by more than one user.
// Since no business has independent authentication, a user with management rights to the business can access the panel and manage
Customer.hasOne(WholesaleBusiness, { foreignKey: "businessId" });
WholesaleBusiness.belongsTo(Customer);

/*
 * Module Exports
 * */

module.exports = {
  BusinessContactPerson,
  Customer,
  GalleryPhoto,
  Order,
  OrderSpecification,
  Payment,
  Product,
  ShareholdersDirector,
  StandingOrder,
  StorageFacility,
  Transaction,
  User,
  WholesaleBusiness,
};
