#!/bin/bash
echo "Enter your MySQL root password:"
read -s password
sed -i '' "s/^DB_PASSWORD=.*/DB_PASSWORD=$password/" .env
echo "Password updated in .env file!"
