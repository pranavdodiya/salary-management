# Planning Notes

## Problem Analysis

### Target Persona
**HR Manager** at a mid-to-large organization who needs to:
- Manage a workforce of 10,000+ employees across multiple countries
- View and edit employee records with fast search and filtering
- Gain salary insights for budgeting, equity analysis, and reporting
- Export data for offline analysis and compliance

### Core Challenges
- **Scale**: 10K employee records must load, filter, and paginate efficiently
- **Usability**: HR managers are not technical -- the interface must be intuitive
- **Data integrity**: Salary and employee data must be validated at every layer
- **Analytics**: Real-time salary insights across multiple dimensions (country, department, job title)

## Requirements Breakdown

### Functional Requirements
1. **Employee CRUD** -- Create, read, update, delete employee records
2. **Search** -- Full-text search across first name, last name, and email
3. **Filtering** -- Filter employees by country, job title, and department
4. **Sorting** -- Sort by any key column (name, salary, country, etc.)
5. **Pagination** -- Server-side pagination with configurable page size
6. **Salary Insights Dashboard** -- Overall stats, breakdowns by country/department/job title, salary range distribution, top earners, country payroll totals
7. **CSV Export** -- Download filtered employee data as CSV
8. **Dropdown Populations** -- Dynamic lists for countries, job titles, departments

### Non-Functional Requirements
1. **Performance** -- Sub-second response times for all API endpoints with 10K records
2. **Data Integrity** -- Validations at both model and database level
3. **Security** -- SQL injection prevention, input sanitization, sort whitelist
4. **Maintainability** -- Clean architecture with separated concerns
5. **Testability** -- Comprehensive test suite covering all layers
6. **Developer Experience** -- Simple setup, clear project structure, good documentation

## Technical Decisions and Trade-offs

### Rails API-only mode
**Decision**: Use `rails new --api` instead of a full Rails app.

| Pro | Con |
|-----|-----|
| Lighter middleware stack (no cookie sessions, CSRF, views) | Cannot serve HTML views if needed later |
| Faster responses for JSON-only API | Requires separate frontend deployment |
| Clear separation of concerns between frontend and backend | Two processes to manage in development |
| React frontend can be deployed independently | |

### SQLite (development)
**Decision**: Use SQLite for development and demonstration.

| Pro | Con |
|-----|-----|
| Zero configuration -- works out of the box | No concurrent write support |
| Single file database, easy to reset/share | Limited query optimizer compared to PostgreSQL |
| Fast for read-heavy workloads | No advanced features (JSONB, full-text search, etc.) |
| Perfect for 10K record demonstration | Would not scale to production multi-user load |

**Migration path**: Switch to PostgreSQL for production by changing `database.yml` and Gemfile.

### Ant Design (frontend component library)
**Decision**: Use Ant Design 6 for the React frontend.

| Pro | Con |
|-----|-----|
| Enterprise-grade component library | Large bundle size |
| Built-in table with sorting, pagination, filtering | Opinionated styling |
| Rich form components with validation | Learning curve for customization |
| Professional look with minimal custom CSS | |

### Service Objects pattern
**Decision**: Extract business logic into service objects (`SalaryInsightsService`, `CsvExportService`).

| Pro | Con |
|-----|-----|
| Controllers stay thin and focused on HTTP concerns | More files to navigate |
| Services are independently testable | Can lead to over-abstraction if misused |
| Easy to compose and reuse | |
| Clear boundaries between layers | |

### Query Objects pattern
**Decision**: Use `EmployeeQuery` to encapsulate filtering, sorting, and pagination.

| Pro | Con |
|-----|-----|
| Composable, chainable interface | Additional abstraction layer |
| Keeps controller clean | |
| Encapsulates pagination logic with metadata | |
| Sort whitelist prevents SQL injection | |

### Pagination strategy
**Decision**: Server-side pagination with OFFSET/LIMIT, capped at 100 per page.

| Pro | Con |
|-----|-----|
| Simple to implement and understand | OFFSET can be slow on very large datasets (100K+) |
| Works well for 10K records | Not cursor-based (no stable pagination during writes) |
| Per-page cap prevents abuse | |
| Returns total count for UI pagination controls | |

**Migration path**: Switch to cursor-based pagination (keyset) if dataset grows beyond 100K.

## Production Considerations

The following would be added for a production deployment:

| Category | Addition | Reason |
|----------|----------|--------|
| **Authentication** | Devise + JWT or OAuth2 | Secure API access, user roles |
| **Database** | PostgreSQL | Concurrent writes, advanced queries, production reliability |
| **Caching** | Redis | Cache salary insights, rate limiting counters |
| **Background Jobs** | Sidekiq + Redis | Async CSV generation for large exports, email notifications |
| **Rate Limiting** | Rack::Attack | Prevent API abuse |
| **Serialization** | Alba or Blueprinter gem | More performant serialization with caching support |
| **CI/CD** | GitHub Actions | Automated testing, linting, deployment |
| **Containerization** | Docker + Docker Compose | Consistent environments, easy deployment |
| **Audit Logging** | PaperTrail or Audited gem | Track who changed what employee record and when |
| **Monitoring** | Sentry + NewRelic/Datadog | Error tracking, performance monitoring |
| **API Docs** | Swagger/OpenAPI via rswag | Auto-generated API documentation |
| **Authorization** | Pundit or CanCanCan | Role-based access control (admin, manager, viewer) |
| **Search** | Elasticsearch or pg_search | Full-text search with relevance ranking |
| **File Storage** | ActiveStorage + S3 | Store exported CSVs, employee documents |
