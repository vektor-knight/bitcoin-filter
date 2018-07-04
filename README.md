# bitcoin-filter
Filter and deposit valid BitcoinD transactions

README

* Tested and written on an amd64 Linux image. Hence, to run:
 $ docker-compose up

  * Ctrl+C to exit in the terminal (connection is kept alive)

* TODO + Notes for the Developers:
I have included a brief for the development staff/examiners.
A lot of these notes are considerations for version n+1, which
were not considered for the scope of this test for sanity's sake,
and also that much of these frameworks are on the bleeding edge of testing.
Please read my suggestions/notes in the /node micro-service directory,
specifically /functions/db.js

 0. Find a more elegant solution to "wait.sh". There are several
 remarks inside of the node micro-service layer which propose a 
 switch to a parallel computing engine, which would use real-time
 pings to make sure that the database container is available.

 Several proposals have been posited on GitHub, but this is an
 exercise in time investment with respect to testing shell scripts,
 rather than one of discovery in efficiency.

 Nevertheless, my host machine is a bit dated, so a 60 second timeout
 is probably excessive. I have attached a results photo, and plaintext
 below, just in case:

Creating t5_db_1 ... done
Creating t5_client_1 ... done
Attaching to t5_db_1, t5_client_1
db_1      | [Entrypoint] MySQL Docker Image 5.7.22-1.1.5
db_1      | [Entrypoint] Initializing database
client_1  | wait.sh: waiting 60 seconds for mysql:3306
db_1      | [Entrypoint] Database initialized
db_1      | Warning: Unable to load '/usr/share/zoneinfo/iso3166.tab' as time zone. Skipping it.
db_1      | Warning: Unable to load '/usr/share/zoneinfo/leapseconds' as time zone. Skipping it.
db_1      | Warning: Unable to load '/usr/share/zoneinfo/tzdata.zi' as time zone. Skipping it.
db_1      | Warning: Unable to load '/usr/share/zoneinfo/zone.tab' as time zone. Skipping it.
db_1      | Warning: Unable to load '/usr/share/zoneinfo/zone1970.tab' as time zone. Skipping it.
db_1      | 
db_1      | [Entrypoint] running /docker-entrypoint-initdb.d/db.sql
db_1      | 
db_1      | 
db_1      | [Entrypoint] Server shut down
db_1      | 
db_1      | [Entrypoint] MySQL init process done. Ready for start up.
db_1      | 
db_1      | [Entrypoint] Starting MySQL 5.7.22-1.1.5
client_1  | wait.sh: timeout occurred after waiting 60 seconds for mysql:3306
client_1  | 
client_1  | > kraken_test@1.5.3 start /
client_1  | > node main.js
client_1  | 
client_1  | ```
client_1  | Deposited for Wesley Crusher: count=35 sum=225.00000000
client_1  | Deposited for Leonard McCoy: count=23 sum=108.00000000
client_1  | Deposited for Jonathan Archer: count=22 sum=100.84000003
client_1  | Deposited for Jadzia Dax: count=12 sum=72.30999994
client_1  | Deposited for Montgomery Scott: count=20 sum=97.51999980
client_1  | Deposited for James T. Kirk: count=22 sum=1075.19629808
client_1  | Deposited for Spock: count=19 sum=667.59786807
client_1  | Deposited without reference: count=1 sum=14.18259621
client_1  | Smallest valid deposit: 0.00000010
client_1  | Largest valid deposit: 98.98617554
client_1  | ```

 1. Abstract out MySQL connector details using Dev API X/MySQL 8.x.
 Almost all client-side scripting can be written using Shell. Remarks
 about maturity have been included in the node micro-service layer.

 Specifically, *.env files can be provisioned into the top-level.

 2. We can achieve a ~175 MB reduction in total image size by using
 DataCharmer's MySQL Image, and MHart's Alpine-Node image. However,
 I have elected for official images for the following reasons:

   2.0: MHart himself has suggested using official images due to
   security concerns. 

   2.1: Several details are missing from these
   images, such as essential MySQL natives from DataCharmer.
   Once again, this became an exercise in time investment
   as opposed to functionality. However, for the next version, 
   using unofficial images is completely feasible with a 
   little bit more tweaking.

  3. The database schema is only pseudo-1NF. While the relations
  'deposit' and 'customer' can be joined about their addresses
  as keys, there is no guarantee of uniqueness with regard to client
  names and so on - at least one relation will fail a normalization test.

  We must consider the case where a client can have multiple addresses.
