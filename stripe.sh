#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found."
    exit 1
fi

# Load variables from .env file
set -o allexport
source .env
set +o allexport

# Check if NEXT_PUBLIC_STORE_ID is set
if [ -z "$NEXT_PUBLIC_STORE_ID" ]; then
    echo "Error: NEXT_PUBLIC_STORE_ID is not set in .env file."
    exit 1
fi

# Check if NEXT_PUBLIC_URL is set
if [ -z "$NEXT_PUBLIC_URL" ]; then
    echo "Error: NEXT_PUBLIC_URL is not set in .env file."
    exit 1
fi


WEBHOOK_URL="$NEXT_PUBLIC_URL:3000/api/stores/$NEXT_PUBLIC_STORE_ID/webhooks"

stripe listen --forward-to="$WEBHOOK_URL"
