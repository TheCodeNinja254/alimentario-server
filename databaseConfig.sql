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
    business_location VARCHAR(30) NULL,
    business_location_lat VARCHAR(30) NULL,
    business_location_long VARCHAR(30) NULL,
    business_type VARCHAR(30) NULL,
    status INT DEFAULT 1,
    primary_email_address VARCHAR(100) NULL,
    added_by VARCHAR(30) NOT NULL,
    updated_at VARCHAR(30) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(business_id),
    UNIQUE(business_name)
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


