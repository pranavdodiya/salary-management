# TDD Approach

## Red-Green-Refactor Methodology

This project follows Test-Driven Development (TDD) using the **Red-Green-Refactor** cycle:

```
  +-------+       +-------+       +----------+
  |  RED  | ----> | GREEN | ----> | REFACTOR |
  +-------+       +-------+       +----------+
      ^                                 |
      |                                 |
      +---------------------------------+

  RED:      Write a failing test that defines the desired behavior
  GREEN:    Write the minimum code to make the test pass
  REFACTOR: Improve the code while keeping all tests green
```

1. **RED** -- Write a test for the next piece of functionality. Run it and confirm it fails. This ensures the test is actually testing something meaningful.
2. **GREEN** -- Write the simplest code that makes the test pass. Do not optimize or refactor yet. The goal is a passing test.
3. **REFACTOR** -- Clean up the code (extract methods, rename variables, remove duplication) while keeping all tests green. The tests act as a safety net.

## Development Cycles

### Cycle 1: Employee Model Foundation

| Phase | What was done |
|-------|--------------|
| RED | Wrote model specs for validations (presence, numericality, email format/uniqueness), associations, and the `full_name` method |
| GREEN | Created Employee model with all validations, migration with columns and indexes |
| REFACTOR | Extracted `Searchable` and `Filterable` concerns from the model |

### Cycle 2: API Layer (CRUD + Controllers)

| Phase | What was done |
|-------|--------------|
| RED | Wrote request specs for all 5 CRUD actions (index with pagination/filtering/sorting, show, create, update, destroy) and error cases (404, 422, 400) |
| GREEN | Implemented `EmployeesController` with CRUD, `EmployeeQuery` for filtering/sorting/pagination, `EmployeeSerializer` for JSON output, `ErrorHandler` concern |
| REFACTOR | Extracted query logic from controller into `EmployeeQuery` object, extracted serialization into `EmployeeSerializer`, extracted error handling into `ErrorHandler` concern |

### Cycle 3: Insights, Export, and Polish

| Phase | What was done |
|-------|--------------|
| RED | Wrote service specs for `SalaryInsightsService` (overall stats, by_country, by_job_title, by_department, salary_ranges, top_earners, country_payroll, edge cases), `CsvExportService` (headers, data, find_each batching), request specs for all insight endpoints, export specs for CSV download |
| GREEN | Implemented `SalaryInsightsService` with all analytics methods, `SalaryInsightsController` with 10 endpoints, `CsvExportService` with batch streaming, `ExportsController` with CSV download |
| REFACTOR | Optimized salary_ranges to use single CASE/WHEN query, optimized median to use OFFSET/LIMIT, added top earners limit capping, added composite indexes |

## Test Coverage Summary

| Layer | File | Test Count |
|-------|------|-----------|
| **Model** | `spec/models/employee_spec.rb` | 35 |
| **Requests** | `spec/requests/employees_spec.rb` | 24 |
| **Requests** | `spec/requests/salary_insights_spec.rb` | 13 |
| **Requests** | `spec/requests/exports_spec.rb` | 4 |
| **Services** | `spec/services/salary_insights_service_spec.rb` | 13 |
| **Services** | `spec/services/csv_export_service_spec.rb` | 4 |
| **Queries** | `spec/queries/employee_query_spec.rb` | 13 |
| **Serializers** | `spec/serializers/employee_serializer_spec.rb` | 5 |
| **Frontend** | `src/App.test.tsx` | 5 |
| **Frontend** | `src/services/api.test.ts` | 10 |
| | **Total** | **126** |

### Coverage by Concern

- **Validations**: All model validations tested (presence, format, uniqueness, numericality)
- **CRUD operations**: All 5 actions tested with success and error paths
- **Filtering/Search**: Country, job title, department filters and search tested
- **Sorting**: Valid columns, invalid columns (fallback to default), direction handling
- **Pagination**: Page/per_page params, cap enforcement, metadata response
- **Insights**: All 10 insight endpoints tested with data and edge cases (empty DB)
- **CSV Export**: Header correctness, data integrity, streaming behavior
- **Serialization**: All fields serialized correctly, collection serialization
- **Frontend**: App navigation, API service functions with mocked axios

## Testing Principles

| Principle | Description |
|-----------|-------------|
| **Test behavior, not implementation** | Tests verify what the code does (API responses, computed values), not how it does it internally. Refactoring should not break tests. |
| **Arrange-Act-Assert (AAA)** | Each test follows a clear structure: set up data, perform the action, check the result. |
| **One assertion per concept** | Each test focuses on verifying one logical concept, even if it uses multiple `expect` statements to fully verify that concept. |
| **Independent tests** | Tests do not depend on each other or on execution order. Each test sets up its own data using factories. |
| **Descriptive names** | Test names read as specifications: `"returns paginated employees with metadata"`, `"filters employees by country"`. |
| **Factory pattern** | Uses `factory_bot` to create test data with sensible defaults. Traits and overrides keep test setup concise. |
| **Edge cases** | Tests cover empty databases, boundary values (salary = 0), invalid parameters, SQL injection attempts, and missing records. |
| **Request specs over controller specs** | Request specs test the full HTTP stack (routing, middleware, serialization) rather than testing controllers in isolation. |
