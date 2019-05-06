const mysql = require('mysql');
const inquirer = require("inquirer");

let connection = mysql.createConnection({

	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'Redbird7821037*',
	database: 'bamazon_db'

});
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	inventory();
  });

//initial function to look at sql inventory database, loop through the data display all of the products
//in the console log.
function inventory() {

		//mysql query from node to select entire products table --> display product info on the console
		//based on index
		let customerTable = "Select * from products order by item_id asc";

		connection.query(customerTable, function(error, customerTableInfo) {

			if (error) throw error;

			for (let i = 0; i < customerTableInfo.length; i++) {

				console.log("\nProduct item ID: " + customerTableInfo[i].item_id + "\nProduct Name: " + customerTableInfo[i].product_name + "\nPrice: $" + customerTableInfo[i].price);

			};

			console.log("\n=======NEW PURCHASE=======\n");

			//Set up "customer" input using inquirer package to gather input info
			let initialItemId = customerTableInfo[0].item_id;
			let finalItemId = customerTableInfo[customerTableInfo.length-1].item_id;
			
			inquirer.prompt([

				{
					name: "item",
					type: "input",
					message: "Please type item_id of the product(s) you wish purchase: ",
					validate: function(number) {

			        	if(isNaN(number) === false) {

			        		if(number>=initialItemId && number<=finalItemId)

			        			return true
						};

			        	return false;
					}

				},
				{
					name: "quantity",
					type: "input",
					message: "Please type the quantity you wish to purchase: ",
					validate: function(quantity) {

			          return (!isNaN(parseInt(quantity)) && quantity>0 ) 
					}

				}

			]).then(function(purchase) {

				//check quantity needed to fulfill order is available in stock.  If yes complete
				//transaction and update database.  If not alert user.
				let chosenItem = customerTableInfo.find( element => {

					return element.item_id == purchase.item;	

				});

				var totalQty = chosenItem.stock_quantity;
				
				if (totalQty >= purchase.quantity) {

					totalQty -= parseInt(purchase.quantity);

					let subTotal = chosenItem.price * parseInt(purchase.quantity).toFixed(2);
					let orderPrice = chosenItem.product_sales + subTotal;

					//update stock_quantity and Product_Sales from products table.
					customerTable = `update products set stock_quantity = ${totalQty} , product_sales = ${orderPrice} where item_id = ${purchase.item} `;

					connection.query(customerTable, function(err, updateProductTable) {

						if (err) throw err;

						//display total price of the order in the console

						console.log("Total purchase price: $" + subTotal);
						console.log(updateProductTable);
						connection.end();

					});

				}	else {

					console.log("Product out of Stock or not enough on hand to fill order!");
					connection.end();

				};

			});

		});

};



