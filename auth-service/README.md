# Auth-service

#### `Auth-service` обеспечивает аутентификацию и авторизацию пользователей в системе. Он использует технологию JSON Web Token (JWT) для генерации и проверки токенов аутентификации. Auth-сервис написан на TypeScript и использует Express для обработки HTTP-запросов и Postgres в качестве базы данных.

## Технологии

`auth-service` написан на Node.js с использованием следующих технологий:

- `Docker` - платформа для создания, развертывания и управления контейнерами.


- `Express` - фреймворк для создания веб-приложений на Node.js.


- `TypeScript` - язык программирования, который добавляет статическую типизацию для JavaScript.


- `PostgreSQL` - реляционная база данных.


- `jsonwebtoken` - библиотека для создания и проверки JSON Web Token (JWT).


- `bcrypt` - библиотека для хеширования паролей.

## Запуск

Для запуска `auth-service` необходимо установить [Node.js](https://nodejs.org/en/download/) и [Docker](https://www.docker.com/products/docker-desktop).

### 1. Установка зависимостей
> В проекта используется менеджер пакетов `pnpm`. Для установки зависимостей необходимо выполнить следующую команду в терминале:
```
npm install -g pnpm
```

Для установки зависимостей необходимо выполнить следующую команду в терминале:
```bash
pnpm install
```

### 2. Создание файла .env
В корневой директории проекта необходимо создать файл `.env` и заполнить его переменными окружения.
Выполните следующую команду в терминале для создания файла `.env` с переменными окружения по умолчанию:

- Для **Windows**:
```bash
copy .env.example .env
```

- Для **Unix** (Linux, MacOS...):
```bash
cp .env.example .env
```


### Запуск Postgres
База данных Postgres запускается в контейнере `Docker`. 

Для запуска контейнера необходимо выполнить следующую команду:
```bash
docker-compose up -d
```

### Создание базы данных
Для создания базы данных необходимо выполнить следующую команду:

> **Work in progress**. Создание таблиц пока не реализовано 😔


### Запуск в режиме разработки

```bash 
pnpm run dev
```

### Запуск в режиме продакшн
```bash
pnpm run build
```


## API Endpoints

> Все запросы через base route /api/auth/


| Метод | Эндоинт           | Тело запроса                                                 | Заголовок запроса                                                           | Ожидаемый ответ                                                                             | Описание                                                             |
| :--- |:------------------|:-------------------------------------------------------------|:----------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------|:---------------------------------------------------------------------|
| POST | /register         | { "login": "string", "password": "string", "email": string } | -                                                                           | accessToken": string                                                                        | Регистрация пользователя                                             |
|POST| /changePassword| { "oldPassword": string, "newPassword": string }             | ' Bearer {accessToken}' | -                                                                                           | Изменение пароля пользователя                                        |
|POST| /disabletoken| { "token": string} | ' Bearer {accessToken}' | -                                                                                           | Деактивация отправленного в теле запроса refresh токена пользователя |
| POST | /login            | { "login": "string", "password": "string" }                  | -                                                                           | "accessToken": string                                                                       | Авторизация пользователя                                             |
 | GET  | /ping             | -                                                            | -                                                                           | "pong"                                                                                      | Проверка доступности сервиса                                         |
| GET| /auth-ping        | -                                                            | -                                                                           | "pong"                                                                                      | Проверка доступности сервиса с авторизацией                          |
| GET| /refresh-token    | -                                                            | 'Bearer {refreshToken}'| { "accessToken": string }                                                                   | Обновление access токена                                             |
| GET | /user | -                                                            | ' Bearer {accessToken}' | { "uid": string, "username": string, "email": string, "createdAt": Date, "updatedAt" Date } | Получение информации о пользователе                                  |
 | GET | /active-tokens | -                                                            | ' Bearer {accessToken}' | { "activeTokens": string[] }                                                                | Получение списка активных refresh токенов пользователя               |
|GET| /logout| -                                                            | ' Bearer {accessToken}' | -                                                                                           | Выход из системы                                                     |





## Docker 

### Сборка образа
```bash
docker build -t auth-service .
```

### Запуск контейнера
```bash
docker run -p 3000:3000 auth-service
```

## Автор

Автор проекта: [Алексей Нижгородов](https://github.com/Nizhgo)

## Лицензия
[MIT](https://choosealicense.com/licenses/mit/)








