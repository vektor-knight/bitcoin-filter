
/* **Goal**: Process transactions and filter them for valid deposits. */

const db = require('./functions/db');
const f = require('./functions/engine');

// Step 0.0.0: Transaction Loading -
 // Unix shell scripting can be used to load in
 // a set of txs_x.json in a flat directory.
 // Since there was only one transaction set, a simple require
 // is good enough
const transactionSet = require('./transactions/txs.json');

// Step 1.0.0: Read all transactions from `txs.json`
 // NOTE: Slight semantic deviation from the specifications.
 // We can save on database storage performance by preprocessing
 // JSON data for the chosen search space on the client-side first.
var txStack = f.stack(f.filter(transactionSet));

// Step 1.0.1: Establish singleton, persistent connection
// to the database. MySQL ensures that the connection always
// 'stays alive.' More notes are included in ~/functions/db.js,
// with remarks about extensibility, pooling, master/slave replication.
db.connect();
db.query("USE krakendb;");

// Step 1.0.2: Store all valid deposits into the database
for (var i = 0; i < txStack.length; i++) {
  var query = db.query("INSERT IGNORE deposit (address, amount, confirmations, txID) VALUES ('" + txStack[i].address + "', '" + txStack[i].amount + "', '" + txStack[i].confirmations + "', '" + txStack[i].txid  + "');", function (err, result) {
  if (err) throw err; // Use native error logging. There is no difference in calling an instance of the error-stack, versus an abstract one; Javascript uses natural language, in any case.
  });
}

// Step 2.0.0: (Lines 1 to 7) Read deposits from the database that are good to credit to users
  // Unfortunate Heuristic: https://stackoverflow.com/questions/4610024/sql-looping-with-distinct-names
  // Furthermore, row-order is non-deterministic. There is no guarantee that MySQL is storing the data
  // in the order we want. Hence, an array called 'customers' is iterated over.
  // This also mitigates a problem on the server-side: https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html
var customers = ["Wesley Crusher", "Leonard McCoy", "Jonathan Archer", "Jadzia Dax", "Montgomery Scott", "James T. Kirk", "Spock"];
console.log("```");
for (var i = 0; i < customers.length; i++) {
  var data = db.query("SELECT name, count(amount) AS count, sum(amount) AS sum FROM deposit JOIN (customer) ON (customer.address = deposit.address) WHERE customer.name = '" + customers[i] + "';", function(err, result) {
    if (err) throw err;
    console.log("Deposited for " + JSON.stringify(result[0].name).replace(/\"/g, "") + ":" + ' ' +  "count="+JSON.stringify(result[0].count) + ' ' + "sum="+parseFloat(JSON.stringify(result[0].sum)).toFixed(8));
  });
}

// Step 2.0.1: (Line 8) Deposits without `name` references. No need for iteration here; the operation is deterministic.
var noNames = db.query("SELECT count(amount) AS count, sum(amount) AS sum FROM deposit LEFT OUTER JOIN (customer) ON (deposit.address = customer.address) WHERE customer.name IS NULL GROUP BY deposit.amount;", function(err, result) {
  if (err) throw err;
  console.log("Deposited without reference: " + "count="+JSON.stringify(result[0].count) + ' ' + "sum="+parseFloat(JSON.stringify(result[0].sum)).toFixed(8));
});

// Step 2.0.2: (Lines 9 and 10) Minimum and maximum deposits. No need for iteration here; the operations are deterministic.
var min = db.query("SELECT min(amount) AS sum FROM deposit;", function(err, result) {
  if (err) throw err;
  console.log("Smallest valid deposit: " + parseFloat(JSON.stringify(result[0].sum)).toFixed(8));
});

var max = db.query("SELECT max(amount) AS sum FROM deposit;", function(err, result) {
  if (err) throw err;
  console.log("Largest valid deposit: " + parseFloat(JSON.stringify(result[0].sum)).toFixed(8));
  console.log("```"); // Ensure that the escape sequence exists at the end of a callback
});

// No need to close the connection. Assume that the client/server connection should persist, pending
  // new query sets to the server.
