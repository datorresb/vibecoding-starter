#!/bin/bash
set -e

# Fix permissions for VS Code Copilot background agent worktrees
# Copilot creates worktrees at /workspaces/<repo>.worktrees/ which needs write access
sudo chmod 777 /workspaces/ 2>/dev/null || true

# Symlink worktrees folder into workspace for visibility in VS Code explorer
ln -sfn /workspaces/vibecoding-starter.worktrees /workspaces/vibecoding-starter/.worktrees 2>/dev/null || true

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

# Set up Python virtual environment with uv
echo "Setting up Python environment with uv..."
cd /workspaces/vibecoding-starter
if [ ! -d ".venv" ]; then
  uv venv
  echo "✅ Created .venv"
else
  echo "✅ .venv already exists"
fi
uv sync
echo "✅ Python dependencies synced"

# Check for bd (beads) task management CLI
if command -v bd &>/dev/null; then
  echo "✅ bd $(bd --version 2>/dev/null || echo '') available"
else
  echo "ℹ️  bd (beads) not installed — task management via AGENT_START.md setup"
  echo "   Install manually: curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash"
fi

echo "postCreate done"
