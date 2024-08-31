#!/bin/bash

echo "Starting server..."
cd server && npm start &
echo "Starting client..."
cd client && npm start &