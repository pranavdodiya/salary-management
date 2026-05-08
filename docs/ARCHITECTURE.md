# Architecture Overview

## System Architecture

```
+-------------------+        HTTP/JSON         +-------------------+        SQL          +------------+
|                   |  =====================>  |                   |  ================>  |            |
|   React 19 SPA    |      localhost:3001      |   Rails 7.2 API   |     localhost:3000  |   SQLite   |
|   (TypeScript)    |  <======================  |   (API-only)      |  <================  |   (dev)    |
|   Ant Design 6    |        JSON responses    |   Namespace: /api |    ActiveRecord     |            |
|                   |                          |              /v1  |                     |            |
+-------------------+                          +-------------------+                     +------------+
     Port 3001                                      Port 3000                           db/development.sqlite3
```

## Backend Clean Architecture

```
                            HTTP Request
                                 |
                                 v
                          +-------------+
                          |   Routes    |
                          |  (routes.rb)|
                          +------+------+
                                 |
                                 v
                     +-----------+-----------+
                     |     Controllers       |
                     |  EmployeesController  |
                     |  SalaryInsightsCtrl   |
                     |  ExportsController    |
                     +--+--------+--------+--+
                        |        |        |
               +--------+   +---+---+   +---------+
               v             v       v             v
        +------------+ +----------+ +-------------+ +-----------+
        |   Query    | | Service  | | Serializer  | |  Concern  |
        |   Objects  | | Objects  | |   Objects   | | (modules) |
        +-----+------+ +----+----+ +------+------+ +-----+-----+
              |              |             |               |
              v              v             v               v
        +------------------------------------------------------------+
        |                     Employee Model                         |
        |          (includes: Searchable, Filterable)                |
        +------------------------------------------------------------+
                                 |
                                 v
                          +-------------+
                          |   SQLite    |
                          |  Database   |
                          +-------------+
```

## SOLID Principles Application

| Principle | Implementation | Example |
|-----------|---------------|---------|
| **Single Responsibility** | Each class has one job | `EmployeeQuery` handles filtering/sorting/pagination; `SalaryInsightsService` handles analytics; `CsvExportService` handles CSV generation; `EmployeeSerializer` handles JSON shaping |
| **Open/Closed** | Model concerns extend behavior without modification | `Searchable` and `Filterable` concerns are included via modules -- new scopes can be added without modifying the Employee model |
| **Liskov Substitution** | Query objects accept any ActiveRecord relation | `EmployeeQuery.new(relation)` works with any Employee scope or relation |
| **Interface Segregation** | Controllers expose only relevant endpoints | `EmployeesController` handles CRUD, `SalaryInsightsController` handles analytics, `ExportsController` handles CSV -- clients only depend on what they need |
| **Dependency Inversion** | Services depend on abstractions (ActiveRecord interface) | `CsvExportService.new(relation)` accepts any relation, not a concrete query; `ErrorHandler` concern decouples error handling from controllers |

## Folder Structure

```
app/
  controllers/
    application_controller.rb          # Base controller (includes ErrorHandler)
    concerns/
      error_handler.rb                 # Centralized exception handling
    api/
      v1/
        employees_controller.rb        # Full CRUD for employees
        salary_insights_controller.rb  # Analytics endpoints
        exports_controller.rb          # CSV export endpoint
  models/
    application_record.rb
    employee.rb                        # Core model with validations
    concerns/
      filterable.rb                    # Filter scopes (country, job_title, department)
      searchable.rb                    # Search scope (first_name, last_name, email)
  serializers/
    employee_serializer.rb             # JSON representation of Employee
  queries/
    employee_query.rb                  # Filtering, sorting, pagination logic
  services/
    salary_insights_service.rb         # Salary analytics computations
    csv_export_service.rb              # CSV generation with streaming
```

## Database Schema

### employees table

| Column | Type | NOT NULL | Notes |
|--------|------|----------|-------|
| `id` | integer | YES | Auto-increment primary key |
| `first_name` | string | YES | |
| `last_name` | string | YES | |
| `job_title` | string | YES | |
| `country` | string | YES | |
| `salary` | decimal(12,2) | YES | Precision 12, scale 2 |
| `department` | string | NO | Nullable (some employees may not have a department) |
| `date_of_joining` | date | YES | |
| `email` | string | YES | Unique constraint at DB level |
| `created_at` | datetime | YES | Rails timestamp |
| `updated_at` | datetime | YES | Rails timestamp |

### Indexes (6 total)

| Index | Columns | Unique | Purpose |
|-------|---------|--------|---------|
| `index_employees_on_email` | email | YES | Enforce unique emails, fast lookup |
| `index_employees_on_country` | country | NO | Filter by country, GROUP BY country analytics |
| `index_employees_on_department` | department | NO | Filter by department, GROUP BY department analytics |
| `index_employees_on_job_title` | job_title | NO | Filter by job title, GROUP BY job_title analytics |
| `index_employees_on_country_and_department` | country, department | NO | Composite filter: country + department |
| `index_employees_on_country_and_job_title` | country, job_title | NO | Composite filter: country + job_title (used by by_job_title with country param) |

## Performance Considerations

| Technique | Location | Description |
|-----------|----------|-------------|
| **Batch insert (insert_all)** | `db/seeds.rb` | Seeds 10,000 employees using `insert_all` in batches instead of individual `create` calls. Orders of magnitude faster. |
| **CASE/WHEN salary ranges** | `SalaryInsightsService#salary_ranges` | Single SQL query with `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` to compute all salary range buckets in one pass instead of N separate queries. |
| **OFFSET/LIMIT median** | `SalaryInsightsService#median_salary` | Computes median via `ORDER BY salary OFFSET mid LIMIT 1` (odd) or averaging two middle values (even) -- avoids loading all records into memory. |
| **Pagination cap** | `EmployeeQuery#paginate` | `per_page` is capped at 100 (`[[per_page.to_i, 1].max, 100].min`) to prevent clients from requesting unbounded result sets. |
| **CSV find_each** | `CsvExportService#generate` | Uses `find_each(batch_size: 1000)` for memory-efficient streaming of large CSV exports. |
| **Sort whitelist** | `EmployeeQuery#sanitize_sort_column` | Only allows sorting by whitelisted columns (`SORTABLE_COLUMNS`) to prevent SQL injection via ORDER BY. |
| **sanitize_sql_like** | `Searchable` concern | Uses `sanitize_sql_like` to escape `%` and `_` characters in LIKE queries, preventing injection. |
| **Top earners limit cap** | `SalaryInsightsController#top_earners` | Clamps limit between 1 and 50: `[[params.fetch(:limit, 10).to_i, 1].max, 50].min` |
| **Composite indexes** | Database schema | Composite indexes on `(country, department)` and `(country, job_title)` optimize multi-column filter queries. |

## API Endpoints

All endpoints are under `/api/v1`.

### Employee CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List employees (paginated, filterable, sortable, searchable) |
| GET | `/employees/:id` | Get single employee |
| POST | `/employees` | Create employee |
| PUT/PATCH | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

**Query parameters for GET /employees:**
- `page` (default: 1), `per_page` (default: 20, max: 100)
- `country`, `job_title`, `department` (filters)
- `search` (searches first_name, last_name, email)
- `sort_by` (one of: first_name, last_name, salary, country, job_title, department, date_of_joining, created_at)
- `sort_direction` (asc/desc, default: desc)

### Salary Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary_insights` | Overall stats (min, max, avg, median, count) |
| GET | `/salary_insights/by_country` | Stats grouped by country (optional `?country=` filter) |
| GET | `/salary_insights/by_job_title` | Stats grouped by job title (optional `?country=` filter) |
| GET | `/salary_insights/by_department` | Stats grouped by department |
| GET | `/salary_insights/salary_ranges` | Employee count by salary range buckets |
| GET | `/salary_insights/top_earners` | Top N earners (optional `?limit=`, default 10, max 50) |
| GET | `/salary_insights/country_payroll` | Total payroll by country |
| GET | `/salary_insights/countries` | Distinct country list |
| GET | `/salary_insights/job_titles` | Distinct job title list |
| GET | `/salary_insights/departments` | Distinct department list |

### Exports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exports/employees` | Download employees as CSV (supports same filters as employee list) |
