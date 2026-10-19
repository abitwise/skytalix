---
id: 20261019T085500Z-security-nfr-observation-abc167-triggers-and-qe167g-bracket-access-baba8a03
kind: observation
by: security-nfr
task: secnfr-ABC-167
at: 2026-10-19T08:55:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - QE-167-g
  - ADR-0036
  - ADR-0044
  - ADR-0027
  - R-167-1
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - 20261018T211300Z-qe-e2e-decision-abc167-recheck-verdict-pass-with-gaps-c02ebd96
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
supersedes:
---

# ABC-167 at `660a0d50`: triggers (a)-(d) confirmed not triggered; QE-167-g ruled ACCEPTED RISK (R-167-1, LOW)

Hand-authored and unsealed: this install has no `context-io.ts`. Read through git objects and the scratch
worktree `../wt-secnfr-ABC-167`, detached at `660a0d50` and removed at the end of the hop. Config: `asvs_level`
L1, `block_on` high, `compliance_regime` [].

## Triggers, against base `e286526d`..tip `660a0d50`
- **(a)** `git diff --name-only e286526d 660a0d50 -- src package.json package-lock.json` lists only
  `src/uci-session.ts` and `src/uci-session.test.ts`. No manifest. **Not triggered.**
- **(b1)/(b2)** the canonical instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs e286526d 660a0d50 {1,2,3}`:
  every limb gives (b1) 0, 8 new edges (`apply`, `coordinate-move`, `engine`, `fen`, `levels`, `position`,
  `search`, `transposition`), 0 reaching a holder, **0 word hits on added lines**. Each limb: "does not fire".
  **Not triggered.**
- **(c)** the test imports `node:fs` (`readFileSync`, A11's own source read), `vitest` and local modules. No
  `child_process`, no spawn. **Not triggered.**
- **(d)** only the two named files under `src/`. `src/uci-session.ts` is unchanged `6922f772..660a0d50`; the
  hop added 59 lines to the test only. **Not triggered.**

## The tip itself is clean of the evasion
`src/uci-session.ts` holds no `globalThis`, `global`, `Reflect` or `.constructor`. Its only computed property
reads are `clock[keyword]` (keyword is one of six literal branches, never free input), `clock["btime"|"wtime"]`,
`clock["binc"|"winc"]`, `PROMOTION_LETTERS[move.promotion]` and `LEVELS[DEFAULT_LEVEL]`. **No UCI input selects
a property, an import or code.** There is no `eval`, no `Function`, no dynamic `import()`. So no line a GUI sends
can reach a global. M40 and M42 exist only as source edits.

## QE-167-g ruling: **ACCEPTED RISK R-167-1, LOW**
- **What it is.** A11's guard is a text tripwire, not a sandbox. `globalThis["process"]` (M42) and
  `globalThis["Math"]["random"]` (M40) pass it, tsc and biome. A text check cannot close this (`globalThis["pro" + "cess"]`
  and `({}).constructor.constructor(...)` defeat any token list), so no exact text check is required here.
- **Why accepted, not a required fix.**
  1. The actor is a future source edit, not an input. Every such edit is a diff that a human reviews and merges.
  2. That diff meets ADR-0036's canonical instrument. It **lists `globalThis["process"]` as a limb-2 word hit**
     (`/\bprocess\b/` on an added line, the instrument's line 31 names computed forms), and a disputed word hit
     fires under the fail-safe (`AR-072-WORDHIT`). So M42 is visible at the gate that routes, even though A11 is blind.
  3. The session is capability-free by D2 and holds nothing to protect. The capability lives in ABC-168's entry
     point, which fires (b1) on `process.`/`node:readline` and routes through `In Security/NFR` anyway.
  4. The next edit to this file is ABC-171 (`random`, `book`), and it passes the same gate.
- **The residual, stated plainly.**
  - **M40 is not a capability limb.** `Math.random` breaks ADR-0027's injected randomness (determinism), not
    the capability surface. The instrument gives no word hit for it. Only review catches `globalThis["Math"]["random"]`.
  - **An obfuscated form** (string concatenation, `.constructor` chains) evades both A11 and the word-hit list.
    Only human review catches it.
- **Severity LOW.** No ASVS L1 requirement fails: no input reaches the evasion, and the session holds no
  secret, no file and no network. **Owner: Security/NFR**, carried to the ABC-171 and ABC-168 gates. Each of those
  gates reads the clause-b word hits on `src/uci-session.ts` and greps the added lines for `globalThis`, `global`,
  `Reflect` and `constructor`.
- **Optional, not required.** ABC-171's BA/PM may add `globalThis`, `Reflect` and `.constructor` to A11's
  token list, as a cheap tripwire. This hop does not ask for a follow-up ticket.

## INFO (no fix)
`printableOf` drops C0 and DEL only, as the page rules (A4, `cli.ts` parity). So a C1 character such as U+0085 or
U+009B that the GUI sends is echoed back to the GUI inside an `info string`. No trust boundary is crossed, because
the sender and the reader are the same GUI. This is recorded for ABC-168's stdout-hygiene candidate row (iii)
(ADR-0044 § Consequences).
