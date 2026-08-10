---
id: 20260810T134755Z-security-nfr-observation-bb69e963
kind: observation
by: security-nfr
at: 2026-08-10T13:47:55Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-018
  - NFR-002
  - src/san.ts
  - src/san.test.ts
  - src/san.nfr.test.ts
  - agent-factory/checklists/security-nfr-checklist.md
supersedes: 
---

# The security half: all 628 new lines read for the one question, and the answer is UNTRIGGERED — with the module's whole exposure surface MEASURED rather than argued

The ticket claims *"No security trigger. Input is a `Move` from the generator and a `Position`; no
user-supplied string reaches this module."* That is a claim about 628 lines nobody at this gate had
read. All 628 were read here (`src/san.ts` 148, `src/san.test.ts` 371, `src/san.nfr.test.ts` 109),
and the claim holds. What follows is what makes it a measurement instead of a repetition.

## The trigger list, walked

None of the role's triggers is touched: no authentication, no 2FA, no biometrics, no payments, no
banking, no investment data, no personal data, no GDPR surface, no public API, no file upload, no
admin action, no database migration, no queue or event, no external integration. The one trigger
that IS live is the performance-sensitive flow, which is the other half of this gate.

## What the module can reach, verified at the source rather than by grep alone

`src/san.ts` imports exactly `./apply.ts`, `./legal.ts`, `./moves.ts`, `./position.ts` — asserted by
`A20` on both the runtime namespace and the source text, and re-read here. Inside it: no `eval`, no
`Function`, no `require`, no dynamic `import`, no `node:fs`, no `node:child_process`, no network, no
`process.*`, no timer, no signal handler, no logging call, no `try`/`catch`, no allocation beyond
strings and three booleans. **It accepts no string parameter of any kind**, so there is no input a
user could supply even in principle — the two inputs are a `Position` (a byte board) and a `Move`
(six integers).

**No dependency was added.** `git diff --stat main..HEAD -- package.json package-lock.json` is EMPTY,
re-run here rather than inherited.

## The one security-adjacent quantity this module hands downstream, MEASURED

`ABC-018` carries this epic's real terminal-escape risk, and `plans/nfr-catalog.md`'s `NFR-002` block
records that an **unbounded supplied string** is the one way that frame budget can be busted today
(400,000 characters = the whole 16 ms). `toSan`'s output goes into that frame. So the question worth
measuring is what it can emit — and it was measured, not assumed:

```
positions                                8,478   (six perft positions expanded TWO plies, the 18
                                                  acceptance FENs, P60, P-QUEENS)
SAN strings rendered                   351,644
MAX LENGTH                                   7   ("axb8=Q#")
distinct characters                         27   #+-12345678=BKNOQRabcdefghx
code-point range                     0x23–0x78   (printable ASCII only)
control bytes / ESC / DEL / C1 / >U+007E     0
purity across the whole corpus            held
```

**The output is bounded at 7 characters and is pure printable ASCII.** That closes, for this
module's contribution, both the unbounded-string frame-buster and the escape-injection class —
`toSan` cannot emit an ESC byte, a C0 byte, `U+007F`, or any code point above `U+007E`, because the
only two string sources in the file are a five-entry piece-letter table and `squareName`. Recorded
with its numbers because "it's just chess notation" is an argument, and this is a measurement.

## Three things a reader could reasonably call risks, checked and NOT reported as risks

- **The transient mutation has no `try`/`finally`.** `suffix` does `makeMove` → ask → `unmakeMove`.
  If anything in between threw, the caller's `Position` would be left silently corrupted with no log.
  **Checked instead of assumed: `grep -n "throw" src/apply.ts src/legal.ts src/moves.ts
  src/position.ts` returns NOTHING.** There is no reachable exception site inside the window, so the
  hazard has no way to fire; adding a `finally` would be `AGENTS.md` rule 8 (no impossible-scenario
  handling). **No fix is asked for.** Recorded so the next reader does not re-derive it.
- **`src/san.test.ts` reads a file.** `readFileSync(new URL("./san.ts", import.meta.url), "utf8")` at
  line 289 — test-only, a fixed URL relative to the module itself, no user input, no path traversal
  surface, no write. It exists to assert `A20`'s import set against the source text, which is the
  only way to catch an import a runtime namespace check cannot see.
- **Two regexes.** `SAN_SHAPE` (line 343) and `/\bfrom "([^"]+)"/g` (line 290). Both linear: no
  nested quantifier, no alternation inside a repetition, no backreference — **no ReDoS**. Both are
  applied to inputs the module itself produced (≤ 7 characters and a 148-line file), never to
  supplied data.

## ASVS, filtered to `security.asvs_level` = `L1` (70 of 345 requirements)

The L1 set is HTTP, browser, authentication, session, token, OAuth, file-upload, crypto and TLS
requirements. **A pure in-process function with no I/O, no string input and no state engages none of
them.** The three worth naming rather than waving through:

- **`V1.3.2` (no `eval` / dynamic code execution)** — PASS, verified at the source.
- **`V2.2.1` (input validated to enforce functional expectations)** — the module validates NOTHING
  and says so: both preconditions are declared caller obligations in its header, and `## Scope`
  declares behaviour on an illegal `move` explicitly undefined. `V2.2.1` at L1 scopes itself to
  *"input which is used to make specific business or security decisions"*; a `Move` produced by this
  repository's own generator is neither, and there is no trust boundary between generator and
  renderer. **Not a fail — but it is the item that must travel with the first caller**, and it is
  named in this gate's risk table rather than closed here.
- **`V15.1.1` / `V15.2.1` (third-party component remediation windows)** — this board's standing
  `high` → `low` override, owner **Architect/Design at `EPIC-006`**. Its evidence was re-checked here
  and is unchanged: `package.json` and `package-lock.json` are byte-identical to `main`, and the
  external oracle QE used was installed into a scratchpad outside the repository. **The deferral is
  untouched and NOT relaxed.**

`V13.4.1` (source-control metadata not deployed) is likewise untouched and unaffected — nothing
deploys (`ADR-0007`). `V16` (Security Logging and Error Handling) contributes **no L1 row at all** to
the filtered set, so this module's silence is not an L1 failure; the logging question is carried in
the risk table for the first caller instead.

**Security result: PASS. Zero findings, zero required fixes, no severity of any level.**

## What this half did NOT check

- **The 68 expected strings against the FIDE/PGN specification text.** Not a security question and
  not re-opened here; QE's external-oracle hop is the strongest evidence on it and its own limit
  stands.
- **Anything about `ABC-018`'s message region.** That is where this epic's real user-string risk
  lives and it is that ticket's, already gated.
- **The scratchpad instruments of the three earlier hops.** They are not committed and are not in the
  delivered diff; nothing was re-run from them.
