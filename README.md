# Auth Microservice

A reusable authentication microservice with JWT-based authentication, role management, and configurable user initialization.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Configurable roles with priorities
- **Dynamic Role Management** - CRUD API for roles (ADMIN only)
- **Configurable Credentials** - Admin credentials via environment variables
- **Email OTP Verification** - Sign-up and password reset via OTP (6 digits)
- **SOLID Compliant** - Clean architecture, easy to extend

## 📁 Project Structure

```
Auth-Microservice/
├── back-end-auth/          # Spring Boot backend
│   ├── src/main/java/com/acm/auth/
│   │   ├── config/         # Security, CORS, initialization
│   │   ├── controller/     # REST endpoints
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── entity/         # JPA entities
│   │   ├── exception/      # Error handling
│   │   ├── repository/     # Data access
│   │   └── service/        # Business logic
│   └── src/main/resources/
│       └── application.yml # Configuration
│
└── front-end-auth/         # React frontend
    └── src/
        ├── api/            # API client
        ├── features/auth/  # Auth context & hooks
        ├── pages/          # SignIn, SignUp, Dashboard
        └── utils/          # Utilities (storage, etc.)
```

## 🛠️ Quick Start

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Docker (optional)

### 1. Clone & Configure

```bash
git clone <repository-url> my-auth-service
cd my-auth-service
```

### 2. Database Setup

```bash
# Option A: Using Docker
cd back-end-auth
docker-compose up -d

# Option B: Manual MySQL
mysql -u root -p
CREATE DATABASE your_database_name;
CREATE USER 'springuser'@'localhost' IDENTIFIED BY 'springpass';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'springuser'@'localhost';
```

### 3. Configure Environment

Create or edit `back-end-auth/.env` (see `.env.example` for the full list):

```bash
# Database
DB_URL=jdbc:mysql://localhost:3306/your_database_name
DB_USER=springuser
DB_PASS=springpass

# JWT (generate your own key for production!)
JWT_SIGNER_KEY=your-secret-key-min-32-chars-long-here

# Admin Account
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@yourproject.com
ADMIN_PASSWORD=YourSecurePassword123

# Test Users (disable in production)
CREATE_TEST_USERS=false

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# OTP + Reset Token
OTP_HASH_SECRET=your-otp-hash-secret
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60
RESET_TOKEN_VALID_MINUTES=10

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=no-reply@example.com
SMTP_FROM_NAME=Auth Service
```

### 4. Run Backend

```bash
cd back-end-auth
mvn spring-boot:run
```

### 5. Run Frontend

```bash
cd front-end-auth
npm install
npm run dev
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Swagger API Docs**: http://localhost:8080/swagger-ui.html

## 🔐 Default Accounts

| Email           | Password | Role  |
| --------------- | -------- | ----- |
| admin@acm.local | admin123 | ADMIN |
| user1@acm.local | 12345678 | USER  |
| user2@acm.local | 12345678 | USER  |

> **Note**: Set `CREATE_TEST_USERS=false` in production to disable test accounts.

## 🎯 Customizing for Your Project

### Adding Custom Roles

**Option 1: Via Database**

```sql
INSERT INTO roles (code, name, priority, redirect_path, description) VALUES
('TEACHER', 'Giáo viên', 50, '/teacher', 'Teacher access'),
('STUDENT', 'Học sinh', 20, '/student', 'Student access');
```

**Option 2: Via API (requires ADMIN token)**

```bash
curl -X POST http://localhost:8080/api/v1/roles \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEACHER",
    "name": "Giáo viên",
    "priority": 50,
    "redirectPath": "/teacher",
    "description": "Teacher access"
  }'
```

### Role Priority System

Higher priority = more important role. When a user has multiple roles, the highest priority role becomes the "primary role" for redirect path determination.

| Role    | Priority | Redirect   |
| ------- | -------- | ---------- |
| ADMIN   | 100      | /admin     |
| TEACHER | 50       | /teacher   |
| STUDENT | 20       | /student   |
| USER    | 10       | /dashboard |

### Changing Admin Credentials

Edit `.env` or set environment variables:

```bash
ADMIN_USERNAME=myadmin
ADMIN_EMAIL=admin@mycompany.com
ADMIN_PASSWORD=SuperSecurePass!
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint                  | Description      | Auth |
| ------ | ------------------------- | ---------------- | ---- |
| POST   | `/api/v1/auth/sign-in`    | Login            | No   |
| POST   | `/api/v1/auth/sign-up`    | Register         | No   |
| POST   | `/api/v1/auth/sign-up/verify-otp` | Verify sign-up OTP | No |
| GET    | `/api/v1/auth/me`         | Get current user | Yes  |
| POST   | `/api/v1/auth/sign-out`   | Logout           | Yes  |
| POST   | `/api/v1/auth/refresh`    | Refresh token    | No   |
| POST   | `/api/v1/auth/introspect` | Validate token   | No   |
| POST   | `/api/v1/auth/forgot-password` | Request reset OTP | No |
| POST   | `/api/v1/auth/forgot-password/verify-otp` | Verify reset OTP | No |
| POST   | `/api/v1/auth/forgot-password/reset` | Reset password | No |

### OTP Email Verification & Password Reset

- **Sign-up**: Call `/api/v1/auth/sign-up` to send OTP, then verify via `/api/v1/auth/sign-up/verify-otp` to activate the account.
- **Forgot password**: Call `/api/v1/auth/forgot-password` to send OTP, verify via `/api/v1/auth/forgot-password/verify-otp` to get a temporary reset token, then reset with `/api/v1/auth/forgot-password/reset`.

### Role Management (ADMIN only)

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/v1/roles`        | List all roles   |
| GET    | `/api/v1/roles/{code}` | Get role by code |
| POST   | `/api/v1/roles`        | Create new role  |
| PUT    | `/api/v1/roles/{code}` | Update role      |
| DELETE | `/api/v1/roles/{code}` | Delete role      |

## 🔧 Environment Variables

| Variable               | Default                                        | Description                             |
| ---------------------- | ---------------------------------------------- | --------------------------------------- |
| `DB_URL`               | jdbc:mysql://localhost:3306/your_name_database | Database connection URL                 |
| `DB_USER`              | springuser                                     | Database username                       |
| `DB_PASS`              | springpass                                     | Database password                       |
| `JWT_SIGNER_KEY`       | (development key)                              | JWT signing key (change in production!) |
| `JWT_VALID_DURATION`   | 3600                                           | Token validity in seconds               |
| `RESET_TOKEN_VALID_MINUTES` | 10                                       | Reset token validity in minutes         |
| `ADMIN_USERNAME`       | admin                                          | Default admin username                  |
| `ADMIN_EMAIL`          | admin@acm.local                                | Default admin email                     |
| `ADMIN_PASSWORD`       | admin123                                       | Default admin password                  |
| `CREATE_TEST_USERS`    | true                                           | Create test users on startup            |
| `CORS_ALLOWED_ORIGINS` | http://localhost:3000                          | Allowed CORS origins                    |
| `OTP_HASH_SECRET`      | (required)                                     | Secret for OTP hashing (HMAC)           |
| `OTP_EXPIRY_MINUTES`   | 5                                              | OTP expiry time in minutes              |
| `OTP_MAX_ATTEMPTS`     | 5                                              | Max OTP verification attempts           |
| `OTP_RESEND_COOLDOWN_SECONDS` | 60                                    | Cooldown between OTP sends              |
| `SMTP_HOST`            | (none)                                         | SMTP host                               |
| `SMTP_PORT`            | 587                                            | SMTP port                               |
| `SMTP_USERNAME`        | (none)                                         | SMTP username                           |
| `SMTP_PASSWORD`        | (none)                                         | SMTP password                           |
| `SMTP_AUTH`            | true                                           | Enable SMTP auth                        |
| `SMTP_STARTTLS`        | true                                           | Enable SMTP STARTTLS                    |
| `SMTP_FROM`            | no-reply@example.com                           | From email address                      |
| `SMTP_FROM_NAME`       | Auth Service                                   | From display name                       |

## 🏗️ Architecture

### SOLID Principles Applied

- **S**ingle Responsibility: Separated storage, HTTP client, auth context
- **O**pen/Closed: Roles configurable from database, no code changes needed
- **L**iskov Substitution: Repository interfaces properly implemented
- **I**nterface Segregation: Focused interfaces and DTOs
- **D**ependency Inversion: Constructor injection throughout

### Key Design Decisions

1. **Role Priority from Database** - No hardcoded role hierarchy
2. **Dynamic Role Type in Frontend** - Any role from backend is accepted
3. **Configurable Credentials** - Via environment variables
4. **Storage Separation** - `authStorage.ts` separated from `http.ts`

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
