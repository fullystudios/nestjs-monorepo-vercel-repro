#!/bin/bash
set -e

echo "Starting Keto setup..."

# Run migrations first
echo "Applying database migrations..."
/usr/bin/keto migrate up --yes --config /etc/config/keto.yml

# Start the Keto server
echo "Starting Keto server..."
exec /usr/bin/keto serve --config /etc/config/keto.yml
