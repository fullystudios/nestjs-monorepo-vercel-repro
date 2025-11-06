#!/bin/bash
set -e

# Create keto database and user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE repo_keto_e2e;
    CREATE USER keto WITH PASSWORD 'keto_password';
    GRANT ALL PRIVILEGES ON DATABASE repo_keto_e2e TO keto;
EOSQL

# Connect to the keto database and grant schema permissions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "repo_keto_e2e" <<-EOSQL
    GRANT ALL ON SCHEMA public TO keto;
    GRANT CREATE ON SCHEMA public TO keto;
EOSQL

echo "Keto database and user created successfully"
