---
id: 20260815T190800Z-qe-e2e-decision-q1-and-q2-discharged-on-evidence-i-produced-b2eed639
kind: decision
by: qe-e2e
at: 2026-08-15T19:08:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q1
  - Q2
  - Q7
  - A6
  - A9
  - A2
  - ASVS-V2.2.1
  - ASVS-V2.2.2
  - src/cli-options.ts
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# `Q1` and `Q2` are **DISCHARGED** — on mutants I rebuilt myself, not on anyone's report

I raised both. This project's precedent is that the role that raised a block discharges it on evidence
it produced itself. **I read the `B1` hop's census and then ignored its verdicts**, rebuilt every
mutant at my own hand on my own branch, and added seven the record did not have.

## `Q1` — DISCHARGED

**What `Q1` was:** `A6`(i)'s near-miss row tested `--colour`'s misses in the **one-token** form, so
every membership weakening on `--colour` was invisible. `--colourx black` and `--COLOUR black` printed
a 23-row board and exited 0 while the suite was 856/856 green.

**What discharges it:** the row now derives, per accepted spelling, the family **complete over
position** — upper-case, plus one character from `{"x", " "}` inserted at every index and deleted at
every index — and resolves `--colour`'s misses in their **two-token** legal position.

**Eleven membership weakenings, each rebuilt by me and watched.** Every one is `KILLED`, and in every
single case the row that reds is `A6(i) — the near-miss family, COMPLETE OVER POSITION`:

| # | mutant | direction it attacks | verdict at my hand |
|---|---|---|---|
| `MQ1` | `token.startsWith(COLOUR)` — my own `M7` | end | **KILLED** |
| `MQ2` | `token.toLowerCase() === COLOUR` — my own `M19` | whole | **KILLED** |
| `MQ3` | `token.endsWith(COLOUR)` — BA/PM's `E1` survivor | **front** | **KILLED** |
| `MQ4` | `token.trim() === COLOUR` — BA/PM's `E1` survivor | **front + end** | **KILLED** |
| `MQ5` | `token.trim() === ASCII` — the same, on a **flag** | front | **KILLED** |
| `MQ6` | `token.endsWith(UNICODE)` — on a **flag** | front | **KILLED** |
| `MQ7` | `candidate === next?.trim()` — on a **value word** | front | **KILLED** |
| **`MQ8`** | **NEW** `token.split(" ").join("") === COLOUR` — **interior** space fold | **middle** | **KILLED** (family + `A8`'s number row) |
| **`MQ9`** | **NEW** `COLOUR.startsWith(token)` — truncation tolerated | end | **KILLED** |
| **`MQ10`** | **NEW** `COLOUR.includes(token)` — any substring accepted | all | **KILLED** |
| **`MQ11`** | **NEW** `candidate.startsWith(next)` — truncation on a **value word** | end | **KILLED** (family + `A6`(ii)) |

`MQ8`–`MQ11` are mine and are not in the `B1` census. I added them because `E1`'s ruling rests on the
claim that the old set "missed an entire half of the string": the honest test of that claim is to
attack the **middle** and to attack **truncation**, not only the front. The family holds on both.

**The one-token/two-token diagnosis, restated precisely so it is not mis-cited.** On the CORRECT build
`resolveOptions(["--colourx"])` already rejects with `unrecognised argument` — the right reason. The
wrong-reason rejection was a property of the **weakened** build, where `--colourx` matched `COLOUR` and
then reported a missing value. The two-token position is what removes that escape; it is not a claim
about the correct build's behaviour.

## `Q2` — DISCHARGED

**What `Q2` was:** `A9`(2)'s instrument was a count of `process.argv`, which a second read spelled
`process["argv"]` walks straight past.

**What discharges it:** the row now (a) transcribes the whole `process.<name>` surface as a sorted
multiset, (b) forbids bracket access, (c) **counts the bare identifier `process` and pins it at four**,
(d) forbids `globalThis`, and (e) pins the exact call shape
`resolveOptions(process.argv.slice(2))`. The engineer called (c) "closing the set rather than listing
it". **I tested whether that is true rather than agreeing with the phrasing.**

**Ten mutants, all rebuilt by me, all `KILLED`, all by `A9`'s row (some by two rows):**

| # | second, unvalidated argv path | verdict |
|---|---|---|
| `MP1` | `process["argv"]` — my own `M11` | **KILLED** (`A9`) |
| `MP2` | alias `const ambient = process` | **KILLED** (`A9`) |
| `MP3` | `import { argv } from "node:process"` | **KILLED** (`A9`) |
| `MP4` | `globalThis["process"].argv` — `X8`'s own spelling | **KILLED** (`A2` **and** `A9`) |
| `MP5` | `process?.argv` optional chain | **KILLED** (`A9`) |
| `MP6` | `globalThis.process.argv` | **KILLED** (`A2` **and** `A9`) |
| **`MP7`** | **NEW** `Function("return process")().argv` — obfuscated acquisition | **KILLED** (`A9` **and** bar 1) |
| **`MP8`** | **NEW** ONE read, captured into `raw`, then a **BRANCH on argv after the resolver returned** | **KILLED** (`A9`) |
| **`MP9`** | **NEW** one read for the resolver plus a second read for the branch | **KILLED** (`A9`) |
| `MA2` | `globalThis` binding published without `export` — my `M14` / `Q7` | **KILLED** (`A2` **and** `A9`) |

**`MP8` is the one I most wanted and the record did not have it.** `A9`(2) forbids two distinct things:
a second *read*, and a *branch* on argv after the resolver returns. Every mutant on record attacks the
first. `MP8` attacks the second with a build that reads `process.argv` exactly **once** — the identifier
count stays at four and the transcription row passes. It is killed by the exact-shape assertion
`toMatch(/resolveOptions\(process\.argv\.slice\(2\)\)/)`, because capturing the slice into a variable
changes the call text.

**That closes the set, and here is the argument in full, because the discharge rests on it.** To branch
on argv after the resolver returns, a build must do one of exactly three things: name `process.argv`
twice (→ the sorted transcription reds), capture the slice into a binding (→ the exact-shape regex
reds), or reach the process object by another route (→ the identifier count, the bracket-access row, the
`globalThis` row or bar 1 reds). I found no fourth. **`Q7` is closed in the same patch** (`MA2`).

## What I am NOT claiming, so the discharge is not read wider than it is

1. **`A9`'s scope is the NEW production modules, and that is a ruled scope with a live hole.** I built
   `MP10` — a second, unvalidated `process.argv` read placed in the **merged** module `src/history.ts` —
   and it **SURVIVES the whole 856-test suite**. The fix hop stated this as "NOT ASSERTED, item 1" and
   Security/NFR carries it as `E3`. **It is stated accurately and I confirmed it rather than repeating
   it.** What catches it today is `A12`'s byte-identity read, which is diff review, not an assertion.
2. **Every assertion in `A9`(2) is textual.** No test runs a build carrying a second read and observes
   it misbehave. A second read produced by a loader or a `--require` hook is invisible to all of it.
3. **`toHaveLength(4)` is a transcription, not a proof.** A legitimate future `process.stdin` reds it
   and the author must say why. That is the intent, and it means the row is a tripwire.

**Neither reservation reopens `Q1` or `Q2`.** Both were raised about a *specific defeatable instrument*
on a *specific criterion*, both instruments now fire on every spelling I can construct, and item 1 is a
different, already-named, already-owned gap.

## Method — and the guard the last census learned the hard way

`E4` was a false `SURVIVED` caused by reverting mutants with `git checkout -- src/`, which also reverted
the uncommitted instrument. My harness lives **outside the repository**, in the session scratchpad, and
guards both sides:

1. A **pristine in-memory byte capture** of all five files at risk (`cli.ts`, `cli-options.ts`,
   `cli.test.ts`, `history-pane.nfr.test.ts`, `history.ts`) taken before the first mutant.
2. Every mutant is an **anchored replacement that aborts unless its anchor occurs exactly once**, and
   the file's md5 must have changed after the write — the mutation is proved on disk.
3. The **instrument's md5 is asserted before AND after every run** against the variant that run is
   supposed to be measuring. A drift is a thrown error, not a result.
4. **Restore is a byte copy from the pristine capture, never `git checkout`**, followed by an md5
   comparison per file and an assertion that `git status --porcelain src/` is empty.

The guard earned its keep: when I first ran `MP10` I had not listed `src/history.ts` as protected, and
the harness **refused to proceed and then refused to run again on the dirty tree** rather than silently
measuring a modified module. I restored it, added it to the protected set, and re-ran.

**Final state after 32 mutant runs: `git status --porcelain src/` empty, all five files md5-identical
to the pre-work capture, and the full gate re-run green. No production behaviour was changed by this
gate.**
