ARG FUNCTION_DIR="/function"

FROM python:3.13-slim-bookworm AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    SETUP_PATH="/opt/setup"

FROM base AS build

ARG FUNCTION_DIR
ARG POETRY_VERSION

WORKDIR ${SETUP_PATH}

RUN --mount=type=cache,target=/root/.cache \
    pip install "poetry==${POETRY_VERSION}"

COPY ./poetry.lock ./pyproject.toml ./

RUN --mount=type=cache,target=${POETRY_HOME}/pypoetry/cache \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    poetry install --no-interaction --no-root --without main,dev,aws && \
    poetry export -f requirements.txt --with main,aws --without-hashes > requirements.txt && \
    pip install --target ${FUNCTION_DIR} -r requirements.txt 

FROM base AS final

ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}

COPY --from=build ${FUNCTION_DIR} ${FUNCTION_DIR}
COPY ./src ${FUNCTION_DIR}/app

RUN rm -r /usr/local/lib/python*/site-packages/pip* && \
    groupadd --system app && \
    useradd --system --gid app --no-create-home lambda

USER lambda

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD ["app.lambda.handler"]