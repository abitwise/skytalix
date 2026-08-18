---
id: 20260818T200000Z-security-nfr-decision-the-security-review-checked-not-inherited-and-the-gate-verdict-e5f6a7b8
kind: decision
by: security-nfr
at: 2026-08-18T20:00:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - NFR-005
  - N8-LANE
  - NFR-008
  - src/engine.ts
  - plans/traceability.md
supersedes:
---

# The security review — **CHECKED, not inherited** — and the Security/NFR verdict on `ABC-078`:
**PASS_WITH_RISKS**, one required fix, three accepted risks with named owners

**This is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible on this
install, so this is a hand-authored `decision` per `agent-factory/contracts/context-note.md`. It
carries no `§14-gate#<id>` and it is **not** a human acceptance of anything.

---

## Part 1 — the ticket's "Security — not triggered" claim, checked against the delivered module

The ticket asserts: *"Security — not triggered. No input surface; the budget is a number from a
caller."* **I did not inherit that. I read the module and measured it.** `security.asvs_level` is
`L1`, `security.block_on` is `high`, `compliance_regime` is `[]` (so no Compliance Officer hand-off
is owed), worked through
`agent-factory/checklists/security-nfr-checklist.md` filtered to L1.

**CONFIRMED, and here is the evidence rather than the assertion.** `src/engine.ts` is 278 lines with
**eight imports, every one intra-repository** (`apply`, `evaluate`, `gameend`, `history`, `legal`,
`moves`, `position`, `search`, `turn-loop`), and its whole public surface is `chooseMove`,
`createEngine`, `DEFAULT_BUDGET_MS`, `NODES_PER_CLOCK_CHECK` and three types.

| exposure I went looking for | found |
|---|---|
| process / OS calls, `child_process`, spawn | **none** — verified by grep, and the module's only I/O of any kind is `Date.now()` |
| filesystem read or write | **none** |
| network, socket, URL, HTTP | **none** |
| `eval`, `new Function`, dynamic `import` of a computed path | **none** (V1.3.2 [L1] satisfied structurally) |
| new or changed dependency | **none** — `package.json` untouched by the delivered diff |
| secrets, credentials, tokens, env reads | **none** — `process.env` is not referenced |
| logging of anything | **none** — the module logs nothing at all |
| persisted state, global mutation | **none** — the position is byte-identical on return, verified by QE across 2 045 calls |
| data the change touches that it did not touch before | **none** — `src/turn-loop.ts` is byte-identical, so no existing flow reaches this code at all today |

**The two inputs are a `number` and a function, both supplied in-process by another module of this
same program. There is no untrusted source anywhere in the tree** — no CLI flag, prompt, file or
socket reaches `budgetMs`, and `EPIC-006` is the first ticket that could create one.

**Two L1 requirements are the only ones with any purchase on this change, and both are recorded
honestly rather than waved through:**

- **V2.2.1 [L1] — input validated to enforce functional expectations.** `budgetMs` is **not**
  validated: any `number` is accepted and no valid range is documented. At L1 this requirement
  focuses on *"input which is used to make specific business or security decisions"*, and `budgetMs`
  makes neither — it makes a latency decision, from a trusted in-process caller. **Not a failed
  requirement. It is nevertheless the exact hole the `NFR-004` clause-B fix closes**, so it is
  discharged by a fix that was already required for another reason.
- **V2.4.1 — anti-automation / resource exhaustion.** This is the requirement the non-termination
  below would fail. **It is [L2] and this install is L1**, so it is out of scope here, and I am
  saying that plainly rather than reaching for it to inflate a finding.

**No ASVS L1 requirement is failed by this change. There is no high-severity security finding, and
`security.block_on` is `high`.**

## Part 2 — is non-termination on `budgetMs: Infinity` a SECURITY concern or a DOCUMENTATION one?

**Ruling: it is a DOCUMENTATION and robustness concern, not a security concern.** Reproduced by me
in a child process: `budgetMs: Infinity` still running at 20 s (killed); a clock that never advances
still running at 12 s (killed).

**Why not security — three reasons, and the first is dispositive:**

1. **There is no attacker-reachable path to the input.** A denial-of-service finding requires an
   adversary who can supply the input. `budgetMs` comes from a sibling module of a local
   single-user CLI that deploys nowhere (`ADR-0007`). **The only party who can hang this process is
   the person running it on their own machine, and they already have a keyboard with `Ctrl-C` on
   it.** "The user can make their own program spin" is not a security finding; calling it one
   devalues every real one in this catalog.
2. **The failure mode is benign as failure modes go.** It is a CPU spin on the calling thread — no
   corruption, no leak, no privilege change, no data exposure, and the process stays healthy. The
   position is unmutated the whole time.
3. **It is an obviously invalid input with no caller.** Coding rule 8 says do not handle impossible
   scenarios, and QE's `G6` correctly declined to request a guard.

**What IS owed is the two comment lines QE asked for**, and they are folded into the `NFR-004`
repair hop: `budgetMs` states its valid range, and `Clock` states that it must be a real-time,
non-decreasing source. **The seam exists precisely so something other than `Date.now` can be
injected later, and the next person to inject one is the person this comment is for.** Note that
the clause-B clamp **incidentally fixes the `Infinity` half outright** (`Math.min(Infinity, 5000)`
= 5 000); the frozen-clock half is a precondition on an injected clock and stays a documented
requirement, not a guard.

**Severity: LOW.** Owner of the documentation debt: the `NFR-004` repair hop.

## Part 3 — the rest of the non-functional review, briefly and honestly

- **Reliability / fallback.** `chooseMove` returns a legal move at any budget down to one already
  spent — QE attacked this with 409 positions and 2 045 real-clock calls: 0 null, 0 throws, 0
  illegal, 0 mutated positions. `null` only where no legal move exists, which the turn loop's exit
  test means the seam never sees. **Sound.**
- **Logging and monitoring.** The module logs nothing, and **I am not asking it to.** A pure
  in-process function in a local CLI with no operator and no incident channel gains nothing from a
  log line, and `EngineChoice` already returns `depth`, `nodes` and `elapsedMs` — the diagnostics a
  caller would actually want are **returned values**, which is better than a log. Recorded so that
  "a failure mode with no log" is not later read as an oversight here: **there is no unobservable
  failure mode in this module.**
- **Compliance.** `compliance_regime` is `[]`; no regime applies and nothing hands to a Compliance
  Officer.
- **Deployment posture.** Untouched. Nothing is built, emitted, published or installable;
  `production_requires_human_confirmation` remains `true` and this gate did not go near it.

---

## THE VERDICT: **PASS_WITH_RISKS**

**Not `BLOCKED`:** the only required fix is MEDIUM and `security.block_on` is `high`; no ASVS L1
requirement fails; live exposure of every issue below is **nil** today because nothing in the
shipped tree constructs an engine and `src/turn-loop.ts` is byte-identical.

**Not a clean `PASS`:** `NFR-004`'s 5 s clause — a merged bar — **is breached by construction**, and
a bar nobody enforces is not a bar.

### One REQUIRED FIX

| # | severity | what | where it is specified |
|---|---|---|---|
| **RF-1** | **MEDIUM** | **`NFR-004`'s 5 s hard ceiling is not enforced.** `budgetMs >= ~5000` returns over 5 s; nothing in the tree records the constraint. **Owed by `ABC-078`, not by `EPIC-006`** — the ticket's `## Scope` claims the ceiling and `## Out of scope` defers only the *choosing*. Fix: an exported `HARD_CEILING_MS = 5_000`, one `Math.min` in `chooseMove`'s deadline, two comment lines, and one injected-clock assertion. **Not a validation, not a throw, not a margin.** | the `NFR-004` `decision` note in this task |

**One repair hop closes RF-1 and the `Infinity` half of QE's `G6` together.** It is production +
one test, both in `src/engine.ts` / `src/engine.test.ts`, and it touches no merged contract and no
other file.

### Three ACCEPTED RISKS, each with a named owner and a discharge route

| id | risk | severity | owner | discharge |
|---|---|---|---|---|
| **`AR-NFR004-A`** | `NFR-004`'s ≤ 3 s clause missed by ≤ 31 ms (≤ 1.03%) on 27–29 of 30 calls, by abort granularity. Also covers the ~3 ms residual over the 5 s ceiling that survives RF-1's clamp. | LOW | **Security/NFR at `EPIC-006`'s difficulty hop** (`ABC-087` if earlier) | pass ~2 900 ms and the clause becomes literally true at zero cost, or re-accept in writing with the number. **Never by editing the row.** |
| **`AR-N8LANE-078`** | `N8-LANE` missed: ~840 ms CPU net against 650 ms (1.29x; 6.5% of the 13 s clause). Inside `ABC-025`'s 1.6x precedent. | LOW | **Architect/Design** (owner of `NFR-008` and its accounts) | the lane re-measurement in `OQ-1`, where this 840 ms is one input |
| **`AR-ENGINE-DOC`** | `chooseMove` does not terminate on `budgetMs: Infinity` or on a non-advancing injected clock; the module documents no valid range for either input. | LOW | **the RF-1 repair hop** | the two comment lines; the clamp closes the `Infinity` half outright |

### One OPEN QUESTION handed on, and it is the biggest thing this gate found

**`OQ-1` — the default lane sits at or over `NFR-008`'s 13 s CPU clause, and it did so BEFORE
`ABC-078` arrived** (13.400 s measured here without this ticket's file; 12.2–13.1 s measured by the
engineer from a different machine state). **This is a finding about the LANE, not about this
ticket.** It is `NFR-008`'s own 2026-08-13 forecast — ~7 files of planning headroom — arriving on
schedule with nobody watching. **Owner: Architect/Design.** It wants a ticket: re-measure under the
row's protocol on a quiet machine, restate against the clause, and rule. **Until it is ruled,
`N8-LANE` cannot honestly be granted to any ticket — a 5% slice of a spent total is not a slice of
anything.** Cutting that ticket is BA/PM's and the Orchestrator's, not mine.

### What I did NOT do

**I did not fix and I did not write tests** — every reading above came from throwaway scratchpad
probes and out-of-tree copies; **not one repository file under `src/` was modified, moved or
reverted at any point in this hop.** **I did not weaken a bar to make anything pass:** `NFR-004`'s
two clauses, `NFR-005`'s FAIL floor and PROVISIONAL WARN level, `NFR-008`'s 3 s / 13 s and
`N8-LANE`'s 650 ms are all byte-identical after this hop, and the eight table rows in
`plans/nfr-catalog.md` hash to `63f66795…ca31` before and after — unchanged. **I did not re-open
`ABC-077`'s merged guards or the negamax duplication** — QE ruled the duplication correct under
merged constraints and I accept that ruling without re-litigating it. **I did not merge, did not
deploy, and did not open `plans/board.md`.** The `In Security/NFR` → `Ready for UAT` move is the
Orchestrator's on this project.
