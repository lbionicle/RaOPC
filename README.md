# **Программное средство организации корпоративных мероприятий с использованием функции RSVP**

Краткое описание проекта, его цели и основные возможности

Ссылки на репозитории сервера и клиента

---

## **Содержание**

1. [Архитектура](#Архитектура)
   1. [C4-модель](#C4-модель)
   2. [Схема данных](#Схема_данных)
2. [Функциональные возможности](#Функциональные_возможности)
   1. [Диаграмма вариантов использования](#Диаграмма_вариантов_использования)
   2. [User-flow диаграммы](#User-flow_диаграммы)
3. [Детали реализации](#Детали_реализации)
   1. [UML-диаграммы](#UML-диаграммы)
   2. [Спецификация API](#Спецификация_API)
   3. [Безопасность](#Безопасность)
   4. [Оценка качества кода](#Оценка_качества_кода)
4. [Тестирование](#Тестирование)
   1. [Unit-тесты](#Unit-тесты)
   2. [Интеграционные тесты](#Интеграционные_тесты)
5. [Установка и запуск](#installation)
   1. [Манифесты для сборки docker образов](#Манифесты_для_сборки_docker_образов)
   2. [Манифесты для развертывания k8s кластера](#Манифесты_для_развертывания_k8s_кластера)
6. [Лицензия](#Лицензия)
7. [Контакты](#Контакты)

---

## **Архитектура**

### C4-модель

Иллюстрация и описание архитектура ПС

![Контейнерный уровень в нотации C4](./assets/c4_container.png)
Контейнерный уровень в нотации C4

![Компонентный уровень в нотации C4](./assets/c4_component.png)
Компонентный уровень в нотации C4

### Схема данных

Описание отношений и структур данных, используемых в ПС. Также представить скрипт (программный код), который необходим для генерации БД

![Физическая модель базы данных](./assets/erd_database.png)
Физическая модель базы данных

---

## **Функциональные возможности**

### Диаграмма вариантов использования

Диаграмма вариантов использования и ее описание

### User-flow диаграммы

![User-flow для координатора корпоративных мероприятий](./assets/uf_coordinator.png)
User-flow для координатора корпоративных мероприятий

![User-flow для приглашённого участника](./assets/uf_attended.png)
User-flow для приглашённого участника

![User-flow для сотрудника ресепшена](./assets/uf_reseption.png)
User-flow для сотрудника ресепшена

---

## **Детали реализации**

### UML-диаграммы

![UML–диаграмма классов доменной модели сервиса RSVP](./assets/uml_domain_model.png)
UML–диаграмма классов доменной модели сервиса RSVP

![UML–диаграмма компонентов серверной части](./assets/uml_components_backend.png)
UML–диаграмма компонентов серверной части

![UML–диаграмма последовательности изменения статуса отклика](./assets/uml_sequence_rsvp.png)
UML–диаграмма последовательности изменения статуса отклика

### Спецификация API

Представить описание реализованных функциональных возможностей ПС с использованием Open API (можно представить либо полный файл спецификации, либо ссылку на него)

### Безопасность

Система Planora использует многоуровневый подход к безопасности: безопасное хранение паролей, аутентификацию на основе OAuth2 и JWT, ролевую авторизацию и защиту API на уровне FastAPI.

#### Аутентификация и хранение паролей

Пароли пользователей никогда не хранятся в открытом виде. На сервере используется библиотека `passlib` с алгоритмом `bcrypt`: при регистрации пароль хэшируется, при входе сравнивается введённое значение с хэшем.

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

При создании пользователя в базу записывается только хэш пароля:

```python
from .security.passwords import get_password_hash
from .models.users import User
from .schemas.users import UserCreate

def create_user(db, user_in: UserCreate) -> User:
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

#### JWT–токены и вход в систему

Аутентификация построена на схеме OAuth2 с выдачей access–токена в формате JWT. Токен содержит идентификатор пользователя и его роль и имеет ограниченный срок жизни.

```python
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel

SECRET_KEY = "change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class TokenData(BaseModel):
    user_id: str | None = None
    role: str | None = None

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

Эндпоинт `/auth/token` принимает логин и пароль, проверяет учётные данные и возвращает JWT–токен:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .security.tokens import create_access_token
from .security.passwords import verify_password
from .models.users import User
from .dependencies import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user: User | None = db.query(User).filter(User.email == form_data.username).first()
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Учётная запись заблокирована",
        )
    access_token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}
```

#### Ролевая авторизация и защита эндпоинтов

Поверх аутентификации реализовано разграничение доступа по ролям: `admin`, `coordinator`, `attendee`, `reception`. Для этого используется зависимость `get_current_user` и обёртка `require_role`.

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .tokens import decode_token
from .models.users import User
from .dependencies import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)) -> User:
    token_data = decode_token(token)
    if token_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить токен",
        )
    user = db.query(User).get(token_data.user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден или заблокирован",
        )
    return user
```

```python
from fastapi import Depends, HTTPException, status
from .deps import get_current_user
from .models.users import User

def require_role(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для выполнения операции",
            )
        return current_user
    return role_checker
```

Пример защиты доменных эндпоинтов:

```python
from fastapi import APIRouter, Depends
from .security.roles import require_role
from .models.users import User

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", dependencies=[Depends(require_role(["coordinator", "admin"]))])
def list_events(current_user: User = Depends(require_role(["coordinator", "admin"]))):
    ...

@router.post("/{event_id}/checkin", dependencies=[Depends(require_role(["coordinator", "reception"]))])
def checkin_guest(event_id: str, current_user: User = Depends(require_role(["coordinator", "reception"]))):
    ...
```

### Оценка качества кода

Используя показатели качества и метрики кода, оценить его качество

---

## **Тестирование**

### Unit-тесты

Представить код тестов для пяти методов и его пояснение

### Интеграционные тесты

Представить код тестов и его пояснение

---

## **Установка и запуск**

### Манифесты для сборки docker образов

Для развертывания Planora используется Docker и Docker Compose.

Ниже приведён основной `docker-compose.yml`, который поднимает PostgreSQL, backend и frontend:

```yaml
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    container_name: planora_db
    environment:
      POSTGRES_DB: planora
      POSTGRES_USER: planora_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    networks:
      - planora_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: planora_backend
    env_file:
      - .env
    environment:
      DATABASE_URL: postgresql+psycopg2://planora_user:${POSTGRES_PASSWORD}@db:5432/planora
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      JWT_ALGORITHM: HS256
    depends_on:
      - db
    ports:
      - '8000:8000'
    networks:
      - planora_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: planora_frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    ports:
      - '5173:5173'
    networks:
      - planora_network

volumes:
  db_data:

networks:
  planora_network:
    driver: bridge
```

Манифест сборки backend образа:

```dockerfile
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

RUN useradd -m -u 1000 planora && mkdir -p /app && chown -R planora:planora /app
USER planora
WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY backend/ /app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Манифест сборки frontend образа:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### Манифесты для развертывания k8s кластера

Для развёртывания Planora в Kubernetes можно использовать отдельный набор манифестов.

Ниже приведён пример содержимого этих манифестов.

`k8s/postgres.yml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: planora-postgres
spec:
  selector:
    app: planora-postgres
  ports:
    - port: 5432
      targetPort: 5432

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: planora-postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: planora-postgres
  template:
    metadata:
      labels:
        app: planora-postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_DB
              value: 'planora'
            - name: POSTGRES_USER
              value: 'planora_user'
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: planora-secrets
                  key: POSTGRES_PASSWORD
          ports:
            - containerPort: 5432
```

`k8s/backend.yml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: planora-backend
spec:
  selector:
    app: planora-backend
  ports:
    - port: 8000
      targetPort: 8000

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: planora-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: planora-backend
  template:
    metadata:
      labels:
        app: planora-backend
    spec:
      containers:
        - name: backend
          image: planora-backend:latest
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: planora-secrets
                  key: DATABASE_URL
            - name: JWT_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: planora-secrets
                  key: JWT_SECRET_KEY
            - name: JWT_ALGORITHM
              value: 'HS256'
          ports:
            - containerPort: 8000
```

`k8s/frontend.yml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: planora-frontend
spec:
  type: LoadBalancer
  selector:
    app: planora-frontend
  ports:
    - port: 80
      targetPort: 5173

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: planora-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: planora-frontend
  template:
    metadata:
      labels:
        app: planora-frontend
    spec:
      containers:
        - name: frontend
          image: planora-frontend:latest
          env:
            - name: VITE_API_BASE_URL
              value: 'http://planora-backend:8000'
          ports:
            - containerPort: 5173
```

---

## **Лицензия**

Этот проект лицензирован по лицензии MIT - подробности представлены в файле [License.md](License.md)

---

## **Контакты**

Автор: kolya.tsymbal45@gmail.com
