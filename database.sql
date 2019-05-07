DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

use	bamazon_db;

CREATE TABLE products (
		item_id INT(10) AUTO_INCREMENT NOT NULL,
        product_name VARCHAR(100),
        department_name VARCHAR(100),
        price FLOAT(10,2),
        stock_quantity INT(8),
        UNIQUE (product_name),
        PRIMARY KEY (item_id)
);
alter table products auto_increment = 1000;


use bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES 	("iPads", "electronics", 200.00, 25),
			("Bluetooth Speeaker", "electronics", 75.00, 50),
            ("Disposible Camera", "electronics", 10.50, 75),
            ("Pen", "office_supplies", 1.50, 155),
            ("Envelopes", "office_supplies", 4.50, 50),
            ("Motor Oil", "automotive", 7.50, 100),
            ("Armorall", "automotive", 10.75, 80),
            ("Tent", "outdoors", 125.50, 15),
            ("Kanu", "outdoors", 250.00, 15),
            ("Juicer", "appliances", 110.50, 15);
            
ALTER TABLE products ADD product_sales FLOAT(10,2);
ALTER TABLE products ALTER product_sales SET DEFAULT 0.00;
            
CREATE TABLE departments (
	department_id INT(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50),
    over_head_costs INT(10),
    UNIQUE (department_name),
    PRIMARY KEY (department_id)
);

ALTER TABLE departments AUTO_INCREMENT = 100;

INSERT INTO departments (department_name) SELECT DISTINCT(department_name) FROM products;

ALTER TABLE departments MODIFY COLUMN over_head_costs FLOAT(10,2);

UPDATE products SET product_sales = 0.00;
UPDATE products SET stock_quantity = 12 where item_id = 1006;
UPDATE departments SET over_head_costs = 620 WHERE department_id = 101;
UPDATE departments SET over_head_costs = 1200 WHERE department_id = 100;
UPDATE departments SET over_head_costs = 430 WHERE department_id = 102;
UPDATE departments SET over_head_costs = 900 WHERE department_id = 103;
UPDATE departments SET over_head_costs = 810 WHERE department_id = 104;

SELECT * FROM products;
SELECT * FROM departments;



            
            
