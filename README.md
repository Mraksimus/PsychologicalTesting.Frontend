# Шаблон Mantine + Vite

## Возможности

Этот шаблон включает в себя следующие технологии и настройки:

- [PostCSS](https://postcss.org/) с [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- Настройка [Vitest](https://vitest.dev/) с [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- Настройка ESLint с [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## Скрипты npm

### Сборка и разработка

#### 1. Установить зависимости:

`npm install`

#### 2. Запустить проект в режиме разработки:

`npm run dev`

#### 3. Собрать проект для продакшена:

`npm run build`

#### 4. Предпросмотр продакшен-сборки:

`npm run preview`

### Тестирование

#### 1. Проверить типы TypeScript:

`npm run typecheck`

#### 2. Запустить ESLint:

`npm run lint`

#### 3. Проверить файлы с помощью Prettier:

`npm run prettier:check`

#### 4. Запустить тесты Vitest:

`npm run vitest`

#### 5. Запустить Vitest в режиме наблюдения:

`npm run vitest:watch`

#### 6. Запустить все проверки (`vitest`, `prettier:check`, `lint` и `typecheck`):

`npm run test`

### Прочие скрипты

#### 1. Запустить Storybook в режиме разработки:

`npm run storybook`

#### 2. Собрать продакшен-бандл Storybook в папку `storybook-static`:

`npm run storybook:build`

#### 3. Отформатировать все файлы с помощью Prettier:

`npm run prettier:write`
