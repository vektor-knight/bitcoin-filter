/* The filtering engine uses as many Javascript natives as possible. While many
Dockerized micro-services out in the wild use libraries such as body-parser, fs, etc.,
this leaves a massive vulnerability in the number of attack vectors available in
`node_modules` in the application container. A significant amount of time was spent
hacking these libraries out, and opting instead for completely native Javascript code.
Documentation snippets have been added below. */

var exports = module.exports = {};

// Implementation of the library replacer function to specify filters
  // on key/value pairs in the original bitcoind transaction set.
  // Note well that while the search-space and filter conditions
  // *can* be abstracted out, there is a performance gain when using
  // sentinel values.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
exports.replace = function replacer(key, value) {
  var searchSpace = ["category", "confirmations", "amount"]; // use as sentinels
  var filterOut = ["send", "orphan", "immature", "move"];

    for (var i = 0; i < filterOut.length; i++) {
      // None of these constitute deposits
      if (key == searchSpace[0] & value == filterOut[i]) {
        return undefined
      }
      // only return valid deposits... where confirmations >= 6
      if (key == searchSpace[1] & value < 6) {
        return undefined
      }
      // catch transactions with no label "category". btc <= 0 <=> not-deposit
      if (key == searchSpace[2] & value <= 0) {
        return undefined
      }
    return value;
  }
}

// Nested sub-sequence of the replacer function,
 // now being used to parse, filter, and stringify
 // an arbitrary transaction set x from bitcoind.
exports.filter = function filterJSON(x) {
  return JSON.parse(JSON.stringify(x, exports.replace));
}

// Stack the results in a format readable by an arbitrary
 // query language. Once again, sentinels are used to push
 // results containing *only* the defined selection criteria.
exports.stack = function stackify(x) {
  var arr = [];
  for (var key in x) {
    if (key == "transactions")
      for (var i = 0; i < x.transactions.length; i++) {
        if (x.transactions[i].hasOwnProperty("confirmations") & x.transactions[i].hasOwnProperty("amount")) {
          arr.push(x.transactions[i])
        }
      }
  }
  return arr;
}
