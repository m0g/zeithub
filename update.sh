#!/bin/bash
docker system prune
docker-compose pull
docker-compose down
docker-compose up -d