# bapm-E1-cut pages changed (records only, commit `f99b5d24` on `grugops/bapm-E1-cut`): `ABC-269` new; `ABC-231`, `ABC-232`, `ABC-255`, `ABC-265` front matter to Done with a dated block; `EPIC-011` top block, § Phases, § Tickets, § Owner questions, § Dependencies

BA/PM, task `bapm-E1-cut`, from `main` `2bef4d31`. No board, `src/`, tests or `memory-bank/` edit. Nothing run.

| page | change |
|---|---|
| `plans/tickets/ABC-269-e1-…-behind-an-off-door-pair.md` | new: E1, size M, P2, `EPIC-011`, `adr:` `ADR-0064` PROPOSED; scope 1–9; B0–B8 with probe figures; folded-row table; F1–F6; NFR triggers (`NFR-005`, `G2`, `NFR-009` 448 KiB, `NFR-008`, `NFR-004`, security none); test notes 1–7; DoR 10/10 on reading (b) |
| `plans/tickets/ABC-231-…` | `status: done`, `column: Done`, `closed:` merged into `ABC-269`; CLOSED block (row homes) |
| `plans/tickets/ABC-232-…` | `status: done`, `column: Done`, `closed:` merged into `ABC-269` and E4; CLOSED block (row homes; E4 terms) |
| `plans/tickets/ABC-265-…` | `status: done`, `column: Done`, `closed:` merged `605874b8`; `adr:` accepted and in force; CLOSED block |
| `plans/tickets/ABC-255-…` | `status: done`, `column: Done`, `closed:` merged `87484808`; CLOSED block |
| `plans/epics/EPIC-011-…` | top block; Phase 2 header CLOSED; P5 deferred; R1 after E1; Phase 4 E1 → `ABC-269`, pulled forward; E4 takes `ABC-232`'s other passer terms; Tickets rows 1 and 17 Done, rows 10 and 11 closed folded, new row 21 `ABC-269`; id line; Owner questions: `Q-3K-4` live, new `ADR-0064` acceptance row; Dependencies E1 line |

- Front matter of the five ticket pages and the epic parses as YAML (read back).
- Trace: requirement `EPIC-011` → `ABC-269` (folds `ABC-231`, `ABC-232`) → `ADR-0064`; NFRs `NFR-005`, `NFR-009`, `NFR-008`, `NFR-001`.
