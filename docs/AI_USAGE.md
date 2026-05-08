# AI Tool Usage

## Tools Used

- **Claude Code** (Claude Opus) -- AI-assisted development via Anthropic's CLI tool

## How AI Was Used

### Planning Phase
- Analyzed the problem requirements and identified the HR Manager persona
- Proposed the system architecture (Rails API + React SPA)
- Recommended patterns (Service Objects, Query Objects, Concerns) based on SOLID principles
- Helped define the database schema with appropriate indexes for query patterns
- Drafted the API endpoint structure

### Implementation Phase
- Generated model validations and migration files
- Implemented controller actions following RESTful conventions
- Built service objects with optimized SQL queries (CASE/WHEN, OFFSET/LIMIT median)
- Created query objects with chainable interface and security measures (sort whitelist, sanitize_sql_like)
- Wrote serializers for consistent JSON output
- Implemented CSV export with memory-efficient batch streaming
- Built React frontend components with TypeScript and Ant Design
- Wrote seed data generation script with batch insert optimization

### Quality Assurance Phase
- Wrote comprehensive RSpec tests following TDD methodology
- Wrote Jest tests for frontend components and API service layer
- Identified edge cases (empty database, boundary values, SQL injection)
- Suggested performance optimizations (composite indexes, pagination caps)
- Reviewed code for security concerns (input sanitization, parameter whitelisting)

## What AI Did Well

- **Architecture decisions**: Proposed clean separation of concerns that aligns with Rails best practices
- **Optimization**: Identified performance bottlenecks (N+1 salary range queries, in-memory median calculation) and suggested database-level solutions
- **Test coverage**: Generated thorough test suites that cover happy paths, error cases, and edge cases
- **Consistency**: Maintained consistent coding style, naming conventions, and error handling patterns throughout the codebase
- **Documentation**: Produced comprehensive documentation covering architecture, planning, and development methodology

## Where Human Judgment Was Applied

- **Product requirements**: Deciding which features are essential vs. nice-to-have for the MVP
- **UX decisions**: Layout, navigation flow, and how insights are presented to HR managers
- **Trade-off evaluation**: Choosing SQLite for simplicity vs. PostgreSQL for production readiness
- **Code review**: Verifying that generated code is correct, secure, and follows project conventions
- **Priority ordering**: Deciding the sequence of implementation (model first, then API, then insights)
- **Testing strategy**: Determining which tests add the most value and which edge cases matter most

## Principles for AI-Assisted Development

1. **AI is a collaborator, not an autopilot** -- Every piece of generated code was reviewed and understood before being committed. The developer maintains ownership of all decisions.

2. **Start with tests** -- AI was directed to write tests first (TDD), ensuring that the desired behavior was clearly specified before implementation began.

3. **Verify, do not trust** -- AI-generated code was run through the test suite, manually tested with seed data, and reviewed for security issues.

4. **Iterate in small steps** -- Rather than generating the entire application at once, development proceeded in small, testable increments (model, then API, then insights, then export).

5. **Use AI for what it is good at** -- Repetitive boilerplate (serializers, test factories, CRUD controllers), optimization patterns (SQL queries), and documentation. Human judgment was applied for architecture decisions and product choices.

6. **Keep the codebase simple** -- AI suggestions that introduced unnecessary complexity (over-abstraction, premature optimization) were rejected in favor of straightforward solutions.
