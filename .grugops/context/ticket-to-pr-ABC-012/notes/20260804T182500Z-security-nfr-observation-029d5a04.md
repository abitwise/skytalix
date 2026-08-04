---
id: 20260804T182500Z-security-nfr-observation-029d5a04
kind: observation
by: security-nfr
at: 2026-08-04T18:25:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-019
  - ABC-001
  - EPIC-003
  - EPIC-006
  - src/history.ts
  - src/fen.ts
  - package.json
  - coverage/
  - .gitignore
  - tools/grugops/test-skip-integrity.js
  - .grugops/test-skips.md
  - 20260804T161000Z-qe-e2e-observation-5bbcc35c
  - 20260804T143000Z-software-engineer-observation-a3758376
supersedes: 
---

# The ticket says there is NO security trigger. This gate TESTED that statement, and it holds — here is what it was tested with, and the one place it is only true *today*

The ticket's `## Security / NFR triggers` says: *"No security trigger. No injection sink, no trust
boundary, no privilege, no data exposure, no user-supplied string reaches this module."* That is an
assertion, not evidence. This gate treated it as a hypothesis and attacked it.

## 1. The ASVS L1 tier is JUDGED, not padded — 12 of 70 reachable, and the delta is stated

`security.asvs_level` is `L1`, so the active set is **70 requirements** (counted from the checklist,
not recalled). **58 of them are structurally N/A on this change** and the reason is one sentence per
block rather than 58 rows of "N/A":

- **V3 Web Frontend (8 L1), V4 API and Web Service (2), V6 Authentication (13), V7 Session
  Management (6), V8 Authorization (4), V9 Self-contained Tokens (4), V10 OAuth/OIDC (5), V12 Secure
  Communication (3)** — 45 requirements about HTTP, browsers, cookies, credentials, sessions, tokens
  and TLS. This change has **no HTTP surface, no browser, no user, no account, no session, no token
  and no socket.** There is no runnable program at all until `EPIC-006`.
- **V5 File Handling (4 L1)** — no upload, no download, no path is constructed anywhere in the
  module's transitive closure.
- **V14 Data Protection (2 L1)** — there is **no sensitive data in this system**: the entire data
  content is a chess position and a move list. Zero PII, zero credentials, zero secrets, zero
  regulated data. `compliance_regime` is `[]`, so no Compliance Officer hand-off is owed
  (Section 13).
- **V11 Cryptography (2 of 3 L1: V11.3.1, V11.3.2)** — no encryption, no block modes, no padding.
- **V1 output-encoding half (5 of 8 L1: V1.2.1, V1.2.2, V1.2.3, V1.3.1, V1.5.1)** — no HTML, no XML,
  no URL, no JSON and no template is produced or parsed anywhere in the closure.

**That leaves 12 requirements that are genuinely reachable, and each was judged from evidence:**

| ASVS L1 | Verdict | Evidence |
|---|---|---|
| **V1.2.4** database/SQL injection | **PASS by absence of sink** | No database, no query language, no ORM anywhere in the closure |
| **V1.2.5** OS command injection | **PASS by absence of sink** | Zero `child_process` / `exec` / `spawn` across all 8 modules of the closure |
| **V1.3.2** `eval()` / dynamic code execution | **PASS by absence** | Zero `eval`, zero `new Function`, zero `require(`, zero dynamic `import()` |
| **V2.1.1** documented input-validation rules | **PASS for `initialFen`, PARTIAL for `plies`** | FEN rules are documented and enforced by `parseFen`; **no documented rule exists for `takeBack`'s ply count** |
| **V2.2.1** input validated to business/functional expectations and logical limits | **NOT ENGAGED TODAY — see §4** | `plies` is unvalidated and destroys the game on `NaN`. **There is no untrusted input reaching it today**, and no caller at all |
| **V2.2.2** validation at a trusted service layer | **PASS by construction** | One in-process layer; nothing is delegated to an untrusted client |
| **V2.3.1** flows in expected order without skipping steps | **PARTIAL — see §5** | `playMove` does not verify the move belongs to the current position |
| **V11.4.1** approved hash functions for cryptographic use | **N/A with the reason stated** | `zobristKey` is a **non-cryptographic position-identity hash**. It signs nothing, authenticates nothing, derives no key and seeds no secret — its only consumer is repetition counting (`src/gameend.ts:155`). A Zobrist collision is a wrong draw verdict, which is a **correctness** risk, not a security one |
| **V13.4.1** no source-control metadata deployed | **N/A for this change** | Nothing is deployed and nothing is packaged until `EPIC-006`. The related hygiene item (`coverage/` tracked and unignored) is in §6 |
| **V15.1.1** documented remediation time frames for 3rd-party components | **`UNKNOWN - verify` — pre-existing repo gap** | No such documentation exists in this repository. **Not introduced by this ticket** and not this ticket's to write |
| **V15.2.1** only components inside those time frames | **PASS** | **Zero runtime dependencies** (`package.json` has no `dependencies` key at all); five devDependencies, and `package.json` + `package-lock.json` are **byte-identical to merged `main` 39e260d** |
| **V15.3.1** only the required subset of fields returned | **PASS with an observation** | `GameHistory.position` is deliberately published as a live borrow (SEAM 1). There is no privilege boundary to over-expose across; the risk is **corruption, not disclosure**, and the documented borrow contract is the control — whose doc comment is wrong (§7) |

**This is a judged subset with its delta stated, on the `ABC-011` gate's precedent, and not a re-run
of 70 rows.** Padding it would have produced 58 rows of ceremony and would have hidden the two that
matter.

## 2. Verified STRUCTURALLY, not by reading the ticket

The transitive import closure of `src/history.ts` was rebuilt rather than assumed — **8 modules**:
`history`, `apply`, `fen`, `gameend`, `legal`, `moves`, `position`, `zobrist`. **Every import in the
closure is relative and inside `src/`. There is not one non-relative import.**

Searched across that whole closure: **zero** `node:` builtins, `child_process`, `require(`, `eval(`,
`new Function`, `process.env`, `globalThis`, `__proto__`. No filesystem, no network, no environment,
no serialization sink, no logger, no secret, no privilege check.

One precision the ticket's Scope earns rather than loses: `history.ts` does **not** import `legal.ts`
directly, exactly as stated — but `legal.ts` **is** in the transitive closure via `gameend.ts`.
`san.ts` is not reachable at all. Both statements on the ticket are true as written.

## 3. Hostile input, actually fed to the module — 12 payloads

`newGame(initialFen)` is the module's **only** external string input. It was attacked rather than
reasoned about:

| payload class | result |
|---|---|
| empty / whitespace | `FenError: FEN must have 6 fields` |
| `__proto__` JSON payload, `__proto__` in the placement field, `constructor/prototype` | `FenError` — rejected |
| 10,000-character string | `FenError` — rejected in 0.005 ms, no hang |
| control bytes, shell metacharacters (`; rm -rf /`), path traversal (`../../../../etc/passwd`), SQL (`' OR 1=1 --`), `<script>` | `FenError` — every one rejected |
| **counters beyond `Number.MAX_SAFE_INTEGER`** (`999999999999999999999`) | **ACCEPTED** — see below |

**PROTOTYPE POLLUTION: none.** `Object.prototype` is unmodified after all twelve. **No hang, no
crash, no unhandled throw** — every rejection is a typed `FenError`.

**The one that got through is in `src/fen.ts`, not in this ticket's module, and it is flagged not
fixed.** `parseFen` accepts a syntactically-valid but out-of-range integer counter: the resulting
`halfmoveClock` is `1e+21`, `Number.isSafeInteger` is **false**, `toFen` round-trips it as the string
`"1e+21"` so **FEN round-trip byte-identity breaks**, and `gameStatusOf` on that history returns
`{"result":"draw","reason":"seventy-five-move"}` — **the game is over before it starts.** Negative,
non-numeric, exponential and hex counters are all correctly rejected, so the validation is present
and this is a **range** gap, not a missing control. It is `ABC-001`'s merged, `Done` code, out of
this ticket's scope, and `AGENTS.md` rules 9 and 12 say flag it rather than fix it here. Severity
**LOW**: no caller passes an attacker-controlled FEN today.

## 4. The V2.2.1 ruling — and why this gate does NOT call it an L1 failure today

This is the load-bearing judgement of the whole gate, so the reasoning is written out rather than
asserted.

`takeBack(history, NaN)` silently discards the entire game (full evidence in this gate's `claim`
note). Under ASVS **V2.2.1** an unvalidated input used for a business decision is an L1 requirement,
and this role's own rule is **L1 fail → HIGH by default**, which under `security.block_on: high`
would **BLOCK this ticket**. So the question had to be answered honestly and not conveniently.

**It is not an L1 failure today, and the reason is a fact this gate measured rather than an opinion:
the input surface does not exist.** Re-derived here — `src/history.ts` has **zero production
importers**, and there is **no call to `takeBack` or `playMove` anywhere outside `src/history.test.ts`**.
Nothing untrusted reaches this function; no trust boundary exists for a validation control to sit on;
the only callers are tests passing literals. ASVS scopes validation to input crossing into the
application from an untrusted source. **The requirement is not FAILED — it is NOT YET ENGAGED.**

**And this gate states the counterfactual plainly rather than banking the convenient half:** the
moment `ABC-019`'s turn loop wires a parsed ply count to this function, `takeBack` becomes an input
sink for untrusted data, **V2.2.1 is engaged, the default severity is HIGH, and it blocks.**
`Number.parseInt("abc")` is `NaN`, and this gate measured that the raw string `"abc"` destroys the
game too. That is not a deferral of a security control; it is a named trigger with a named owner,
recorded so `ABC-019`'s gate cannot claim it was not told.

**Today's severity: MEDIUM** — silent total data loss, no security boundary crossed. Under
`security.block_on: high` it does **not** block.

## 5. `playMove`'s unguarded precondition — the consequence is worse than "a corrupt board"

SEAM 1 priced a defensive `legalMoves` check at ~2–5 µs and left it out; the Engineer and QE both
carried the precondition forward. This gate fed it a move from a **different position** and looked at
what comes out the other end:

```
playMove(historyAnchoredAt "8/8/8/8/8/8/8/K6k w - - 0 1", aMoveFromTheStartPosition)
  -> accepted, no error. FEN becomes  8/8/8/8/8/2N5/8/K6k b - - 1 1   (a knight materialises)
  -> gameStatusOf then returns  {"result":"draw","reason":"insufficient-material"}
```

**It does not merely corrupt the board — it produces a confident, well-typed, WRONG terminal
verdict.** That is a stronger statement than "the board is corrupt", and neither prior note has it.
ASVS **V2.3.1** (flows proceed in the expected order without skipping steps) is the requirement it
sits under, and it is **PARTIAL** for the same reason as §4: there is no untrusted caller today. Not
re-opened here — SEAM 1's decision is priced and recorded — but it is now on the record with its
actual consequence. Owner: **Architect/Design at SEAM 1**, consumer **`ABC-019`**.

## 6. The coverage hazard — read BEFORE running coverage, and QE's mitigation confirmed on this gate's own run

QE named this for this column by name, and it was read first. Confirmed independently here:
`coverage/` holds **22 tracked files** and **is not in `.gitignore`** (checked, not recalled).

**QE's mitigation was used and then verified rather than trusted:**

```
npx vitest run --coverage --coverage.include='src/history.ts' \
  --coverage.reportsDirectory=<path outside the repository>
  -> src/history.ts 100 / 100 / 100 / 100   (threshold 0.8)
  -> git status --porcelain -uall coverage   EMPTY
  -> git diff --numstat 3a44b3f -- coverage  EMPTY
```

**`coverage/` is byte-identical after this gate's coverage run.** The hazard was not reproduced here
— QE reproduced it twice already under a controlled restore and this gate had nothing to add by
damaging tracked files a third time. **Flagged, not fixed**, agreeing with both prior roles: whether a
generated report belongs in git is a human's repository-hygiene call. The committed report is stale —
it predates `src/history.ts`.

## 7. The `src/history.ts:42` doc contradiction — CONFIRMED on this gate's own instruments, both halves

Both halves of QE's report were checked rather than inherited, and both hold:

- **"documented and tested" is FALSE.** Searched `src/history.test.ts` for any access to
  `position.board` or `.board[` — **none**. (Seven other test files do touch `position.board`; not
  one of them is about `history.position`.) The comment claims a test that does not exist.
- **The comment contradicts the shipped code, and this gate proved it by running it.** The comment
  says *"do not hold the reference across a `takeBack`"*. Measured: a held reference is
  `=== h.position` after `takeBack`, is **not stale**, and reads the **correctly rewound** position —
  because `resetTo` rebuilds the borrowed object **in place**. The comment forbids what the code makes
  safe.

The comment errs in the **safe** direction, so it is not a defect and not a blocker. But `ABC-019` is
the first caller and will read one of the two documents. **Named, not fixed** — it is production-code
text, and this gate does not write production logic.

## 8. Reliability and logging — checked, and the honest answer is that a log is the wrong control here

`src/history.ts` logs nothing. Searched the whole of `src/` for production logging: the only
`console.*` in the repository is `src/perft-bench.ts`, a CLI benchmark harness. **There is no logger,
no metric and no observability surface in this project at all.**

The role's standing concern is that *a failure mode with no log is the incident no one can diagnose
later*, and this module has **two silent failure modes** (§4 and §5). **Requiring a log here would be
gold-plating and this gate does not require one:** there is no logging infrastructure to log into, no
operator to read it, and — decisively — **the correct control for both failure modes is a guard that
refuses the input, not a line that records the corruption after it happened.** That is what §4 and §5
ask for, and it is what is on the record as owed at `ABC-019`.

## 9. Availability — the one denial-of-service question this module can be asked

There is no rate limit and no quota, and neither is warranted: there is no network, no user and no
shared resource. The one real question is unbounded growth, since `moves` is the only structure that
grows and every derive is `O(plies)` with **no memoization** (SEAM 2).

Measured: **300 plies → `repetitionCounts` in 92 µs, 299 distinct keys**, linear with a constant
offset (17.5 / 44.4 / 92.0 µs at 40 / 120 / 300). A chess game bounds the ply count in practice, and
`gameStatus` itself declares a draw at the 75-move rule long before the derive matters. **Not a
denial-of-service surface.**

## 10. The test-integrity checker — re-run, and recorded as an ERROR

Run exactly as Workflow 05 step 3 specifies, on this gate's own shell:

```
$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
Error: cannot read the registry file: .grugops/test-skips.md
exit=2
```

`.grugops/test-skips.md` does not exist (confirmed with `ls`). **Exit 2 is "the checker could not
run", which Workflow 05 makes an error distinct from a clean fail, and it must never be read as a
pass. It is recorded here as exactly that** — for the third time on this ticket, by the third role,
each running it independently.

It is not a gate failure, for the three reasons the Engineer gave and QE confirmed, each re-derived
here: exit 2 is not the exit-1 short-circuit; the suite's skip count is **0**, captured at this gate
with the `AGENTS.md` command (`.numPendingTests + .numTodoTests` = 0, over 226 total / 226 passed /
0 failed); and **the registry is human-owned — an agent may not self-author a justification to clear
its own gate, and none was created here.**

**The standing reporting gap is confirmed and carried forward rather than allowed to evaporate:** no
board entry or trace row in this project has ever mentioned this checker, only the raw skip count.
This gate's board comment and trace row now mention it, which closes the gap for this ticket and not
for the project.
