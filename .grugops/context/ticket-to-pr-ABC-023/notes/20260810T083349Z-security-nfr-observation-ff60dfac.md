---
id: 20260810T083349Z-security-nfr-observation-ff60dfac
kind: observation
by: security-nfr
at: 2026-08-10T08:33:49Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - NFR-001
  - NFR-002
  - NFR-003
  - NFR-004
  - NFR-005
  - NFR-006
  - NFR-007
  - plans/nfr-catalog.md
  - src/moves.ts
  - 20260810T082408Z-orchestrator-decision-5e9c6b73
supersedes: 
---

# The NFR half is UNTRIGGERED, and the premise that makes it untriggered was re-derived here rather than inherited — all seven rows checked, `npm run perft` deliberately NOT run

The brief told this gate not to re-measure and to record the bars as untriggered **with the
structural reason**. Recording an inherited reason would be the same ritual in a different costume,
so the one load-bearing premise — *"every bar in `plans/nfr-catalog.md` is a production-code bar"* —
was checked at the source. It holds.

## The premise, re-derived from each row's own `Applies to` cell

```
row       category      Applies to                                              test-suite bar?
NFR-001   Performance   legal move generator, the search hot path + gameend.ts   NO — production
NFR-002   Performance   one full frame of the terminal renderer (EPIC-002)       NO — production
NFR-003   Performance   input prompt and controls (EPIC-003) + ABC-012 derives   NO — production
NFR-004   Performance   engine move search (EPIC-004)                            NO — production
NFR-005   Performance   engine search loop (EPIC-004)                            NO — production
NFR-006   Cost          opening book artifact (EPIC-005)                         NO — artifact
NFR-007   Performance   CLI cold start / packaging (EPIC-006)                    NO — production
```

**Not one of the seven attaches to test-suite runtime, CI duration or the developer feedback
loop.** That was the specific way the byte-identity argument could have failed — a suite-runtime
bar would be moved by 66 added tests no matter how many production lines changed — and it does not
exist here. The three config-level dials are checked too and none is reachable: `nfr.perf_p95_ms`
300 has no endpoint to apply to, `nfr.a11y_target` WCAG-2.2-AA has no UI surface until `EPIC-006`,
and `nfr.availability` is already ruled `not-applicable-local-only`.

## The structural fact, measured twice by this gate

```
md5 -q src/moves.ts   BEFORE this gate's runs   6335b452fc21ffe2d0f902ecab930840
md5 -q src/moves.ts   AFTER  this gate's runs   6335b452fc21ffe2d0f902ecab930840
git diff --name-only main -- src/                src/moves.castling.hardening.test.ts  (one file)
git diff main --stat -- src/                     1 file changed, 749 insertions(+)
git diff -U0 main -- src/ | removed lines        0
git status --short src/                          clean
```

Zero production lines. No changed code path, no allocation, no branch in any inner loop. Every one
of the seven bars is therefore measured against a production tree that is **byte-identical to
`main`**.

## Why `npm run perft` was NOT run, stated as a decision and not as an omission

A throughput re-measurement here would compare `main` against `main`. Its result is knowable before
it runs, and a gate whose verdict is knowable in advance teaches every later reader that gate
numbers are decoration. `NFR-001`'s count-based discharge on `ABC-009` — the two added byte compares
executing 198,175 times each and rejecting nothing — is untouched by a test-only change **by
definition**, and it is cited here, not re-derived, exactly as the ticket says.

**The brief's invitation to over-rule was taken seriously and declined on the evidence**, which is a
different thing from complying. The byte-identity argument was tested for the one way it could
break (a bar whose denominator is the test suite rather than the product) and that way is closed.

## The one perft run that IS owed, and it was run

`PERFT_DEEP=1` is a standing correctness bar under `A4`, not a throughput bar, and it is cheap:

```
PERFT_DEEP=1 npx vitest run src/perft.test.ts    32 passed / 32   EXACT, 46.92 s
```

Third independent run of that lane on this ticket (37.73 s engineer, 53.36 s QE, 46.92 s here). The
spread across the three is wall-clock scatter on a shared laptop and **no throughput claim is made
from it** — this is a count bar, and the count is 32/32 exact all three times.

## What this observation does NOT establish

- **Not that `NFR-001` was re-measured.** It was not, deliberately. Its standing figures and its
  `ABC-009` discharge stand untouched and un-re-derived by this hop.
- **Not that the added tests cost nothing.** They cost about 0.1 s of suite time (559 → 625 tests,
  1.10 s total). No bar governs that quantity, which is why it is recorded as a measured fact and
  not as a bar result.
- **Nothing about `ABC-009`.** Not reopened, not re-measured, no verdict touched.
