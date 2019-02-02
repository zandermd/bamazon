var inquirer = require('inquirer');
var mysql = require('mysql');
// require("console.table")
var Table = require('cli-table');
//cli table gives us a format for node that displays the table 


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'engel2279',
    database: 'bamazon'
});
//connection to the db


const displayTable = () => {
    let query = 'SELECT * FROM products';
    connection.query(query, (error, data) => {
        if (error) throw error;
        console.table(data);
        buyerID();
        
        //taking product table to display

    })
};

const buyerID = () => {
    inquirer.prompt([{
        name: 'item_id',
        type: 'input',
        message: 'What is your item number?'
    }, {
        name: "units",
        type: "input",
        message: "How many units would you like?"
    }]).then(function (answers) {
        // answers = {item_id: 2, units: 7}
        // console.log('answers', answers)
        let input = answers.item_id
        let unitAmount = parseInt(answers.units)
        let query = 'SELECT product_name, price, stock_quantity FROM products WHERE item_id=?';
        connection.query(query, [input], (error, data) => {
            if (error) {
                throw error;
            } else {
                // unitAmount <= stockQuantity
                // console.log('Insufficent Quantity!')
                if (data.length == 0) {
                    console.log('There is no product found for this ID')
                    return; // if i don't have my return, then it will continue down to the function
                }
                let stockQuantity = data[0].stock_quantity; //[0] when you call the library, it returns an array of "stuff"
                if (unitAmount > stockQuantity) {
                    // console.log('stockQuantity', stockQuantity)
                    // console.log('unitAmount', unitAmount)
                    console.log('Insufficent Quantity!');
                } else {
                    let newQuantity = stockQuantity - unitAmount
                    let totalPrice = data[0].price * unitAmount
                    // console.log('newQuantity', newQuantity)
                    // console.log('stockQuantity', stockQuantity)
                    // console.log('unitAmount', unitAmount)
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: input
                            }
                        ],

                        function (err, res) {
                            if (error) {
                                throw error;
                            } else {
                                console.log("$" + totalPrice);
                                displayTable();
                                // return;
                            }
                            
                        }
                    )
                }
            }


        });
    });
}
displayTable();


// User gets shown products (sql query)
// User gets asked which product they want to purchase (inquirer)
// User gets asked how many items they want for the product
// Lookup the product in the system
// Check to see if product has enough inventory
// If not tell user you don't have enough
// Otherwise calculate new inventory and calculate total price of order
// Update inventory in system
// Show user the total price of their order
// Repeat