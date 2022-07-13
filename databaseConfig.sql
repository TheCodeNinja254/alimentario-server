CREATE TABLE IF NOT EXISTS tbl_users
(
	user_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    password VARCHAR(30) NULL,
    msisdn VARCHAR(30) NULL,
    user_role VARCHAR(30) NOT NULL,
    status INT NOT NULL DEFAULT 1,
    email_address VARCHAR(100) NULL,
    verification_token VARCHAR(100) NULL,
    verification_status INT NOT NULL,
    verification_time TIMESTAMP NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id),
    UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS tbl_customers (
    customer_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    password VARCHAR(30) NULL,
    msisdn VARCHAR(30) NULL,
    status INT DEFAULT 1,
    business_id INT NULL,
    email_address VARCHAR(100) NULL,
    verification_token VARCHAR(100) NULL,
    verification_status INT NOT NULL,
    verification_time TIMESTAMP NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(customer_id),
    UNIQUE(username),
    CONSTRAINT fk_tbl_wholesale_businesses
    FOREIGN KEY(business_id) REFERENCES tbl_wholesale_businesses(business_id)
);


CREATE TABLE IF NOT EXISTS tbl_wholesale_businesses (
    business_id INT AUTO_INCREMENT,
    business_name VARCHAR(255) NOT NULL,
    registered_address VARCHAR(255) NULL,
    business_location_lat VARCHAR(30) NULL,
    business_location_long VARCHAR(30) NULL,
    business_type VARCHAR(30) NULL,
    registration_number VARCHAR(255) NOT NULL,
    registration_certificate_uri VARCHAR(255) NULL,
    cr12_upload_uri VARCHAR(255) NULL,
    business_status INT DEFAULT 1,
    primary_email_address VARCHAR(100) NULL,
    primary_contact VARCHAR(255) NOT NULL,
    business_website VARCHAR(255) NULL,
    kra_pin VARCHAR(30) NULL,
    kra_pin_upload_uri VARCHAR(255) NULL,
    current_business_permit_uri VARCHAR(255) NULL,
    preferred_credit_period VARCHAR(30) NULL,
    added_by VARCHAR(30) NOT NULL,
    updated_at VARCHAR(30) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(business_id),
    UNIQUE(business_name)
);

CREATE TABLE IF NOT EXISTS tbl_bs_shareholders_directors (
    id INT AUTO_INCREMENT,
    business_id INT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    member_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_business_id
    FOREIGN KEY(business_id) REFERENCES tbl_wholesale_businesses(business_id)
);

CREATE TABLE IF NOT EXISTS tbl_business_contact_persons (
    id INT AUTO_INCREMENT,
    business_id INT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    msisdn VARCHAR(30) NULL,
    email_address VARCHAR(255) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_business_id_for_contacts
    FOREIGN KEY(business_id) REFERENCES tbl_wholesale_businesses(business_id)
);

CREATE TABLE IF NOT EXISTS tbl_products
(
	product_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    product_description VARCHAR(255) NULL,
    product_pic_main VARCHAR(50) NULL,
    product_pic_2 VARCHAR(50) NULL,
    product_pic_3 VARCHAR(50) NULL,
    product_pic_4 VARCHAR(50) NULL,
    product_unit_of_measure VARCHAR(50) NOT NULL,
    product_instructions_link VARCHAR(255) NULL,
    product_video_link VARCHAR(255) NULL,
    stock_status INT NOT NULL,
    product_status INT NOT NULL,
    expiry_date TIMESTAMP NULL,
    product_storage_facility_id INT NOT NULL,
    added_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(product_id),
    UNIQUE(product_name),
    CONSTRAINT fk_tbl_storage_facilities
    FOREIGN KEY(product_storage_facility_id) REFERENCES tbl_storage_facilities(facility_id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_facilities
(
	facility_id INT AUTO_INCREMENT,
    facility_name VARCHAR(255) NOT NULL,
    facility_location VARCHAR(255) NULL,
    facility_location_lat VARCHAR(50) NULL,
    facility_location_long VARCHAR(50) NULL,
    facility_type VARCHAR(50) NULL,
    facility_manned_by VARCHAR(50) NULL,
    facility_opening_time VARCHAR(255) NULL,
    facility_closure_time VARCHAR(255) NULL,
    facility_capacity INT NOT NULL,
    facility_current_status TIMESTAMP NULL,
    added_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(facility_id),
    UNIQUE(facility_name)
);

CREATE TABLE IF NOT EXISTS tbl_gallery_photos
(
	photo_id INT AUTO_INCREMENT,
    photo_uri VARCHAR(255) NOT NULL,
    photo_description VARCHAR(255) NULL,
    photo_name VARCHAR(255) NULL,
    photo_preferred_location VARCHAR(50) NULL,
    photo_tag VARCHAR(50) NULL,
    photo_by VARCHAR(50) NULL,
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(photo_id),
    UNIQUE(photo_uri)
);

CREATE TABLE IF NOT EXISTS tbl_orders
(
	order_id INT AUTO_INCREMENT,
    payment_id VARCHAR(255) NULL,
    amount_due INT NOT NULL,
    delivery_preference VARCHAR(50) NULL,
    delivery_location VARCHAR(50) NULL,
    delivery_precise_location VARCHAR(50) NULL,
    additional_delivery_notes VARCHAR(255) NULL,
    alternative_msisdn VARCHAR(50) NULL,
    order_status VARCHAR(50) DEFAULT 'NEW',
    order_type VARCHAR(50) DEFAULT 'Retail',
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(order_id)
);

CREATE TABLE IF NOT EXISTS tbl_standing_orders
(
	standing_order_id INT AUTO_INCREMENT,
    payment_id VARCHAR(255) NULL,
    amount_due INT NOT NULL,
    delivery_preference VARCHAR(50) NULL,
    delivery_location VARCHAR(50) NULL,
    delivery_precise_location VARCHAR(50) NULL,
    additional_delivery_notes VARCHAR(255) NULL,
    alternative_msisdn VARCHAR(50) NULL,
    order_commencement_date VARCHAR(50) NOT NULL,
    order_cycle VARCHAR(255) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'NEW',
    order_type VARCHAR(50) DEFAULT 'Wholesale',
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(standing_order_id)
);

CREATE TABLE IF NOT EXISTS tbl_payments
(
	payment_id INT AUTO_INCREMENT,
    payment_method VARCHAR(255) NULL,
    amount_paid INT NOT NULL,
    order_id INT NOT NULL,
    transaction_id INT NOT NULL,
    order_type VARCHAR(50) NOT NULL,
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(payment_id),
    CONSTRAINT fk_transaction_id
    FOREIGN KEY(transaction_id) REFERENCES tbl_transactions(transaction_id)
);

CREATE TABLE IF NOT EXISTS tbl_transactions
(
	transaction_id INT AUTO_INCREMENT,
	transaction_originator_id VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(255) NULL,
    amount_paid INT NOT NULL,
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(transaction_id),
    UNIQUE(transaction_originator_id)
);

CREATE TABLE IF NOT EXISTS tbl_order_specification
(
	order_specification_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_qty INT NULL,
    order_specification INT NULL,
    added_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(order_specification_id),
    CONSTRAINT fk_tbl_order_id
    FOREIGN KEY(order_id) REFERENCES tbl_orders(order_id),
    CONSTRAINT fk_product_id
    FOREIGN KEY(product_id) REFERENCES tbl_products(product_id)
);
