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

const selectOrdersWithoutStatusQueryAdminView = (pageSize) => (`
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
       b.alternativePhoneNumber,
       cust.firstName, 
       cust.lastName,
       cust.username,
       cust.emailAddress,
       cust.msisdn
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
        JOIN customers cust ON a.addedBy = cust.username
    WHERE a.orderType = 'Retail'
    GROUP BY a.id
    ORDER BY a.id DESC
    LIMIT ${pageSize};
    `);

const selectAllOrdersWithoutStatusQuery = (pageSize, isPreorder) => (`
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
       f.firstName,
       f.lastName,
       f.msisdn,
       f.emailAddress,
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
        JOIN customers f on a.addedBy = f.username
    WHERE a.orderType = 'Retail' AND AND a.isPreorder = ${isPreorder}
    GROUP BY a.id
    ORDER BY a.id DESC
    LIMIT ${pageSize};
    `);

const selectAllOrdersWithSearch = (searchTerm) => (`
      SELECT 
    a.id AS orderId,
    a.paymentId,
    a.amountDue,
    a.deliveryLocationId,
    a.orderStatus,
    a.orderType,
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
    f.firstName,
    f.lastName,
    f.msisdn,
    f.emailAddress,
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
    JOIN customers f ON a.addedBy = f.username
WHERE a.orderType = 'Retail'
  AND (
    LOWER(f.firstName) LIKE CONCAT('%', LOWER('${searchTerm}'), '%') OR 
    LOWER(f.lastName) LIKE CONCAT('%', LOWER('${searchTerm}'), '%')
)
GROUP BY a.id
ORDER BY a.id DESC;
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

const selectPendingOrdersQueryAdminView = (pageSize) => (`
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
       b.alternativePhoneNumber,
       cust.firstName, 
       cust.lastName,
       cust.username,
       cust.emailAddress,
       cust.msisdn
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
        JOIN customers cust ON a.addedBy = cust.username
    WHERE a.orderType = 'Retail'
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

const selectAllPendingOrdersQuery = (pageSize, isPreorder) => (`
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
       f.firstName,
       f.lastName,
       f.msisdn,
       f.emailAddress,
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
        JOIN customers f ON a.addedBy = f.username
    WHERE a.orderType = 'Retail'
    AND a.orderStatus in (
    'New',
    'Pending',
    'Enroute',
    'Preparation',
    'Delayed'
    )
    AND a.isPreorder = ${isPreorder}
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

const selectClosedOrdersQueryAdminView = (pageSize) => (`
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
       cust.firstName, 
       cust.lastName,
       cust.username,
       cust.emailAddress,
       cust.msisdn
    FROM orders a
        JOIN delivery_locations b ON a.deliveryLocationId = b.id
        JOIN countries c ON b.countryId = c.id
        JOIN counties d ON b.countyId = d.id
        JOIN locales e ON b.localeId = e.id
        JOIN customers cust ON a.addedBy = cust.username
    WHERE a.orderType = 'Retail'
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

const selectAllClosedOrdersQuery = (pageSize, isPreorder) => (`
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
       f.firstName,
       f.lastName,
       f.msisdn,
       f.emailAddress,
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
        JOIN customers f ON a.addedBy = f.username
    WHERE a.orderType = 'Retail'
    AND a.orderStatus not in (
    'New',
    'Pending',
    'Enroute',
    'Preparation',
    'Delayed'
    )
  AND a.isPreorder = ${isPreorder}
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

const selectAllOrdersCountQuery = (isPreorder) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE orderType = 'Retail' AND isPreorder = ${isPreorder};
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

const selectOrdersCountQueryAdminView = () => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE orderType = 'Retail'
      AND orderStatus  in (
        'New',
        'Pending',
        'Enroute',
        'Preparation',
        'Delayed'
    );
    `);

const selectAllPendingOrdersCountQuery = (isPreorder) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE orderType = 'Retail'
      AND isPreorder = ${isPreorder}
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

const selectClosedOrdersCountQueryAdminView = () => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE orderType = 'Retail'
      AND orderStatus not in (
        'New',
        'Pending',
        'Enroute',
        'Preparation',
        'Delayed'
    );
    `);

const selectAllClosedOrdersCountQuery = (isPreorder) => (`
      SELECT count(id) as orderCount
      FROM orders
      WHERE orderType = 'Retail'
      AND isPreorder = ${isPreorder}
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
  selectAllPendingOrdersQuery,
  selectAllOrdersWithoutStatusQuery,
  selectAllClosedOrdersQuery,
  selectAllPendingOrdersCountQuery,
  selectAllClosedOrdersCountQuery,
  selectAllOrdersCountQuery,
  selectOrdersCountQueryAdminView,
  selectClosedOrdersCountQueryAdminView,
  selectPendingOrdersQueryAdminView,
  selectClosedOrdersQueryAdminView,
  selectOrdersWithoutStatusQueryAdminView,
  selectAllOrdersWithSearch,
};
