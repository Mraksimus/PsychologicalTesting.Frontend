# Деплой фронтенда

## Локальная разработка

1. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

2. Отредактируйте `.env` и укажите нужный `VITE_API_BASE_URL`

3. Запустите dev-сервер:
```bash
npm run dev
```

## Docker

### Сборка образа

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://your-backend-url.com \
  -t psychological-testing-frontend:latest .
```

### Запуск через docker-compose

**Для production:** Используйте готовый образ из `ghcr.io`:

```bash
docker-compose up -d
```

**Для локальной разработки:** Соберите образ с нужным API URL:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://your-backend-url.com \
  -t psychological-testing-frontend:latest .

docker-compose up -d
```

### Проверка статуса и логов

```bash
# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f frontend
```

## CI/CD

### GitHub Actions

Workflow `MAIN-CD` автоматически:
1. Запускается при push в `main` с изменениями в:
   - `src/**`
   - `public/**`
   - `Dockerfile`
   - `docker-compose.yml`
   - `nginx.conf`
   - `package.json`
   - `vite.config.mjs`
   - `.github/workflows/deploy.yml`
2. Запускает линтер и проверку типов
3. Собирает Docker образ и пушит в `ghcr.io`
4. Автоматически деплоит на сервер через SSH

### Настройка секретов в GitHub

Добавьте следующие секреты в настройках репозитория (Settings → Secrets and variables → Actions):

- `SSH_HOST` - IP адрес или домен сервера
- `SSH_USERNAME` - пользователь для SSH подключения
- `SSH_PRIVATE_KEY` - приватный SSH ключ для подключения

**Примечание:** Используются те же секреты, что и для бекенда.

## Настройка на сервере

### Интеграция с общим docker-compose

Фронтенд интегрирован в общий `docker-compose.yml` на сервере в директории `~/psychological-testing`.

1. Добавьте сервис `frontend` в ваш `docker-compose.yml` на сервере:

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

2. Или используйте готовый `docker-compose.full.yml` как пример полной конфигурации

3. После деплоя фронтенд автоматически обновится:
```bash
cd ~/psychological-testing
docker compose pull frontend
docker compose up -d frontend
```

### Локальный запуск (для разработки)

Если нужно запустить только фронтенд локально:

```bash
docker-compose up -d
```

## Переменные окружения

### Для разработки (Vite)

- `VITE_API_BASE_URL` - базовый URL API бекенда

### Для Docker Compose

- `API_BASE_URL` - базовый URL API бекенда (используется при сборке)
- `FRONTEND_PORT` - порт, на котором будет доступен фронтенд (по умолчанию 3000)

## Проверка работоспособности

После деплоя проверьте:

1. Health check:
```bash
curl http://localhost:3000/health
```

2. Доступность приложения:
```bash
curl http://localhost:3000
```

3. Логи контейнера:
```bash
docker-compose logs frontend
```

