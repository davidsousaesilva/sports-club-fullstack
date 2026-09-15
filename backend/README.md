# Sports Club Full-Stack Platform — Backend

Spring Boot REST API for the Sports Club Full-Stack Platform. The backend manages identity and role management, club configuration, teams, sporting activities, attendance and performance records, membership fees, payment records, and analytics.

For the complete project overview and Docker-based setup, see the [root README](../README.md).

## Technology stack

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT-based authentication
- PostgreSQL
- Maven
- Flyway dependency, prepared for future database migrations
- Spring Boot Actuator
- OpenAPI / Swagger
- Render for deployment
- Supabase PostgreSQL for the remote database

## Main capabilities

- REST API for the sports-club platform
- JWT-based authentication, refresh-token support, logout, and token invalidation
- Role-based authorisation for athletes, coaches, staff, and managers
- People, profiles, roles, and notification management
- Modalities, statistic types, sports complexes, and club settings
- Teams, memberships, and team-management workflows
- Training sessions, events, competitions, and team registration
- Attendance and athlete-performance records
- Membership fees, payment records, and financial workflows
- Payment domain designed for future gateway integration, with mock mode and webhook-oriented endpoints
- Dashboard, financial-report, and sports-report APIs

## Architecture

The backend is a structured monolith organised around functional subsystems. It is deployed as a single Spring Boot application, while the codebase groups related responsibilities by business domain.

A typical subsystem contains the following layers:

```text
subsystem/
├── application/   # Application services and facades
├── controller/    # REST endpoints
├── domain/        # Entities, value objects, and domain enums
├── dto/           # Request, response, and filter contracts
├── repository/    # Persistence interfaces and query specifications
└── service/       # Domain rules, mapping, factories, and support services
```

Core functional subsystems include:

- `identity` — people, roles, profiles, and notifications
- `sportscore` — modalities, statistic types, sports complexes, and club settings
- `teams` — teams and memberships
- `activities` — training sessions, events, competitions, and registrations
- `activitytracking` — attendance and performance records
- `finance` — fees, payment records, payment attempts, and gateway-related workflows
- `analytics` — dashboards and financial/sports reporting

Cross-cutting packages include:

- `security` — authentication flow, JWT handling, security filters, and security handlers
- `config` — CORS and OpenAPI configuration
- `shared` — shared entities and reusable abstractions
- `bootstrap` — application data initialisation

The full package layout is documented in `docs/package-structure.md`.

## API contract and invariants

The API follows an API-first, DTO-only contract:

- Request DTOs contain editable fields and validation rules; response DTOs contain identifiers, computed data, and read-only metadata.
- The acting user is inferred from the authenticated security context rather than accepted as a client-supplied actor field.
- Enumerated states such as roles, fee states, and payment states are validated at the API boundary and constrained in the database where possible.
- SS7 Analytics is read-only and aggregates data owned by other subsystems.
- Domain violations are translated into stable HTTP 4xx responses.

Important domain constraints include:

- A presence belongs to exactly one context: a training or an event, never both.
- A performance record follows the same training-or-event context rule.
- Team/person links are temporal.
- Attendance and performance registration use upsert semantics where the domain defines one logical record.
- Fee and payment state transitions are explicit and authorised.

## Concurrency control

### Optimistic locking with JPA

Shared mutable records such as teams, activities, presences, performances, fees, and payments can be read by multiple users at once. Optimistic locking prevents a later update from silently overwriting a previous update.

In JPA, a version field can be used on the entity:

```java
@Entity
public class Payment {
    @Id
    @GeneratedValue
    private Long id;

    @Version
    private long version;
}
```

Hibernate effectively performs an update like:

```sql
UPDATE payment
SET status = ?, version = version + 1
WHERE id = ? AND version = ?;
```

If another transaction already updated the row, Hibernate raises an optimistic-lock exception. The API represents this as `409 Conflict`:

```json
{
  "code": "RESOURCE_VERSION_CONFLICT",
  "message": "The resource was modified by another user. Refresh the data and try again."
}
```

Optimistic locking prevents lost updates between concurrent writers. It is separate from idempotency, which prevents repeated commands such as duplicated payment webhooks from applying the same business effect more than once.

### Idempotency

Payment webhook processing stores the provider event identifier and uses a unique constraint to prevent repeated notifications from creating duplicate payments or repeating state transitions. The payment and fee update takes place within one transaction.

## Security

The API uses JWT-based authentication. The security module contains token generation and validation, an authentication filter, user-details loading, custom handlers, refresh-token support, and token invalidation support.

Role-based access control is applied across platform operations so that each actor can access only the relevant capabilities. Protected endpoints validate authentication and authorisation on the server.

The API uses distinct statuses for common security outcomes:

- `401 Unauthorized` for missing, expired, malformed, or revoked authentication.
- `403 Forbidden` for an authenticated user without the required permission.
- `404 Not Found` when the resource does not exist or should not be disclosed.
- `409 Conflict` for optimistic-lock and state conflicts.

## Persistence and migrations

Data is persisted in PostgreSQL through Spring Data JPA. Repositories and query specifications are organised near their functional subsystems, keeping persistence concerns close to the relevant business domain.

For the current local Docker workflow:

- Hibernate runs with `ddl-auto=update` to create and evolve the local development schema.
- The default PostgreSQL schema is `public`.
- Flyway is included as a dependency but is currently disabled because the migration directory does not yet contain versioned migrations.

The data model uses foreign keys, enum-like states, audit timestamps, uniqueness constraints, and XOR/check invariants.

## Payment reliability

The payment architecture separates the domain from the gateway through an adapter/port boundary. The academic implementation includes mock payment flows and webhook-oriented endpoints. The model supports external gateway integration through payment attempts, external identifiers, asynchronous notifications, and transactional state updates.

Recommended webhook flow represented by the application design:

```text
Gateway
  │ signed notification
  ▼
REST controller
  │ validate signature and schema
  ▼
Finance application service
  │ check provider event idempotency
  ▼
Transactional fee/payment update
  │ unique constraint and state-transition validation
  ▼
2xx acknowledgement
```

## Error handling and observability

The application uses structured error responses for validation failures, domain violations, not-found cases, authentication failures, authorisation failures, and concurrency conflicts.

Spring Boot Actuator exposes health endpoints. Application logs and security logs support diagnosis of authentication events, role changes, fee settlement, webhook acceptance, and optimistic-lock conflicts.

## Run with Docker

Use Docker Compose from the repository root to start PostgreSQL, the backend API, and the frontend together:

```bash
docker compose up --build
```

The backend container is built from `backend/Dockerfile` and listens on port `8080`.

Verify the API health with:

```bash
curl http://localhost:8080/actuator/health
```

## Run without Docker

### Prerequisites

- Java 21
- Maven
- A running PostgreSQL instance
- Required environment variables configured locally

### Required environment variables

At minimum, configure:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/sportsclub
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=change-me
JWT_SECRET=replace-with-a-long-random-development-secret
ADMIN_EMAIL=admin@sportsclub.local
ADMIN_PASSWORD=change-me
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Build and run

```bash
mvn clean package
mvn spring-boot:run
```

If the Maven Wrapper is available:

```bash
./mvnw clean package
./mvnw spring-boot:run
```

The API starts on:

```text
http://localhost:8080
```

## Environment variables

The exact names must match `application.yml`.

| Variable                        | Purpose                                | Default       |
| ------------------------------- | -------------------------------------- | ------------- |
| `PORT`                          | HTTP port used by the API              | `8080`        |
| `SPRING_DATASOURCE_URL`         | PostgreSQL JDBC connection URL         | Required      |
| `SPRING_DATASOURCE_USERNAME`    | PostgreSQL user                        | Required      |
| `SPRING_DATASOURCE_PASSWORD`    | PostgreSQL password                    | Required      |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate schema-management strategy   | `update`      |
| `SPRING_JPA_DEFAULT_SCHEMA`     | PostgreSQL schema used by Hibernate    | `public`      |
| `SPRING_JPA_SHOW_SQL`           | Enables SQL logging                    | `false`       |
| `SPRING_JPA_FORMAT_SQL`         | Formats SQL logging output             | `false`       |
| `SPRING_JPA_USE_SQL_COMMENTS`   | Enables Hibernate SQL comments         | `false`       |
| `JWT_SECRET`                    | Secret used to sign and validate JWTs  | Required      |
| `JWT_ACCESS_EXPIRATION`         | Access-token lifetime in milliseconds  | `900000`      |
| `JWT_REFRESH_EXPIRATION`        | Refresh-token lifetime in milliseconds | `604800000`   |
| `CORS_ALLOWED_ORIGINS`          | Allowed browser origin(s)              | Required      |
| `ADMIN_EMAIL`                   | Initial manager email                  | Required      |
| `ADMIN_PASSWORD`                | Initial manager password               | Required      |
| `PAYMENT_GATEWAY_MOCK_ENABLED`  | Enables mock payment-gateway behaviour | `true`        |
| `PAYMENT_GATEWAY_SANDBOX_URL`   | Gateway sandbox endpoint               | Empty         |
| `PAYMENT_GATEWAY_ENTITY`        | Gateway entity identifier              | Empty         |
| `PAYMENT_GATEWAY_API_KEY`       | Gateway API key                        | Empty         |
| `MONTHLY_FEE_GENERATION_CRON`   | Schedule for membership-fee generation | `0 0 3 1 * *` |
| `APP_LOG_LEVEL`                 | Application log level                  | `INFO`        |
| `SPRING_SECURITY_LOG_LEVEL`     | Spring Security log level              | `INFO`        |
| `HIBERNATE_SQL_LOG_LEVEL`       | Hibernate SQL log level                | `WARN`        |

## Initial administrator

At startup, `DataInitializer` checks whether a user with `ADMIN_EMAIL` exists. If not, it creates an initial manager account using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

```bash
docker compose down -v
docker compose up --build
```

## Actuator

The local application exposes the following Actuator endpoints:

- `/actuator/health`
- `/actuator/info`

The health endpoint is used to confirm that the API and its database connection are running.

## Deployment

The backend was deployed on Render. Its remote PostgreSQL database was hosted on Supabase. Environment variables were configured in the deployment platform.

## Project status

This backend was developed as part of an academic group project during the 2025/2026 academic year and is published as a portfolio project.

The payment model and API surface are prepared for external gateway integration, but a real payment provider is not configured in the academic deployment.
