#!/bin/sh
set -e

# MySQL container info
HOST="mysql"        # Container name of MySQL
USER="root"         # MySQL username
PASS="password"     # MySQL password

# Command to start Doctor Service
SERVICE_CMD="java -jar /app/visits-service.jar"

echo "Waiting for MySQL at $HOST..."

# Loop until MySQL responds
while ! mysql -h "$HOST" -u"$USER" -p"$PASS" -e "SELECT 1;" >/dev/null 2>&1; do
    echo "MySQL is not ready yet. Retrying in 2 seconds..."
    sleep 2
done

echo "MySQL is up! Starting Patient Service..."
exec $SERVICE_CMD
