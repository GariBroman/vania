# Путешествие по миру поздравлений

Интерактивная игра-открытка для Telegram Web App, созданная с использованием Nuxt 3, Three.js и GSAP.

## Особенности

- 3D-окружение с тремя уникальными уровнями
- Коллекционирование интерактивных открыток
- Интеграция с Telegram Web App
- Возможность делиться открытками с друзьями

## Требования

- Node.js 16.x или выше
- pnpm
- Telegram Bot Token

## Установка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Установите зависимости:
```bash
pnpm install
```

3. Создайте файл `.env` и добавьте ваш Telegram Bot Token:
```
NUXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Разработка

Запустите сервер разработки:
```bash
pnpm dev
```

## Сборка для продакшена

```bash
pnpm build
```

## Деплой

Проект настроен для деплоя на Vercel. Убедитесь, что вы добавили переменную окружения `TELEGRAM_BOT_TOKEN` в настройках проекта на Vercel.

1. Установите Vercel CLI:
```bash
pnpm add -g vercel
```

2. Деплой:
```bash
vercel
```

## Структура проекта

- `components/game/` - Компоненты игры
- `composables/game/` - Игровая логика и состояние
- `pages/` - Маршрутизация и основные страницы
- `assets/game/` - Игровые ресурсы (текстуры, модели, аудио)
- `public/game/` - Статические файлы

## Лицензия

MIT 