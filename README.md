[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Tsingis_cars-data&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Tsingis_cars-data) [![Deploy Status](https://github.com/tsingis/cars-data/actions/workflows/deploy.yml/badge.svg)](https://github.com/tsingis/cars-data/actions/workflows/deploy.yml) [![Data Status](https://github.com/tsingis/cars-data/actions/workflows/data.yml/badge.svg)](https://github.com/tsingis/cars-data/actions/workflows/data.yml) [![Trigger Status](https://github.com/tsingis/cars-data/actions/workflows/trigger.yml/badge.svg)](https://github.com/tsingis/cars-data/actions/workflows/trigger.yml)

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

- Install poetry globally
  - Windows Powershell `(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -`
  - Other `curl -sSL https://install.python-poetry.org | python3 -`
- Navigate to data directory `cd data`
- Set up environment `poetry install --all-groups`

Server

- With python via `python util\http_server.py`
- With pnpm via `pnpm run http` in app directory

App

- Setup corepack globally `corepack enable`
- Navigate to app directory `cd app`
- Install dependencies `pnpm install`
- Launch `pnpm run dev`
