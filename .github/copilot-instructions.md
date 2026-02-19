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

## Task Management: Check bd before using it

Before running ANY `bd` command (`bd create`, `bd list`, `bd sync`, etc.):

- First check: `command -v bd &>/dev/null`
- If bd is NOT installed, inform the user and suggest installation
- Never silently fail or skip task tracking — use `manage_todo_list` as fallback
- bd is installed via AGENT_START.md, not automatically
