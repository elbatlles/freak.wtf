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
  if apt-get install -y --no-install-recommends git-crypt 2>&1; then
    echo "git-crypt installed via apt-get"
  else
    # Fallback: build from source using system OpenSSL
    echo "apt-get failed, building git-crypt from source..."
    apt-get install -y --no-install-recommends libssl-dev make g++ 2>&1
    git clone --depth 1 https://github.com/AGWA/git-crypt.git /tmp/git-crypt-src
    make -C /tmp/git-crypt-src ENABLE_MAN=0 PREFIX=/tmp/gc-install install
    export PATH="/tmp/gc-install/bin:$PATH"
  fi
fi

# git-crypt refuses to unlock with a dirty working tree.
# Vercel's install step (pnpm install) can modify tracked files before buildCommand runs.
echo "Resetting working directory before git-crypt unlock..."
git reset --hard HEAD

echo "Unlocking git-crypt..."
echo "$GIT_CRYPT_KEY" | base64 -d | git-crypt unlock -
echo "git-crypt unlocked successfully"
