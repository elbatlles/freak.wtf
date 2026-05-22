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

# Install git-crypt if not already available
if ! command -v git-crypt &>/dev/null; then
  echo "Installing git-crypt..."
  if command -v apt-get &>/dev/null; then
    # Ubuntu/Debian build environment (Vercel default)
    apt-get install -y git-crypt 2>&1 | tail -3
  else
    # Fallback: build from source using system OpenSSL
    echo "apt-get not available, building from source..."
    apt-get install -y libssl-dev make g++ 2>/dev/null || true
    git clone --depth 1 https://github.com/AGWA/git-crypt.git /tmp/git-crypt-src
    make -C /tmp/git-crypt-src ENABLE_MAN=0 PREFIX=/tmp/gc-install install
    export PATH="/tmp/gc-install/bin:$PATH"
  fi
fi

echo "Unlocking git-crypt..."
echo "$GIT_CRYPT_KEY" | base64 -d | git-crypt unlock -
echo "git-crypt unlocked successfully"
