#!/bin/bash
set -e

# Configure GitHub credentials if provided
if [ -n "${GITHUB_USER:-}" ] && [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "Configuring GitHub credentials..."
  printf 'https://%s:%s@github.com\n' "$GITHUB_USER" "$GITHUB_TOKEN" >> "$HOME/.git-credentials"
  chmod 600 "$HOME/.git-credentials" || true
  git config --global credential.helper store
  git config --global credential.useHttpPath true

  # Configure Git user name and email if provided
  if [ -n "${GIT_USER_NAME:-}" ]; then
    git config --global user.name  "${GIT_USER_NAME}"
  fi
  if [ -n "${GIT_USER_EMAIL:-}" ]; then
    git config --global user.email  "${GIT_USER_EMAIL}"
  fi
fi

# Install Azure CLI (optional)
if [ "${INSTALL_AZURE_CLI:-false}" = "true" ]; then
  echo "Installing Azure CLI..."
  curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash || echo "Azure CLI installation failed (non-blocking)"
else
  echo "Skipping Azure CLI (set INSTALL_AZURE_CLI=true to enable)"
fi

echo "postCreate done"
