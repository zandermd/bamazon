var inquirer = require('inquirer');
var mysql = require('mysql');
require("console.table")
var Table = require('cli-table');
require("console.table")


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'engel2279',
    database: 'bamazon'
});