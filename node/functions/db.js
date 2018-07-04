/* Client/Server database connector. While many micro-services out in the wild
use a RESTful set of interfaces, the mysql library from NPM provisions persistent
connections between the client layer and the server layer. In this case, environmental
variables created by each micro-service (e.g. the {database, node} Docker containers)
are used to abstract out secret details. For demonstration purposes, secret data
has been included in this connector to demonstrate the symbolic link between
environmental variables and the database details used in the connection.

Once again, great time was invested in hacking out RESTful libraries, such as
Express, Morgan, and others. The next logical solution would be to use
experimental API's such as the MySQL Dev X API/MySQL 8.x, which completely
abstract out any details about the server-side inside of client code by provisioning a direct
interface on the server-side using MySQL Shell Scripting (e.g. mysql-js>)
Read the following brief from an Oracle staffer about MySQL 8.x maturity:
http://datacharmer.blogspot.com.co/2018/02/the-confusing-strategy-for-mysql-shell.html

Using GoLang, it is also possible to bind client-side {JS, Py, ...} code in a clusterized
environment, a la InnoDB Cluster, Kubernetes, or Docker Swarm etc. While query
speed is nearly instantaneous, a great majority of time was spent experimenting
with these frameworks trying to build new bindings. Once again, a question of maturity. */

// Below, I have provided several notes for extensibility, and why I have opted
 // for a singleton client/server model, as opposed to connection pooling or clusterized
 // computing environments, as above:
 // 0.0: The specifications demanded a deterministic, linear chain of query sets.
 // 0.1: Lazy evaluation in a connection pool, while useful, does not mitigate or
 // implicate itself in  query optimization on the client-side itself.
 // 1.1: For two-way communication (e.g. the database layer is communicating
 // or routing to the blockchain), I would *then* consider extending
 // this connector to a pool using master/slave replication. In that case,
 // each new slave can exist within a pool-of-pools, using different
 // filtering criteria across each one.
 // Proposed Frameworks: MySQL Router, InnoDB Cluster

'use strict';

const mysql = require('mysql');

var db = mysql.createConnection({
  host     : process.env.DB_HOST || 'krakendb',
  port     : process.env.DB_PORT || '3306',
  user     : process.env.DB_USER || 'krakenAdmin',
  password : process.env.DB_PASS || 'kraken',
});

module.exports = db;
