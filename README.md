[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Tsingis_cars-data&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Tsingis_cars-data) [![Deploy Status](https://github.com/tsingis/cars-data/actions/workflows/deploy.yml/badge.svg)](https://github.com/tsingis/cars-data/actions/workflows/deploy.yml) [![Lambda Status](https://github.com/tsingis/cars-data/actions/workflows/lambda.yml/badge.svg)](https://github.com/tsingis/cars-data/actions/workflows/lambda.yml)

Project about passenger cars in Finland. Open source data from [Traficom](https://tieto.traficom.fi/en/datatraficom/open-data)

Tools used:

- Python
- Node.js
- React
- Docker
- AWS

Docker

- Run via Docker `docker compose up --build app server`

Data

- Install poetry `(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -`
- Navigate to data directory `cd data`
- Set up environment `poetry install --all-groups`

Server

- With python via `python util\http_server.py`
- With pnpm via `pnpm run http` in app directory

App

- Navigate to app directory `cd app`
- Install dependencies `pnpm install`
- Launch `pnpm run dev`