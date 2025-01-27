const { Sequelize } = require("sequelize");
const InternalAuthMainClass = require('./InternalAuthMainClass');
const {
  selectOrderSpecificationsQuery,
  selectAllPendingOrdersQuery,
  selectAllClosedOrdersQuery,
  selectAllOrdersWithoutStatusQuery,
  selectAllPendingOrdersCountQuery,
  selectAllClosedOrdersCountQuery,
  selectAllOrdersCountQuery,
  selectAllOrdersWithSearch,
} = require("../../Database/queryStrings");
const sequelize = require("../../Database/connection");
const Logger = require("../../utils/logging");
const { Order } = require("../../models");

class OrdersViewAPI extends InternalAuthMainClass {
  constructor() {
    super();

    this.signInError = null;
    this.noOrdersToShow = null;
  }

  async getAllOrders(args) {
    const {
      pageSize, orderStatus, hasSearch, searchValue, isPreorder,
    } = args;

    try {
      let result = {
        status: false,
        message: "No orders to show",
        myOrders: [],
      };

      // query with search

      const selectOrdersQueryWithSearch = () => selectAllOrdersWithSearch(searchValue, isPreorder);

      // query
      const selectOrdersQuery = (_pageSize) => {
        switch (orderStatus) {
          case 'pending':
            return selectAllPendingOrdersQuery(_pageSize, isPreorder);
          case 'closed':
            return selectAllClosedOrdersQuery(_pageSize, isPreorder);
          default:
            return selectAllOrdersWithoutStatusQuery(_pageSize, isPreorder);
        }
      };

      // count
      const selectCountQuery = () => {
        switch (orderStatus) {
          case 'pending':
            return selectAllPendingOrdersCountQuery(isPreorder);
          case 'closed':
            return selectAllClosedOrdersCountQuery(isPreorder);
          default:
            return selectAllOrdersCountQuery(isPreorder);
        }
      };

      const selectQuery = () => (hasSearch ? selectOrdersQueryWithSearch(): selectOrdersQuery(pageSize));

      const orders = await sequelize.query(selectQuery(pageSize), {
        type: Sequelize.QueryTypes.SELECT,
      });

      if (orders && orders.length > 0) {
        const ordersCount = await sequelize.query(selectCountQuery(), { type: Sequelize.QueryTypes.SELECT });

        const ordersMap = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const order of orders) {
          const { orderId } = order;

          if (!ordersMap[orderId]) {
            ordersMap[orderId] = {
              orderId: order.orderId,
              paymentId: order.paymentId,
              amountDue: order.amountDue,
              deliveryLocationId: order.deliveryLocationId,
              orderStatus: order.orderStatus,
              orderType: order.orderType,
              addedBy: order.addedBy,
              updatedBy: order.updatedBy,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              countryId: order.countryId,
              countyId: order.countyId,
              localeId: order.localeId,
              customerInfo: {
                firstName: order.firstName,
                lastName: order.lastName,
                msisdn: order.msisdn,
                emailAddress: order.emailAddress,
                username: order.addedBy,
              },
              deliveryLocation: {
                id: order.deliveryLocationId,
                deliveryLocation: order.deliveryLocation,
                deliveryPreciseLocation: order.deliveryPreciseLocation,
                latitude: order.deliveryLocationLatitude,
                longitude: order.deliveryLocationLongitude,
                additionalNotes: order.deliveryAdditionalNotes,
                alternativePhoneNumber: order.alternativePhoneNumber,
                countryName: order.countryName,
                countyName: order.countyName,
                localeName: order.localeName,
              },
              specifications: [],
            };
          }

          // eslint-disable-next-line no-await-in-loop
          const specifications = await sequelize.query(selectOrderSpecificationsQuery(orderId), { type: Sequelize.QueryTypes.SELECT });

          ordersMap[orderId].specifications.push(...specifications);
        }

        const ordersArray = Object.values(ordersMap);

        result = {
          status: true,
          message: "Orders fetched successfully!",
          myOrders: {
            currentSelection: pageSize,
            totalElements: ordersCount[0].orderCount || 0,
            content: ordersArray.reverse(),
          },
        };
        return result;
      } else {
        return result;
      }
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage: "An error occurred. This is temporary and should resolve in a short time. "
                    + "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });
      console.log(e);
      return {
        status: false,
        message: e.message,
      };
    }
  }

  async updateOrderStatus(args) {
    const { input: { status, orderId } } = args;

    console.log(args);

    try {
      const updateResult = await Order.update(
        { orderStatus: status }, // Object specifying the new values for the columns to be updated
        {
          where: { id: orderId }, // Condition to identify which row to update
        },
      ).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not update order status",
          actualError: "Could not update order status",
          customerMessage:
              "We are unable to update your order status at the moment. Please try again later.",
        });
        return {
          status: false,
          message: "Failed to update order status. Please try again.",
        };
      });

      // Check if the update was successful by looking at the number of affected rows
      if (updateResult[0] === 0) {
        return {
          status: false,
          message: "Order not found or status is already up-to-date.",
        };
      }

      return {
        status: true,
        message: "Order status updated successfully.",
      };
    } catch (e) {
      /**
       * Create a log instance with the error
       */
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
            "An error occurred while updating the order status. Please try again later.",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }
}

module.exports = OrdersViewAPI;
