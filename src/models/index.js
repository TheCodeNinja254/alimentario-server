const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

/*
 * Import models
 * */
const BusinessContactPersonModel = require("./Definitions/BusinessContactPerson");
const CustomerModel = require("./Definitions/Customer");
const GalleryPhotoModel = require("./Definitions/GalleryPhoto");
const OrderModel = require("./Definitions/Order");
const OrderSpecificationModel = require("./Definitions/OrderSpecification");
const PaymentModel = require("./Definitions/Payment");
const ProductModel = require("./Definitions/Product");
const ShareholdersDirectorModel = require("./Definitions/ShareholdersDirector");
const StandingOrderModel = require("./Definitions/StandingOrder");
const StorageFacilityModel = require("./Definitions/StorageFacility");
const TransactionModel = require("./Definitions/Transaction");
const UserModel = require("./Definitions/User");
const WholesaleBusinessModel = require("./Definitions/WholesaleBusiness");
const CartModel = require("./Definitions/Cart");
const CartProductModel = require("./Definitions/CartProduct");
const CountryModel = require("./Definitions/Country");
const CountyModel = require("./Definitions/County");
const LocaleModel = require("./Definitions/Locale");
const DeliveryLocationsModel = require("./Definitions/DeliveryLocations");

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
const Cart = CartModel(sequelize, Sequelize);
const CartProduct = CartProductModel(sequelize, Sequelize);
const Country = CountryModel(sequelize, Sequelize);
const County = CountyModel(sequelize, Sequelize);
const DeliveryLocations = DeliveryLocationsModel(sequelize, Sequelize);
const Locale = LocaleModel(sequelize, Sequelize);

/**
 * Define Database Associations
 *
 * */

// A retail customer can only manage one business, a business can be managed by more than one user.
// Since no business has independent authentication, a user with management rights to the business can access the panel and manage
Customer.hasOne(WholesaleBusiness, { foreignKey: "id" }); // fk belongs to child 2
Customer.belongsTo(WholesaleBusiness, { foreignKey: "businessId" }); // fk belong to child 1

// A cart item can only represent on product but a prodct can be in many carts
// the same product can be in the cart table multiple times (Under the same or different customer)
Cart.belongsTo(Product, { foreignKey: "productId" });

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
  Cart,
  CartProduct,
  County,
  Country,
  DeliveryLocations,
  Locale,
};
