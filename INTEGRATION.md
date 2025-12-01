# Интеграция фронтенда с сервером

## Добавление фронтенда в docker-compose на сервере

Добавьте следующий сервис в ваш `docker-compose.yml` в директории `~/psychological-testing`:

```yaml
frontend:
  image: ghcr.io/mraksimus/psychologicaltesting.frontend/frontend:latest
  container_name: psychological-testing-frontend
  ports:
    - "3000:80"
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

## Полный пример docker-compose.yml

См. файл `docker-compose.full.yml` для полного примера со всеми сервисами.

## Первый запуск

1. Убедитесь, что у вас есть доступ к GitHub Container Registry:
```bash
docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_GITHUB_TOKEN
```

2. Запустите все сервисы:
```bash
cd ~/psychological-testing
docker compose pull
docker compose up -d
```

## Обновление фронтенда

После каждого деплоя фронтенд автоматически обновится через CI/CD. 

Для ручного обновления:
```bash
cd ~/psychological-testing
docker compose pull frontend
docker compose up -d frontend
```

## Проверка работоспособности

```bash
# Проверка статуса
docker compose ps frontend

# Просмотр логов
docker compose logs -f frontend

# Health check
curl http://localhost:3000/health
```

## Порты

- **Frontend**: `3000` → доступен на `http://your-server:3000`
- **Backend (app)**: `1488`
- **LLM**: `1489`
- **PostgreSQL**: `4343`
- **Ollama**: `11434`

## Настройка Nginx (опционально)

Если хотите использовать Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:1488;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

