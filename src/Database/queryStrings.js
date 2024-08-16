const selectOrdersWithoutStatusQuery = (username, pageSize) => (`
      SELECT a.id as orderId,
       paymentId,
       amountDue,
       deliveryLocationId,
       orderStatus,
       orderType,
       a.addedBy,
       a.updatedBy,
       a.createdAt,
       a.updatedAt,
       b.countryId,
       b.countyId,
       c.countryName,
       d.countyName,
       e.localeName,
       b.localeId,
       b.deliveryLocation,
       b.deliveryPreciseLocation,
       b.deliveryLocationLatitude,
       b.deliveryLocationLongitude,
       b.deliveryAdditionalNotes,
       b.alternativePhoneNumber
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
    WHERE a.addedBy = '${username}'
    AND a.orderType = 'Retail'
    GROUP BY a.id
    ORDER BY a.id DESC
    LIMIT ${pageSize};
    `);

const selectPendingOrdersQuery = (username, pageSize) => (`
      SELECT a.id as orderId,
       paymentId,
       amountDue,
       deliveryLocationId,
       orderStatus,
       orderType,
       a.addedBy,
       a.updatedBy,
       a.createdAt,
       a.updatedAt,
       b.countryId,
       b.countyId,
       c.countryName,
       d.countyName,
       e.localeName,
       b.localeId,
       b.deliveryLocation,
       b.deliveryPreciseLocation,
       b.deliveryLocationLatitude,
       b.deliveryLocationLongitude,
       b.deliveryAdditionalNotes,
       b.alternativePhoneNumber
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
    WHERE a.addedBy = '${username}'
    AND a.orderType = 'Retail'
    AND a.orderStatus in (
    'New',
    'Pending',
    'Enroute',
    'Preparation',
    'Delayed'
    )
    GROUP BY a.id
    ORDER BY a.id DESC
    LIMIT ${pageSize};
    `);

const selectClosedOrdersQuery = (username, pageSize) => (`
      SELECT a.id as orderId,
       paymentId,
       amountDue,
       deliveryLocationId,
       orderStatus,
       orderType,
       a.addedBy,
       a.updatedBy,
       a.createdAt,
       a.updatedAt,
       b.countryId,
       b.countyId,
       c.countryName,
       d.countyName,
       e.localeName,
       b.localeId,
       b.deliveryLocation,
       b.deliveryPreciseLocation,
       b.deliveryLocationLatitude,
       b.deliveryLocationLongitude,
       b.deliveryAdditionalNotes,
       b.alternativePhoneNumber
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
    WHERE a.addedBy = '${username}'
    AND a.orderType = 'Retail'
    AND a.orderStatus not in (
    'New',
    'Pending',
    'Enroute',
    'Preparation',
    'Delayed'
    )
    GROUP BY a.id
    ORDER BY a.id DESC
    LIMIT ${pageSize};
    `);

const selectOrdersCountQuery = (username) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE addedBy = '${username}'
      AND orderType = 'Retail';
    `);

const selectPendingOrdersCountQuery = (username) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE addedBy = '${username}'
      AND orderType = 'Retail'
      AND orderStatus  in (
        'New',
        'Pending',
        'Enroute',
        'Preparation',
        'Delayed'
    );
    `);

const selectClosedOrdersCountQuery = (username) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE addedBy = '${username}'
      AND orderType = 'Retail'
      AND orderStatus not in (
        'New',
        'Pending',
        'Enroute',
        'Preparation',
        'Delayed'
    );
    `);

const selectOrderSpecificationsQuery = (orderId) => (
  `
    SELECT a.*, b.*
    FROM order_specifications a
    JOIN products b ON a.productId = b.id
    WHERE a.orderId = ${orderId};
      `
);

module.exports = {
  selectOrdersWithoutStatusQuery,
  selectOrdersCountQuery,
  selectOrderSpecificationsQuery,
  selectPendingOrdersQuery,
  selectClosedOrdersQuery,
  selectPendingOrdersCountQuery,
  selectClosedOrdersCountQuery,
};
