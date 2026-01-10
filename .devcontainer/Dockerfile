ARG VARIANT="3.13-bookworm"
FROM mcr.microsoft.com/devcontainers/python:${VARIANT}

USER root
RUN pip install --no-cache-dir uv \
    && uv --version
USER vscode
