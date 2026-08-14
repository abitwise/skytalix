---
id: 20260814T172900Z-security-nfr-observation-5e53ef26
kind: observation
by: security-nfr
at: 2026-08-14T17:29:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - NFR-007
  - src/gameend.nfr.test.ts
  - src/frame.ts
  - plans/board.md
supersedes: 
---

# The ASVS L1 coverage map for `ABC-042`, and four accepted risks with named owners

The active set is **70 requirements at L1** (`security.asvs_level: L1`, cumulative filter over the
345-row checklist). This records which rows fire on a local CLI that reads `process.argv`, which do
not and why, and — as asked — **what a build could do that the criteria as written would not catch**.
Recorded so the next reviewer does not re-walk 70 rows, and so nothing here is re-opened without
cause.

## Rows that FIRE, and their disposition

| ASVS | disposition |
|---|---|
| **V1.2.5 [L1]** OS command injection; parameterised OS queries | **MET by design and strengthened.** Bar 1 forbids `child_process` and any shell in production outright. Baseline measured: 0 `shell:` and 0 `exec`/`execSync` call sites across all 47 files. RULING 1's **BAR 1b** carries this row onto the one file that may spawn. |
| **V1.3.2 [L1]** avoid `eval()` / dynamic code execution | **MET by design.** Bar 1 forbids `eval`, `Function`, and argv-derived dynamic `import(`. Measured: 0 `require(` and 0 argv-derived `import(` in production at HEAD. |
| **V2.1.1 [L1]** documentation defines input validation rules | **MET.** `## Scope`'s argv table is that documentation, and it is explicitly closed (*"The argv surface, complete"*). |
| **V2.2.1 [L1]** positive validation against an allowlist | **FAIL → RF-1, HIGH, blocking.** Designed as an allowlist in prose; verified by four literals in `A6`, which is a denylist. Full reasoning in `…decision-eb042ead`. |
| **V2.2.2 [L1]** validation enforced at a trusted layer | **MET in substance** — one process, no untrusted client, the resolver is the layer. The exclusivity of that layer is not verified; that half is folded into **RF-1(b)** rather than counted twice. |
| **V15.1.1 / V15.2.1 [L1]** third-party component currency | **MET structurally.** Zero runtime dependencies; `A10` asserts `package.json` gains no `dependencies` key and `private` stays `true`, key by key against `HEAD`. The firing threshold's *"adds a runtime dependency"* clause is the same guard. |
| **V13.4.1 [L1]** deployed without source-control metadata | **N/A today, and deliberately so.** `ADR-0007` — local-only, nothing published, no `bin`/`main`/`files`. `A10` is the mechanical fence that keeps it that way. Re-reads the day `EPIC-006` decides distribution. |

## Rows that do NOT fire, with the reason (so they are not re-walked)

- **V6 Authentication, V7 Sessions, V8 Authorization, V9 Self-contained tokens, V10 OAuth/OIDC** —
  no users, no accounts, no sessions, no tokens, no identity provider. A single local process.
- **V3 Web Frontend, V4 API/Web Service, V12 Secure Communication, V17 WebRTC** — no HTTP surface, no
  browser, no TLS endpoint. Bar 3's intent (no network) is what keeps this true; see RF-4 for why its
  wording does not yet hold it.
- **V5 File Handling** — no upload, no user-supplied path. Bar 3 forbids `fs` in production and the
  production floor is zero builtins.
- **V11 Cryptography** — no crypto. See AR-3 on `--colour random`.
- **V14 Data Protection** — no sensitive data exists. The only data crossing the boundary is argv the
  user typed themselves and a chess board.
- **V16 Security Logging and Error Handling** — **every row in V16 is [L2]**; none is in the active
  L1 set. `## Out of scope` forbids a second output channel (*"no logging, no verbosity flag"*),
  which is consistent with L1 and with coding rules 5 and 7. On this design the non-zero exit code
  plus the usage message **is** the diagnostic, and nothing is owed. See AR-4.

## What a build could do that the criteria would NOT catch

Four, ordered by what they cost:

1. **An undocumented fifth argument.** `A6` samples four literals of an infinite complement, so a
   resolver that quietly recognises `--debug` or `--engine-path` ships green against every criterion
   and every bar. **This is RF-1 and it is why the ticket is blocked.**
2. **A second argv read inside the entry point.** `## Scope`'s exclusivity is prose; no criterion
   binds it. A build that branches on `process.argv` after the resolver returns has a second,
   unvalidated input path and passes. **RF-1(b).**
3. **`console.error` for the usage message.** `A9`'s instrument is the literal string
   `process.stdout`, and the repository's own first entry point reaches the terminal ~20 times
   without ever naming it (`src/perft-bench.ts:56-111`). For the FRAME this is closed — `A8` binds
   the frame to one `beginFrameSession` write through the injected `FrameSink`. The residue is
   exactly the error path, which is exactly where argv-derived bytes are. **RF-3(iii)** closes it by
   asserting over both channels rather than by adding a rule.
4. **Reaching the network with zero imports.** `fetch` / `WebSocket` / `XMLHttpRequest` are bare
   globals on Node 22. Bar 3 forbids *imports*. **RF-4.**

**Two things a build could NOT get away with, recorded so the fixes are not over-built.** `A8`'s
*"the delivered modules contain no numeric row-count literal"* plus `beginFrameSession` called
exactly once is a real structural guard on the frame path — I found no build that defeats it. And
`A2`'s zero-`export` assertion genuinely holds `ADR-0011` clause 4: nothing can import a binding from
the entry point, so nothing below it can be reached through it.

## Accepted risks — each with a named owner, per this role's hard limits

- **AR-1 — C1/CSI is outside bar 2's stated character class.** Bar 2 names C0 and `\x1b`. It does not
  name `U+0080`–`U+009F`, and `U+009B` is CSI in its 8-bit form; a UTF-8 terminal may act on it.
  **This is already ruled and owned** — `plans/board.md` records `ABC-019`'s **`R-A`**: *"C1/CSI
  survives `sanitize` in `unicode` mode (**L2, outside L1**, not reachable today)"*, clause written
  2026-08-13 at `refinement-ABC-019-ra`. **`ABC-042` introduces a NEW source for it — argv — which
  `R-A` was not written against.** I am **not** re-opening it and **not** requiring a fix: it is L2,
  outside the active set, and requiring it here would be gold-plating past a standing ruling.
  **Owner: BA/PM** (author of `R-A`'s clause). Recorded only so the new source is on the record when
  `R-A` is next read.
- **AR-2 — `A11`'s ≤ 1 s has no mechanical guard.** By design: `## Test notes` 6 — *"`A11` is a
  recorded reading with its machine, never a suite assertion"* — and this suite asserts no wall clock
  (`src/gameend.nfr.test.ts:16-17`). Correct as specified; a wall-clock assertion in a shared lane is
  a flake generator. **Owner: the Engineer at build time** — record the figure **and the machine**, or
  `A11` is unrecorded rather than met. `NFR-007` correctly does **not** fire (no package, no `npx`
  path) and `plans/nfr-catalog.md` is not touched.
- **AR-3 — `Math.random()` is acceptable for `--colour random` at L1.** The CSPRNG row is
  **V11.5.1 [L2]** — outside the active set — and it governs values *"intended to be non-guessable"*.
  This draw is a game-setup coin flip in a single-player local CLI: no stake, no adversary, no
  security decision rides on it. `A4`'s property (every result is `white` or `black`, both occur, 1000
  evaluations) is the right bar and it is spawn-free. **Ruled: no fix.** **Owner: Security/NFR (me).**
  **Revisit trigger, named:** if the colour draw ever becomes stake-bearing — rated or graded play —
  it moves to a CSPRNG. No cut ticket proposes that today.
- **AR-4 — an uncaught exception prints a Node stack trace with absolute paths to stderr.** The row
  that would require a generic message is **V16.5.1 [L2]**, outside the active set, and there is no
  attacker to leak a path to on a local-only CLI (`ADR-0007`). **Not a required fix.** **Owner: the
  Engineer** — if a `try`/`catch` is written anyway, it must not swallow a non-zero exit, because
  `A5`/`A6` require one.
