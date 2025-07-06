#!/bin/bash

# Install dependencies
npm ci

# Build the Angular application for production
npm run build:prod

echo "Build completed successfully!"
echo "Static files are in the 'dist' directory"
