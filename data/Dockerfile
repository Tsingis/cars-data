ARG FUNCTION_DIR="/function"

FROM python:3.15.0a2-alpine3.22 AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    SETUP_PATH="/opt/setup"

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
ARG POETRY_VERSION

WORKDIR ${SETUP_PATH}

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

RUN --mount=type=cache,target=/root/.cache \
    pip install "poetry==${POETRY_VERSION}"

COPY ./poetry.lock ./pyproject.toml ./
COPY ./src ./src

RUN --mount=type=cache,target=${POETRY_HOME}/pypoetry/cache \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    poetry install --no-interaction --only-root && \
    poetry export -f requirements.txt --only main,aws --without-hashes > requirements.txt && \
    pip install --prefer-binary --target ${FUNCTION_DIR} -r requirements.txt 

FROM base AS final

ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}

COPY --from=build ${FUNCTION_DIR} ${FUNCTION_DIR}
COPY ./src ${FUNCTION_DIR}/src
COPY ./lambdas/data.py ${FUNCTION_DIR}/data.py

RUN rm -r /usr/local/lib/python*/site-packages/pip* && \
    addgroup -S app && \
    adduser -S -g app lambda

USER lambda

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD ["data.handler"]