# Copilot Instructions

## NEVER make destructive changes without explicit user approval

Before running ANY command that deletes, overwrites, or reinitializes data (rm -rf, drop, reset, init --force, etc.):

1. **STOP** and describe exactly what will be lost
2. **ASK** for explicit confirmation
3. **Only proceed** after the user says yes

This applies especially to: databases, .beads/, .git/, config files, and any user-created data.

No exceptions. No shortcuts. Ask first.

## Python: Always use uv + workspace venv

All Python work MUST use the workspace virtual environment (`.venv/`) managed by **uv**.

- If `.venv/` does not exist, create it: `uv venv`
- Install packages with `uv add <pkg>` (records in pyproject.toml) or `uv pip install <pkg>`
- Never use raw `pip install`, `conda`, `pyenv`, or `apt install python`
- Before running Python, ensure the venv is active: `source .venv/bin/activate`
- When `pyproject.toml` changes, run `uv sync` to update the environment

## Task Management: Detect before using

This workspace supports **bd** (CLI) and/or **Backlog MCP** (MCP server). Neither is pre-installed.

- Before using `bd`: check `command -v bd &>/dev/null`
- Before using Backlog MCP: check for config in `.claude/mcp.json` or `.vscode/mcp.json`
- If NEITHER is available: inform the user, suggest installation, use `manage_todo_list` as fallback
- Never silently fail — always tell the user what's missing
- Both tools are installed via AGENT_START.md Step 4 (user chooses which)
