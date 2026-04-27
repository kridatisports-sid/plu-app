#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-keystore.sh
# Run this ONCE on your local machine to create a signing keystore.
# Then upload the output values as GitHub Secrets.
# ─────────────────────────────────────────────────────────────────────────────

set -e

KEYSTORE_FILE="pawprint-release.jks"
KEY_ALIAS="pawprint-key"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║     PawPrint Release Keystore Generator              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Prompt for passwords
read -s -p "Enter keystore password (min 6 chars): " KS_PASS
echo ""
read -s -p "Confirm keystore password: " KS_PASS2
echo ""

if [ "$KS_PASS" != "$KS_PASS2" ]; then
  echo "❌ Passwords do not match. Exiting."
  exit 1
fi

read -s -p "Enter key password (can be same as keystore): " KEY_PASS
echo ""

# Generate keystore using keytool (comes with Java JDK)
echo ""
echo "Generating keystore..."
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE_FILE" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$KS_PASS" \
  -keypass "$KEY_PASS" \
  -dname "CN=PawPrint Registry, OU=Mobile, O=PawPrint, L=Mumbai, S=Maharashtra, C=IN"

echo ""
echo "✅ Keystore generated: $KEYSTORE_FILE"
echo ""

# Encode to base64
B64=$(base64 -w 0 "$KEYSTORE_FILE")

echo "══════════════════════════════════════════════════════"
echo "  Add these as GitHub Repository Secrets:"
echo "  (Settings → Secrets and variables → Actions → New secret)"
echo "══════════════════════════════════════════════════════"
echo ""
echo "Secret name:  KEYSTORE_BASE64"
echo "Secret value: $B64"
echo ""
echo "Secret name:  KEYSTORE_PASSWORD"
echo "Secret value: $KS_PASS"
echo ""
echo "Secret name:  KEY_ALIAS"
echo "Secret value: $KEY_ALIAS"
echo ""
echo "Secret name:  KEY_PASSWORD"
echo "Secret value: $KEY_PASS"
echo ""
echo "⚠️  IMPORTANT: Keep pawprint-release.jks safe!"
echo "   Add it to .gitignore — NEVER commit it to git."
echo "   If lost, you cannot update the app on Play Store."
