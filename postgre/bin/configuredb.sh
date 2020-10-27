#!/bin/bash

database="saildb"

echo "Configuring database: $database"
dropdb -U sail_user saildb
createdb -U sail_user saildb

psql -U sail_user saildb < ./bin/sql/sail.sql

echo "Configured: $database"