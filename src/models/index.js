const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

/*
 * Import models
 * */
const { BusinessContactPersonModel } = require("./BusinessContactPerson");
const { CustomerModel } = require("./Customer");
const { GalleryPhotoModel } = require("./GalleryPhoto");
const { OrderModel } = require("./Order");
const { OrderSpecificationModel } = require("./OrderSpecification");
const { PaymentModel } = require("./Payment");
const { ProductModel } = require("./Product");
const { ShareholdersDirectorModel } = require("./ShareholdersDirector");
const { StandingOrderModel } = require("./StandingOrder");
const { StorageFacilityModel } = require("./StorageFacility");
const { TransactionModel } = require("./Transaction");
const { UserModel } = require("./User");
const { WholesaleBusinessModel } = require("./WholesaleBusiness");

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

// A user can only manage one business, a business can be managed by more than one user.
// Since no business has independent authentication, a user with management rights to the business can access the panel and manage
User.hasOne(WholesaleBusiness, { foreignKey: "businessId" });
WholesaleBusiness.belongsTo(User);

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
