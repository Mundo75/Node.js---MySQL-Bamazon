DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

use	bamazon_db;

CREATE TABLE products (
		item_id INT(10) AUTO_INCREMENT NOT NULL,
        product_name VARCHAR(100),
        department_name VARCHAR(100),
        price FLOAT(10,2),
        stock_quantity INT(8),
        unique (product_name),
        PRIMARY KEY (item_id)
);



use bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES 	("iPads", "electronics", 200.00, 25),
			("Bluetooth Speeaker", "electonics", 75.00, 50),
            ("Disposible Camera", "electronics", 10.50, 75),
            ("Pen", "office_supplies", 1.50, 155),
            ("Envelopes", "office_supplies", 4.50, 50),
            ("Motor Oil", "automotive", 7.50, 100),
            ("Armorall", "automotive", 10.75, 80),
            ("Tent", "outdoors", 125.50, 15),
            ("Kanu", "outdoors", 250.00, 15),
            ("Juicer", "Appliances", 110.50, 15);
      
SELECT * FROM products;

            
            
