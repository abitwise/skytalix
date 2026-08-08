---
id: 20260808T201000Z-security-nfr-observation-ee58ca2c
kind: observation
by: security-nfr
at: 2026-08-08T20:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - ABC-018
  - EPIC-002
  - EPIC-006
  - RISK-005
  - src/glyph-mode.ts
  - src/render.ts
  - agent-factory/checklists/security-nfr-checklist.md
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - 20260807T121000Z-security-nfr-observation-9da8e1c0
  - 20260808T182200Z-ba-pm-decision-69e00126
supersedes: 
---

# The "no security trigger" claim RE-DERIVED: the RULING holds, and EVERY CLAUSE OF ITS STATED REASON IS WRONG

The ticket's `## Security / NFR triggers` says, in full:

> **No security trigger.** It reads two environment variables and a boolean. It writes nothing and
> interprets no user text.

The subtask was explicit that this is not to be taken on the ticket's word, and named the precedent:
`ABC-014`'s gate **corrected** such a claim rather than ratifying its wording. **The ruling holds —
nothing here blocks. The reason does not, and it is wrong three times in one sentence.** Reported as
observed, because the sentence a later reader inherits is the sentence that has to be true.

## Clause by clause, against measurement

| The ticket says | Measured |
|---|---|
| *"reads **two** environment variables"* | **THREE** — `LC_ALL`, `LC_CTYPE`, `LANG`, recorded by a `Proxy` on `process.env` that traps every `get`. The **fourth wrong count on this ticket**, and the first one to appear in the section this gate audits |
| *"and **a boolean**"* | `process.stdout.isTTY` is **`undefined`** on a pipe, on a regular file and on `/dev/null` — three of the four sink shapes measured, and the only shapes production presents outside a terminal. It is a boolean **only on a real terminal**, which is exactly why `Boolean()` is in the code |
| *"**interprets no user text**"* | It **does** interpret user-influenceable text: three environment values, matched against `/utf-?8/i`. `process.env` is a real ambient data source and **`src/glyph-mode.ts` is the FIRST module in `src/` to read it** — verified across every production module in `src/`, comments included |

*"It writes nothing"* is the one clause that survives: **0 bytes to stdout and 0 to stderr**, counted
around every path.

## WHAT ACTUALLY HOLDS THE PROPERTY, and it is stronger than what the ticket claims

**THE RETURN DOMAIN IS CLOSED.** Every path through `selectGlyphMode` returns one of two *module
literals*, `"ascii"` or `"unicode"`. The environment values are used only as **match subjects** and
are **never returned, never emitted, never embedded in a message**. So no byte from the environment
can travel through this module into anything downstream — which is the same load-bearing property
`ABC-014`'s gate proved for the frame (*"the output alphabet is closed"*), one layer up.

It was measured, not argued. **138 hostile locale values × 3 rungs × 2 TTY states:**

- ANSI `ESC[31m` / `ESC[2J` sequences and an OSC title-setting payload;
- raw C0 control bytes, a NUL byte, a CRLF header-injection payload;
- shell metacharacters (`; rm -rf /`), command substitution (`` $(id) `id` ``), a format string
  (`%s%n%x%p`), path traversal, a SQL fragment, a `<script>` tag;
- a `__proto__`-bearing JSON payload and the literal string `__proto__`;
- 10,000-character and **1,000,000-character** values, matching and non-matching;
- Unicode confusables (`ＵＴＦ－８`) and an RTL-override prefix.

**Result: 0 threw, and the return domain over all 138 is exactly `{ascii, unicode}`.**

Two smaller properties fell out of the same campaign and are recorded so nobody re-checks them:

- **`/utf-?8/i` carries no `lastIndex`** — it has no `g` flag, and six identical calls return the
  same answer. The module's comment says this and the comment is right.
- **No ReDoS.** The pattern has no nested quantifier; a **5 MB** value scans in **1.55 ms**, linear.
  Environment size is OS-bounded anyway. Not a finding, and no requirement is engaged (`V1.3.12` is
  **L3**, outside the active set).

## ONE REAL PROPERTY FOUND — a GADGET, the environment sibling of the one `ABC-014`'s gate found

`src/glyph-mode.ts:87` — `const value = signals.env[name];` — is an **unguarded prototype-chain
lookup**, and **the real `process.env` falls through to `Object.prototype`.** Measured with a
**live null control in both directions**, because this module's default answer is `unicode` and a
"polluted with a UTF-8 value" result would have looked like a hit while proving nothing:

| State | Session answer |
|---|---|
| real `LANG=en_US.UTF-8` own property, `LC_ALL`/`LC_CTYPE` **not own**, unpolluted | `unicode` |
| **`Object.prototype.LC_ALL = "C"`** — a rung the environment does not own | **`ascii`** |
| pollution deleted | `unicode` again |

So the polluted rung is **consulted** and **outranks the real `LANG`**: `hasOwn(process.env,
"LC_ALL")` stays `false` throughout while `process.env.LC_ALL` reads as `"C"`.

**And under pollution the value need not be a string, which makes attacker CODE reachable:**
`UTF8.test(value)` coerces with `ToString`, so a polluted rung carrying `{ toString() {...} }`
**runs the attacker's function — measured, 1 invocation through the real `process.env`** — and a
`toString` that throws escapes `beginGlyphModeSession` as an **uncaught `Error`**.

**Four things bound it, each verified rather than argued:**

1. **A REAL environment can never hold a non-string.** Assigning an object to `process.env.LANG`
   stores the string `"utf-8"` — Node coerces on assignment, measured. The ToString path is
   reachable **only** through prototype pollution or a hand-made `env` object.
2. **There is NO prototype-pollution sink anywhere in `src/`.** Every production module scanned with
   comments stripped: no `__proto__` write, no `JSON.parse`-into-merge, no `Object.assign` onto a
   user key. The only computed writes in the codebase are `position.board[i] = n` into a
   `Uint8Array` — numeric indices on a typed array, not a sink. The precondition cannot be created
   from inside this project. Same conclusion `ABC-014`'s gate reached, re-derived here.
3. **The reachable return domain under pollution is still exactly `{ascii, unicode}`.** The gadget
   can flip which glyph table a board draws with. **It cannot inject a byte** — measured over six
   polluted values including an ESC sequence and a path-traversal string.
4. **The flags cannot be polluted at all.** They arrive as own properties on the signals object, and
   an own `false` shadows a polluted `Object.prototype.ascii = true` — measured.

**LOW, and it does not block.** It is a gadget in the prototype-pollution sense, reachable only from
a position that already owns `Object.prototype` — in a single-process Node application, a position
from which most of the process is already reachable.

## The ONE failure mode this module has, and it fails CLOSED rather than fail-safe

`selectGlyphMode` contains no `throw`, and 138 hostile string inputs produced none. The only way an
exception leaves this module is an ambient read that itself throws — measured with a hostile getter
and with a throwing polluted `toString`, both of which escape `beginGlyphModeSession` **uncaught,
with no log and no context about which variable was being read**.

**That is worth naming precisely because of what this ticket is for.** `RISK-005`'s mitigation is
the ASCII fallback, and ASCII is the *fail-safe* direction — a wrong ASCII board is legible. An
exception out of the session is the one outcome that is **neither** direction: no board at all. **No
fix is asked for here** — at this layer there is no logger and no caller, and wrapping a read that
can only fail under an already-polluted prototype is the impossible-scenario handling `AGENTS.md`
rule 8 forbids and that `ABC-014`'s gate declined for the same reason. It is carried as an accepted
risk against `EPIC-006`'s startup path, where a throw meets a user.

## ASVS L1 — 70 active requirements, judged rather than padded

`security.asvs_level` is **L1**, so the active set is the **70 L1 requirements** of the 345 in
`agent-factory/checklists/security-nfr-checklist.md` — counted at the source (V1:8, V2:4, V3:8,
V4:2, V5:4, V6:13, V7:6, V8:4, V9:4, V10:5, V11:3, V12:3, V13:1, V14:2, V15:3; **V16 and V17 carry
no L1 requirement at all**, checked and not assumed). **Twelve are judged individually below; 58 are
structurally N/A with the reason stated per chapter.**

| Requirement | Verdict | Evidence |
|---|---|---|
| **V1.2.5** — protect against OS command injection | **PASS on evidence** | **Zero process operations**, measured under Node's permission model with a positive control (`execSync` → `ERR_ACCESS_DENIED`) and with `child_process` call-counted at 0. This is the requirement that would have been engaged had the module shelled out to `locale` — which the ticket forbids by name and which is absent |
| **V1.3.2** — no `eval()` or dynamic code execution | **PASS on evidence** | No `eval`, `new Function`, `require` or dynamic `import()`; and the module-load recorder measured **zero modules loaded**, which is stronger than a grep |
| **V2.1.1** — documentation defines the input validation rules | **PASS on evidence** | The five-row precedence table, the `## Scope` bullet defining "set" as **non-empty**, criterion 14, and the module header. Worth recording: this requirement was **weaker before 2026-08-08's second pass**, when empty-vs-unset lived only in a code comment |
| **V2.2.1** — input validated to business expectations | **PASS on the environment input** | Positive validation against a pattern (`/utf-?8/i`) with a defined outcome for every non-match and a safe default; the **closed return domain** measured over 138 hostile values is the proof that no unvalidated input escapes. **NOT ENGAGED on the flags** — they arrive as booleans and argv is `EPIC-006`'s; see the counterfactual below |
| **V15.3.1** — return only the required subset of a data object | **PASS on evidence** | Measured: at most **3 named keys** read, **zero enumerations**, **zero** environment reads at all on a non-TTY sink, and a two-literal return domain — no environment content is returned |
| **V1.2.1 / V1.2.2 / V1.2.3 / V1.2.4** — output encoding for HTTP/HTML/XML, URL, JS/JSON, SQL | **PASS by analogue** | ASVS 5.0 enumerates those contexts and **has no terminal-output requirement**. Same treatment `ABC-014`'s gate gave; the nearest-in-spirit control is met by the closed return domain |
| **V13.4.1** — no source-control metadata in what is deployed | **DEFERRED, not passed** | Packaging, `EPIC-006`. Unchanged and **not relaxed** by this ticket; already recorded in `plans/nfr-catalog.md` |
| **V15.1.1 / V15.2.1** — documented remediation timeframes for 3rd-party components | **NOT MET at project level — carried override restated** | Severity overridden from the L1 default **`high`** to **`low`**, with the reason: **zero runtime dependencies** (`dependencies` is `{}`) and this ticket adds none — `package.json` and the lockfile are **untouched on this branch**, verified. Owner **Architect/Design, at `EPIC-006`**. This is a prior override restated with its evidence re-checked, **not a new one taken here** |

**N/A with reasons, by chapter.** V3 (8) and V4 (2) — no HTTP, no browser, no cookie, no header, no
CORS. V5 (4) — no file is read, written, uploaded or named. V6 (13), V8 (4), V9 (4), V10 (5) — no
authentication, authorization, token or OAuth surface exists anywhere in this project. V11 (3) — no
cryptography in this closure. V12 (3) — nothing connects to anything. V14 (2) — no sensitive data
exists in this project to protect. V1.3.1 / V1.5.1 — no HTML sanitizer, no XML parser. V2.2.2 /
V2.3.1 — no client/server split and no multi-step user flow.

**V7 Session Management (6) is N/A, and it is named rather than skipped, because the keyword
matches.** ASVS V7 is about **authentication sessions and session tokens**. This module's "session"
is a process-lifetime constant with no user, no token, no login and no timeout. Nothing in V7
applies, and a reader grepping for "session" should find this sentence rather than a silent gap.

## `ABC-014`'s BANKED COUNTERFACTUAL: half DISCHARGED by this ticket, half still LIVE

`ABC-014`'s gate recorded `V2.2.1` as **NOT ENGAGED** for `renderBoard` and banked the condition:
*"the moment `EPIC-006` wires an unvalidated flag string to `mode`, V2.2.1 IS engaged. Owner
`ABC-015`/`EPIC-006`, which owns the value."* `ABC-015` is now built, so that condition can be
checked rather than carried:

- **DISCHARGED — the `mode` half, by construction.** `beginGlyphModeSession` returns a value from a
  closed two-literal domain produced by this module's own literals. **If `EPIC-006` passes this
  module's output, no user-supplied string can ever reach `renderBoard`'s `mode` parameter** — the
  shortest plausible path `ABC-014`'s gate identified is closed. **The condition is stated rather
  than assumed: this holds only if `EPIC-006` passes `beginGlyphModeSession`'s output and not a raw
  flag string.**
- **STILL LIVE — the flags half, and it is `EPIC-006`'s.** `GlyphFlags` are **booleans** and argv
  gives **strings**. A non-empty string is truthy, so a naive `--ascii=false` passed through
  unconverted selects **ASCII silently**. That is `EPIC-006`'s conversion obligation, it is not a
  defect in this module, and it is recorded here so the decomposition inherits it rather than
  discovers it.

## What this gate did NOT re-open

- **The `Boolean()` comment.** QE called it false at runtime, the Orchestrator called it
  overclaiming and left it as an Engineer follow-up. This gate's own measurement **supports the
  Orchestrator's reading** — `process.stdout.isTTY` is genuinely `undefined` on three of the four
  sink shapes and genuinely `true` on a real pty, so the coercion is doing type-honesty work while
  being behaviour-equivalent, exactly as both said. **Nothing was edited** (coding rule 9) and the
  adjudication is not taken away from whoever owns it.
- **The empty-locale ruling**, the both-flags-true ruling, the criteria, the merge-order constraint
  and the pull order. None is a security or NFR question.
