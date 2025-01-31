-- Changes leading upto mpesa
-- orders
alter table orders
    modify paymentId varchar(120) not null;

--     payments
-- Add 3 columns to what?

-- Changes from 9th of Jan

alter table products
    add vendor varchar(255) null;

alter table products
    add productFamily varchar(255) null;

alter table products
        add originCountry varchar(10) null;

alter table products
            add tag varchar(255) null;

alter table products
            add popularity int null;

alter table cart
        add orderType varchar(20) null;

alter table orders
            add isPreorder boolean null;

alter table orders
           add preferredDeliveryTime varchar(20) null;

-- add default location for rececourse event

-- Changes from 31st Jan - leading upto POS

alter table cart
    add guestId varchar(255) null comment 'Only applies to customers sold to via POS';

