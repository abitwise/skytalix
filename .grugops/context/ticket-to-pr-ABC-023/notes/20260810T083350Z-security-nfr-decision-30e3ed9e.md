---
id: 20260810T083350Z-security-nfr-decision-30e3ed9e
kind: decision
by: security-nfr
at: 2026-08-10T08:33:50Z
refs:
  - ABC-023
  - A4
  - RISK-ABC023-01
  - src/moves.castling.hardening.test.ts
  - agent-factory/checklists/security-nfr-checklist.md
  - .grugops/factory.config.json
  - 20260810T083348Z-security-nfr-observation-dc358c57
  - 20260810T083349Z-security-nfr-observation-ff60dfac
verified_by: 
confidence: high
supersedes: 
---

# The ASVS L1 result, the ONE accepted risk with its named owner, and the two things this gate refuses to pretend

`security.asvs_level` is **L1** (70 of the 345 requirements active), `security.block_on` is
**high**, `compliance_regime` is **`[]`**.

## The active L1 set, and the honest shape of "N/A"

Sixty-odd of the 70 active requirements are structurally unreachable by this project, let alone by
this diff: V3 (web frontend), V4 (API/web service), V6 (authentication), V7 (sessions), V8
(authorization), V9/V10 (tokens, OAuth/OIDC), V12 (TLS) and V5 (file upload) have no surface here —
no server, no HTTP, no auth, no session, no upload, and no user surface at all until `EPIC-006`.
That is recorded as **not applicable**, never as passed.

The L1 requirements that genuinely bear on a 749-line code addition, each with its evidence:

```
V1.2.5  OS command injection          PASS — zero OS calls in the added lines; no child_process,
                                             no spawn, no exec anywhere in the diff
V1.3.2  no eval / dynamic execution   PASS — no eval, no new Function, no timer-string execution
V2.2.1  input validated to expectation PASS — every helper throws on a row that does not hold
                                             exactly one castling right; fails closed, never open
V5.3.2  path traversal in file paths   N/A  — the diff performs no filesystem operation at all
V14.2.1 sensitive data in URL/query    N/A  — no URL, no query, no network; zero "://" in the diff
V15.3.1 return only required fields    N/A  — nothing is returned to any consumer
V13.4.1 source-control metadata        UNCHANGED — pre-existing project deferral, not touched here
V15.1.1 / V15.2.1  3rd-party components UNCHANGED — the diff adds ZERO dependency edges and
                                             package.json is untouched; the standing deferral
                                             (owner Architect/Design at EPIC-006) is not worsened
```

**No L1 requirement FAILS. Nothing is high. `block_on: high` is therefore not reached and nothing
blocks.** No required fix is issued, and none is invented to look thorough — the change does not
warrant a control it does not have.

`V15.2.3` ("production must not expose extraneous functionality such as test code") is **L2, and so
outside the active set at this dial** — named here because a reader looking at +749 lines of test
code will reasonably wonder. Even if the dial moved, this project ships nothing (`private: true`,
no `bin`, no `main`, no `exports`) and `*.test.ts` has no runtime importer.

## The one accepted risk — LOW, and it has a NAMED OWNER

**`RISK-ABC023-01` — the new test helpers index object literals with a string taken from a FEN
field, and cast away the `undefined`.** `CASTLE_SHAPE[fields[2]]` is guarded by an `undefined`
check that throws, and `PIECE_TYPES[name] as number` is not guarded at all. Both are safe **today**
and the reason is bounded: every key is a hard-coded literal from a table in this same file, so
neither lookup can receive a value the file did not write. A prototype-chain key such as
`"constructor"` would return a truthy non-shape object and slip past the `undefined` guard — the
pattern `V15.3.6` warns about (L2, out of the active set).

```
severity   LOW — unreachable on today's inputs; no untrusted input exists anywhere in this project
owner      QE/E2E — the role that owns the rows in src/moves.castling.hardening.test.ts
trigger    the first time any of these helpers is handed a FEN that is NOT a literal in this file
           — a fuzzer, a file, a generated corpus, or a property-based lane. At that moment the
           `undefined` check must become an own-property check (Object.hasOwn / a Map).
```

**No fix is required now.** Requiring one would be gold-plating an unreachable path, and it would
also collide with `A4`, which is live: the repair belongs to whoever makes the input untrusted.

## Two things this gate refuses to pretend

1. **No Compliance Officer hand-off is owed, and that is recorded rather than silently omitted.**
   `compliance_regime` is `[]`. There is no regime to extend this review under. Section 13's deeper
   compliance work does not apply.
2. **The test-integrity checker did not pass — it could not run.**
   `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` exits **2**
   with *"cannot read the registry file"*. Exit 2 is COULD-NOT-RUN, not a pass, and not the exit-1
   human-only short circuit. **`.grugops/test-skips.md` was NOT created by this gate** — an agent
   may not author the justification that clears its own gate — and it is owed nothing anyway,
   because the skip count is independently **0**.

## The ticket's own `## Security / NFR triggers` line, adjudicated

The ticket says "none". It is **right about NFR** (re-derived in the observation note: all seven
catalog rows are production-code bars and the production tree is byte-identical) and it was
**incomplete about security**, because it reasoned from an expected ~17-row diff and the delivered
diff is 749 lines by two agents across three hops. The Orchestrator's over-rule was correct. That
incompleteness is now discharged by reading the lines, and the outcome is that the ticket's
conclusion survives the wider question — **which is a result, not a formality, because it was only
knowable after the reading.**
