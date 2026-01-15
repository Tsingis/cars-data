ARG FUNCTION_DIR="/function"

FROM python:3.14.2-alpine3.23 AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off

RUN apk update && \
    apk add --no-cache \
    brotli-libs \
    libidn2 \
    libpsl \
    libstdc++ \
    nghttp2-libs \
    zstd-libs

FROM base AS build

ARG FUNCTION_DIR

RUN apk add --no-cache \
    autoconf \
    automake \
    binutils \
    cmake \
    elfutils-dev \
    g++ \
    gcc \
    libc-dev \
    libtool \
    make

COPY requirements.txt .

RUN pip install --prefer-binary --target ${FUNCTION_DIR} -r requirements.txt

FROM base AS final

ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}

COPY --from=build ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]