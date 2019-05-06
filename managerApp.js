const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

let connection = mysql.createConnection({

	host: "localhost",
	port: "3306",
	user: "root",
	password: "Redbird7821037*",
	database: "bamazon_db"
});
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	mgrProfile();
  });


//Initial function to set up user inputs using the inquirer package for Node.js and declare/define 
//subsequent functions to perform each manager task
function mgrProfile() {

	inquirer.prompt([
        {
            type: "list",
	      	message: "What would you like to do?",
	      	choices: ["View Products in Inventory", "View Items With Low Inventory", "Add to Inventory", "Add A New Product"],
            name: "managerOptions"
        }

	]).then(function(mgrTask) {

		switch (mgrTask.managerOptions) {

			case "View Products in Inventory":

				viewInventory();

				break;

			case "View Items With Low Inventory":

				viewLowInventory();

				break;

			case "Add to Inventory":

				addInventory();

				break;

			case "Add A New Product":

				addNewProduct();

				break;

		}
    });
};

//1st manager function --> set up function to view all inventory in the console.  
function viewInventory() {

	let mgrTable = "Select * from products order by item_id asc";

		connection.query(mgrTable, function(error, mgrTableInfo) {

			if (error) throw error;

			    console.table(mgrTableInfo);
				connection.end();

		});
};

//2nd Manager function --> set up function to view any inventory items with inventory less than 5
function viewLowInventory() {

		let mgrTable = `Select * from products where stock_quantity < 5 order by item_id asc`;

		connection.query(mgrTable, function(error, mgrTableInfo) {

			if (error) throw error;

			for (let i = 0; i < mgrTableInfo.length; i++) {

                
                console.log("\nProduct item ID: " + mgrTableInfo[i].item_id + "\nProduct Name: " + mgrTableInfo[i].product_name + "\nPrice ($): " + mgrTableInfo[i].price + "\nQuantity: " + mgrTableInfo[i].stock_quantity);
            };
			connection.end();

		});
};

//3rd Manager function --> set up function to add additional inventory via user input set up with
//inquirer Node.js package
function addInventory() {

    let mgrTable = "Select * from products order by item_id asc";

		connection.query(mgrTable, function(error, mgrTableInfo) {

			if (error) throw error;

			inquirer.prompt([
                {
                    name: "item",
			        type: "list",
			        message: "Enter the item_id to add quantity:",
			        choices: function() {

			            let choiceArray = [];

			            for (let i = 0; i < mgrTableInfo.length; i++) {

			              	choiceArray.push(mgrTableInfo[i].item_id.toString());

			            }
			            return choiceArray;

			        }
				},
				{
					name: "quantity",
			        type: "input",
			        message: "Enter quantity to add:",
			        validate: function(quantity) {

			          return (!isNaN(parseInt(quantity)) && quantity>0 ) 

			      	}
				}

			]).then(function(newStock) {

				let selectedItem = mgrTableInfo.find( element => {

					return element.item_id == newStock.item;	

				});

		        let quantity = selectedItem.stock_quantity + parseInt(newStock.quantity);

				mgrTable = `update products set stock_quantity = ${quantity} where item_id = ${selectedItem.item_id} `;

				connection.query(mgrTable, function(error, updatedInventory) {

					if (error) throw error;

					console.log(updatedInventory);

					connection.end();

				});

			}).catch(function (err) {

				 console.log(err);

			     console.log("Promise Rejected");

			});

		});
};

//4th manager function --> set up function for adding a new line item to the mySql products table
//from user input with inquirer package Node.js.

function addNewProduct() {

	inquirer.prompt([
    	{
        	name: "product",
	        type: "input",
	        message: "Please Type in the Product Name:",
		},
        {
			name: "department",
	        type: "input",
	        message: "Please Type in the Department name:",
		},
		{
			name: "price",
	        type: "input",
	        message: "Please Type in the Item Price:",
	        validate: function(price) {

	          return (!isNaN(parseInt(price)) && price>0 ) 

	      	}

		},

		{
			name: "quantity",
	        type: "input",
	        message: "Enter quantity:",
	        validate: function(quantity) {

	          return (!isNaN(parseInt(quantity)) && quantity>0 ) 
	      	}
		}
	]).then(function(addNewProduct) {

		let unitPrice = parseInt(addNewProduct.price).toFixed(2);

			mgrTable = `insert into products (product_name, department_name, price, stock_quantity)

				values ('${addNewProduct.product}', '${addNewProduct.department}', ${unitPrice}, ${parseInt(addNewProduct.quantity)} ) `;

			connection.query(mgrTable, function(error, updatedInventory) {

				if (error) throw error;

				console.log("Added product" );
                console.log(updatedInventory);

				mgrTable = `select department_name from departments `;

				connection.query(mgrTable, function(error, departmentName) {

					if (error) throw error;

					let newDept = departmentName.find( element => {

						return element.department_name == addNewProduct.department;	

					});

					if(newDept) {

						console.log("\nDepartment already exists in table");

					} else {

						mgrTable = `insert into departments (department_name, over_head_costs) 

							values ('${addNewProduct.department}', ${500.00}) `;

						connection.query(mgrTable, function(error, addDeptNames) {

							if (error) throw error;
							console.log("\nAdded department - ", addDeptNames);

						});
					}
					connection.end();

				});

			});

	});
};




