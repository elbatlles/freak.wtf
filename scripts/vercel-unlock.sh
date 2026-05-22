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
  echo "git-crypt not found — installing..."

  GIT_CRYPT_INSTALLED=false

  # Try each package manager in order (distro-agnostic)
  if command -v apt-get &>/dev/null && apt-get install -y --no-install-recommends git-crypt 2>/dev/null; then
    GIT_CRYPT_INSTALLED=true && echo "git-crypt installed via apt-get"
  elif command -v dnf &>/dev/null && dnf install -y git-crypt 2>/dev/null; then
    GIT_CRYPT_INSTALLED=true && echo "git-crypt installed via dnf"
  elif command -v yum &>/dev/null && yum install -y git-crypt 2>/dev/null; then
    GIT_CRYPT_INSTALLED=true && echo "git-crypt installed via yum"
  fi

  if [ "$GIT_CRYPT_INSTALLED" = false ]; then
    echo "No package manager installed git-crypt — building from source..."

    # Best-effort: install build dependencies via whatever package manager is present
    if command -v dnf &>/dev/null; then
      dnf install -y openssl-devel make gcc-c++ 2>/dev/null || true
    elif command -v yum &>/dev/null; then
      yum install -y openssl-devel make gcc-c++ 2>/dev/null || true
    elif command -v apt-get &>/dev/null; then
      apt-get install -y --no-install-recommends libssl-dev make g++ 2>/dev/null || true
    fi

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
