#!/bin/bash

# Generate Android Keystore for Release Signing
# Run this script once to create your release keystore

echo "======================================"
echo "Android Keystore Generator"
echo "======================================"
echo ""

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ Error: keytool not found!"
    echo "Please install Java JDK first."
    exit 1
fi

# Configuration
KEYSTORE_NAME="upload-keystore.jks"
KEY_ALIAS="upload"
VALIDITY_DAYS=10000

echo "This will create a new keystore: $KEYSTORE_NAME"
echo "Key alias: $KEY_ALIAS"
echo "Validity: $VALIDITY_DAYS days (~27 years)"
echo ""

# Check if keystore already exists
if [ -f "$KEYSTORE_NAME" ]; then
    echo "⚠️  Warning: $KEYSTORE_NAME already exists!"
    read -p "Do you want to overwrite it? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    rm "$KEYSTORE_NAME"
fi

echo ""
echo "Please provide the following information:"
echo "Note: Remember these passwords! You'll need them for signing."
echo ""

# Generate keystore
keytool -genkey -v \
    -keystore $KEYSTORE_NAME \
    -alias $KEY_ALIAS \
    -keyalg RSA \
    -keysize 2048 \
    -validity $VALIDITY_DAYS

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore created successfully!"
    echo ""
    echo "📄 Created file: $KEYSTORE_NAME"
    echo ""
    echo "⚠️  IMPORTANT NOTES:"
    echo "1. Keep this keystore file safe and secure"
    echo "2. NEVER commit it to Git"
    echo "3. Make a backup in a secure location"
    echo "4. You'll lose the ability to update your app if you lose this file"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy key.properties.example to key.properties"
    echo "2. Edit key.properties with your keystore information"
    echo "3. Keep key.properties private (it's in .gitignore)"
    echo ""
    echo "Example key.properties content:"
    echo "storePassword=YOUR_KEYSTORE_PASSWORD"
    echo "keyPassword=YOUR_KEY_PASSWORD"
    echo "keyAlias=$KEY_ALIAS"
    echo "storeFile=../$KEYSTORE_NAME"
    echo ""
else
    echo "❌ Error creating keystore"
    exit 1
fi
