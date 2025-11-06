#!/bin/bash
set -e

host="$1"
port="$2"
shift 2

echo "Waiting for Keto to be ready at $host:$port..."

# Wait for Keto to be ready with a timeout
timeout=120  # 2 minutes timeout
counter=0

until curl -f -s "http://$host:$port/health/ready" > /dev/null; do
  >&2 echo "Keto is unavailable - sleeping (attempt $((counter+1)))"
  sleep 2
  counter=$((counter+1))
  
  if [ $counter -ge $((timeout/2)) ]; then
    >&2 echo "Timeout waiting for Keto to be ready"
    exit 1
  fi
done

>&2 echo "Keto is up - executing command"
# Execute the remaining arguments as a command
ENV=e2e-test "$@"
