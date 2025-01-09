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

alter table cart
                add orderType varchar(20) null;


