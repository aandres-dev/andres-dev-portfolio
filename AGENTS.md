# Project AI Guidelines & Operating Principles

## Primordial Rule: Gentle AI Ecosystem

Every agent, contributor, and automated workflow operating on this repository MUST strictly follow the **Gentle AI Ecosystem** and its architectural standards.

### Core Architectural Principles
1. **CONCEPTS > CODE**: Never write code without deeply understanding the problem, domain requirements, and architecture.
2. **Clean / Screaming Architecture**: Structure code by domain/feature rather than technical concerns alone. Business logic must remain pure and decoupled from frameworks, libraries, and transport layers.
3. **Container-Presentational Pattern**: Clear separation between state/logic containers and dumb/pure UI components.
4. **SOLID Foundations**: Single responsibility, open-closed, Liskov substitution, interface segregation, and dependency inversion are mandatory, not suggestions.

### Development Workflow: Spec-Driven Development (SDD)
All non-trivial changes must follow the SDD lifecycle:
1. **Explore / Propose**: Understand context, outline intent, tradeoffs, and blast radius.
2. **Spec**: Define user scenarios and requirements using Given/When/Then and RFC 2119 keywords.
3. **Design**: Establish component design, data flow, interface contracts, and sequence diagrams.
4. **Tasks**: Break down execution into small, testable work units.
5. **Apply**: Implement code strictly against the specification. Practice Test-Driven Development (TDD) where test runners exist.
6. **Verify**: Run linters, type checks, and test suites. Validate against the spec.
7. **Archive**: Consolidate delta specs into main specs and preserve audit trail.

### Git & Collaboration Conventions
- **Conventional Commits**: Commit messages must strictly follow the conventional commit format (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- **No AI Attribution**: NEVER add "Co-Authored-By", AI watermarks, or AI attribution in commit messages, PR descriptions, or source code.
- **Reviewability**: Keep changes atomic and well-scoped.
