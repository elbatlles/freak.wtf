#!/usr/bin/env bash
# Unlocks git-crypt on Vercel using the GIT_CRYPT_KEY env var (base64-encoded symmetric key).
# Called automatically during Vercel builds via vercel.json buildCommand.
# Skipped silently if not running on Vercel or if the key is not set.

set -euo pipefail

# Only run on Vercel
if [ -z "${VERCEL:-}" ]; then
  echo "Not on Vercel — skipping git-crypt unlock"
  exit 0
fi

if [ -z "${GIT_CRYPT_KEY:-}" ]; then
  echo "GIT_CRYPT_KEY not set — skipping git-crypt unlock"
  exit 0
fi

# Download a pre-built git-crypt binary for Linux x86_64 if not already installed
if ! command -v git-crypt &>/dev/null; then
  echo "Installing git-crypt..."
  curl -fsSL \
    "https://github.com/AGWA/git-crypt/releases/download/0.7.0/git-crypt-0.7.0-linux-x86_64" \
    -o /tmp/git-crypt
  chmod +x /tmp/git-crypt
  export PATH="/tmp:$PATH"
fi

echo "Unlocking git-crypt..."
echo "$GIT_CRYPT_KEY" | base64 -d | git-crypt unlock -
echo "git-crypt unlocked successfully"
