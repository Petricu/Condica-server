#!/bin/bash
currentDate=$(date +%F_%H:%M:%S)
mysqldump --user=alex --password=laura condica > "db-backup/condica$currentDate.sql"
echo "Database backed up: $currentDate"