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
	supView();
  });

//Initial function --> gather user input using inquirer Node.js package and declare subsequent functions
//to be later defined as supervisor tasks
function supView() {

	inquirer.prompt([
		{
      type: "list",
     	message: "Please Choose a Supervisor Task?",
     	choices: ["View Sales Performance by Department", "Create New Sales Department"],
     	name: "sprOpr"
		}
	]).then(function(sprChoice) {

		switch (sprChoice.sprOpr) {

			case "View Sales Performance by Department":

				viewDepartments();

				break;

			case "Create New Sales Department":

				addNewDepartment();

				break;
		}

	});
};

//1st supervisor function --> view in the command line sales performance for all sales departments
function viewDepartments() {

	let supTable = `select a.*, sum(b.product_sales), (sum(b.product_sales) - a.over_head_costs) as total_profit 
      from departments as a 
      inner join products as b on a.department_name = b.department_name
			group by a.department_name 
			order by a.department_id; `;

		connection.query(supTable, function(error, departmentSalesInfo) {

			if (error) throw error;

			console.table('Profits:',departmentSalesInfo);
			connection.end();
		});
};

//2nd supervisor function --> set up function to add new sales department.  Necessary function to 
//to approve new products added by managers
function addNewDepartment() {

	inquirer.prompt([
		{
			name: "department",
      type: "input",
      message: "Please Type Department name:",
		},
		{
			name: "overhead",
      type: "input",
      message: "Please Enter over head cost:",
      validate: function(price) {

	          return (!isNaN(parseInt(price)) && price>0 ) 
          }
		}
	]).then(function(addDept) {

		let overHeadCost = parseInt(addDept.overhead).toFixed(2);
		let supTable = `insert into departments (department_name, over_head_costs)
				values ('${addDept.department}', ${overHeadCost}) `;

			connection.query(supTable, function(error, departmentAdded) {

				if (error) throw error;

				console.log("Added department" );
				console.log(departmentAdded);
				connection.end();
			});
	});
};