---
id: 20261010T185733Z-qe-e2e-decision-abc093-verdict-pass-with-gaps-8fe9708a
kind: decision
by: qe-e2e
at: 2026-10-10T18:57:33Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - ADR-0023
  - NFR-006
  - NFR-008
  - QE-093-a
  - QE-093-b
  - QE-093-c
  - QE-093-d
  - QE-093-e
  - tools/opening-book/book.test.ts
  - 20261010T185733Z-qe-e2e-observation-abc093-readings-rebuild-gates-48715993
  - 20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72
supersedes:
---

# `ABC-093` QE verdict: PASS_WITH_GAPS. `A1`–`A8` are MET on QE's own harness, and the rebuild is byte-identical. One MEDIUM and one LOW gap are routed, and four test-only properties were added

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The ticket's
`## Scope` and `## Security / NFR triggers` are authoritative; this note cites them and does not restate them.

- **What was reviewed.** Branch `grugops/ABC-093-opening-book-artifact`, base `e34fbc6f`, code `5332f501`. QE's
  commit is `e68b5e68`: test-only, `tools/opening-book/book.test.ts`, 13 → 17 tests, still one file.
- **The verdict.** All eight criteria are MET; readings are in `…48715993`. The rebuild from the pinned CC0 source
  was fetched by QE: all five sha256 values match `ATTRIBUTION.md`, and `cmp` exits 0 against the committed
  `book.json` (sha256 `3802f52f…41d`).
- **Why not PASS.** Two gaps are routed (`…cce9af72`):
  - **`QE-093-a`, MEDIUM.** § Scope bullet 4, the `AGENTS.md` regeneration line, is undone on the delivered tree.
    It was a fence conflict, owed per `…a6cb510f`.
  - **`QE-093-b`, LOW.** The compiler never checks the source bytes against the pin, so `source.commit` is a
    label, not a proof.
  - **Three INFO items:** `QE-093-c`, `-d` and `-e`.
- **UAT.** The waiver filter is measured EMPTY on `5332f501` and on `e68b5e68`, so UAT is waived. QE does not
  waive UAT; it measures the filter.
- **Route.** QE recommends that `In Review` exit. Per `ADR-0037` § Consequences, `ADR-0036` does not send a
  Security/NFR hop; that call is the Orchestrator's.
- **The owner's weight veto.** It stays open. Nothing here decides it.
