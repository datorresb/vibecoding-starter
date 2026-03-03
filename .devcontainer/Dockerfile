ARG VARIANT="3.13-bookworm"
FROM mcr.microsoft.com/devcontainers/python:${VARIANT}

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends ripgrep socat \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir uv \
    && uv --version
USER vscode
