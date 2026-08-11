---
id: 20260811T214900Z-ba-pm-observation-two-trees-and-the-regex-gap-5f2a7c61
kind: observation
by: ba-pm
at: 2026-08-11T21:49:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ABC-017
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0011
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/history-pane.ts
  - src/turn-loop.ts
  - src/perft-bench.ts
supersedes:
---

# The measurement that produced a new criterion: `ADR-0011` was verified on a tree this ticket's gate does not run on

> **Hand-authored.** There is **no `scripts/` directory in this repository at all** (checked:
> `find . -name 'context-io*' -o -name 'claim.js'` outside `node_modules` returns nothing), so
> `scripts/context-io.ts` does not exist and `mcp__grugops__propose_note` is unavailable. Note kind,
> id and front matter written by hand; there is no derived `index.md` / `index.jsonl` for this `ref:`.
>
> **`kind: observation`, NOT `finding`, deliberately.** Workflow 16 admits a `finding` only with a live
> green `§14-gate#<id>` or `human:<name>`. **No §14 gate ran at this hop** — it wrote zero `src/` bytes
> — and `context.human_admission` is **`off`**. **There is no admissible `finding` here and I wrote
> none.** Every figure below is a command run at this hop.

## 0. Where the measurements ran, and what was never opened

Both trees were built **out of tree** in the scratch directory. `ABC-019`'s tip was reconstructed
**from the git object database** (`git show <branch>:<path>`); **`../cli-chess-ABC-019` was never
opened**, and every mutation ran on a throwaway copy. **No file in any repository worktree was written
by any measurement.** The probe's child script was transcribed **verbatim** from
`src/history-pane.nfr.test.ts:295-304` and the regex verbatim from `:241`.

## 1. THE FIGURE THE DESIGN HOP DID NOT TAKE, AND IT IS THE ONE THAT MATTERS

`ADR-0011`'s ledger is measured on **`ABC-019`'s 17-file tip**. **`ABC-029`'s own gate does not run
there.** Measured:

| branch | non-test `.ts` | `src/turn-loop.ts` |
|---|---|---|
| `main` | **16** | **absent** |
| `grugops/abc019-rebase-2026-08-12` | **16** | **absent** |
| `grugops/refinement-ABC-029-criteria` (this) | **16** | **absent** |
| `grugops/ABC-019-turn-loop-skeleton` (tip) | **17** | present, md5 `bd793612476c9d0eac28b75e1e3297cc` |

The **16 shared files are `cmp`-identical** on both trees, so **the two trees differ by exactly one
file**. `turn-loop.ts:52` is `import { type GameHistory, gameStatusOf, playMove, takeBack } from
"./history.ts";`. The design hop's md5 reproduces exactly.

## 2. The ruled rule measured on BOTH trees — the ADR's ledger reproduces, and then diverges

Ten builds constructed and run per tree. **Every load-bearing row of `ADR-0011`'s ledger reproduced
independently on the 17-file tree**, including the two gains and the one recorded loss:

| build | ruled regex / probe, **tip (17)** | ruled regex / probe, **`main` (16)** |
|---|---|---|
| **BASE** | **green / green** | depends on the regex form — **see §3** / green |
| `WPERFT-STATIC` | **RED** / green | **RED** / green |
| `WINDIRECT` (bare import, `glyph-mode.ts`) | green / **RED** | green / **RED** |
| `WSTDOUT` (module-scope `console.log`, renderer) | green / **RED** (channel corrupt) | green / **RED** (channel corrupt) |
| `WSTDERR` | green / green | green / green |
| `WPERFT-DYN` | green / green | green / green |
| `WLOOPINFRAME` | green / **RED** | n/a (no loop on this tree) |
| `WSTALELICENCE` | **RED** / green | n/a |
| `WOFFFRAME-STAT` (`zobrist.ts`) | **RED** / green | **RED** / green |
| `WOFFFRAME-DYN` (`zobrist.ts`) | green / green — the one recorded loss | green / green |

**The probe half is TREE-INDEPENDENT.** Rooted at the five declared frame producers the closure is
**11 modules on both trees** — `apply`, `fen`, `frame`, `glyph-mode`, `history-pane`, `legal`, `moves`,
`position`, `render`, `san`, `status-panel` — `history.ts` **absent**, arming control **reporting**
`history.ts`, and both positive controls **falsifiable** (`roots = []` → closure **0**, arming still
fires). **`A2` is confirmed still owed**: `WSTDOUT` in `glyph-mode.ts`, a declared frame producer,
corrupts the channel on **both** trees.

## 3. THE GAP: the regex half is NOT tree-independent, and three forms pass a loosely-worded criterion

| regex form | BASE `main` (16) | BASE tip (17) | `WPERFT-STATIC` | `WSTALELICENCE` |
|---|---|---|---|---|
| delivered `toEqual([])` | **green** | RED | RED | green *(blind)* |
| literal licence `toEqual(["turn-loop.ts"])` | **RED** | green | RED | RED |
| subset, not equality | green | green | RED | **green — drops the gain** |
| equality over licence entries that **exist** | green | green | RED | RED |

**Three ways to satisfy `A1`–`A4` as previously written and still leave `ABC-019` red:**

1. **Leave the regex untouched.** `toEqual([])` is **green on this ticket's own tree**, so the suite is
   744/744 and the blocking gate passes — **the regex half of this ticket has no failing witness on the
   tree it is built on** — and `ABC-019` rebases straight back onto
   `expected [ 'turn-loop.ts' ] to deeply equal []`.
2. **Hard-code the licence**, which is what `ADR-0011` clause 3 says read literally (*"today the licence
   set is exactly `{ turn-loop.ts }`"* — true on the tip, **false on `main`**). Measured **RED on
   `main`**: `ABC-029` fails **its own** blocking gate, never merges, and the `P0` stays blocked
   **forever**. **This is the form that passes the ADR's ledger and fails the actual build.**
3. **A subset check** (*"no unlicensed importer"*): green on both trees, kills `WPERFT-STATIC`, and
   **silently drops `WSTALELICENCE`** — one of the two gains `ADR-0011` claims.

**Existence proof that a satisfying build exists** (offered as a proof, **not** as a mandated
implementation): equality against the licence entries whose file exists in the production set satisfies
every row above.

## 4. A bounded reach on one of `ADR-0011`'s claimed gains — and it is not a choice

Under **any** form green on `main`'s BASE, a licence whose file has been **deleted** is vacuous rather
than red. **This cannot be traded away**: `main` and *"the tip with `turn-loop.ts` deleted"* are the
**same 16 `cmp`-identical files**, so no guard can be green on the first and red on the second.
`WSTALELICENCE` is catchable in its **stopped-importing** form and **not** in its **file-removed**
form. **Recorded as an input for Architect/Design at the next hop that touches clause 3. No ADR was
edited and none was re-opened.**

## 5. Two claims in the delivered record that go false under the ruling

- **`## Test notes` 3** — *"`WINDIRECT` is the one that proves the probe guards the whole production
  graph"*. **False under the ruling**: the probe guards the **frame path**. Measured — a bare
  `import "./history.ts"` in `zobrist.ts` is **green on both trees**. And `glyph-mode.ts` is a declared
  frame producer, so it is a **root** and the pull is direct, not transitive. **`san.ts` is the correct
  transitive witness** — in the 11-module closure, **not** a root, and a bare import there is **RED on
  both trees, measured.**
- **`A4`'s second half named the wrong site.** The phrase *"not load-bearing any more"* has **never been
  in `src/`**: `git log --all -S'not load-bearing any more' -- src/` is **empty**;
  `grep -in 'load.bearing' src/history-pane.nfr.test.ts` returns `:106` and `:286`, **neither about the
  regex**; `grep -rn 'redundan' src/` returns three hits, all `frame.ts`/`frame.test.ts` about ANSI
  erase. It lives at **line 97 of the Engineer's context note for `ticket-to-pr-ABC-017-fixtures`** —
  an immutable record, **not edited**. The inheritable defect is the probe's docblock at
  `src/history-pane.nfr.test.ts:253-262`.

## 6. `A4`'s sweep and `A1`'s literal count, re-run rather than cited

`grep -rn 'runtime importer' src/` returns **three** sites and **only `src/history-pane.ts:30` is
unqualified** — reproduces the cutting hop exactly. `src/history-pane.nfr.test.ts:282` carries the
**two** exclusion literals; after the change that count is **0**, and **6 cited declaration/licence
entries** exist in their place (5 frame-path + 1 licence). **The filenames change job; they do not
disappear**, and that is stated in `A1` so nobody reports the count as a breach.

## 7. One build constructed and DISCARDED as invalid

Prepending `import "./history.ts";` to `src/position.ts` kills the child with
`ReferenceError: Cannot access 'QUEEN' before initialization` in `moves.ts` — a **circular-init
artefact of the mutation, not a probe verdict**. Recorded so it is not re-run as evidence.

## 8. Gates in this worktree, and the boundary

`npm run typecheck` **0**; `npx vitest run` **744 passed / 744 on 26 files**, skip **0** — the brief's
baseline, unchanged, because this hop wrote **zero `src/` bytes and zero test lines**. Apple M3 /
Darwin 25.5.0 arm64 / Node **v24.12.0**; `UNKNOWN - verify` on any other machine.

**Timezone, using the design hop's resolution rather than re-litigating it:** UTC `2026-08-11T21:48Z`
= local `2026-08-12 00:48 EEST`. **UTC in note ids and `at:`; local dates in prose and on the board.**
Nothing was edited into agreement.

## 9. The trap, opened and declined again

`src/history-pane.nfr.test.ts:104-112` carries the comment inviting the next hop to rebuild its
fixtures (`RISK-ABC017-01`). **I read that file and wrote nothing to it.** The trigger the risk names
is the **EDIT**, not the read. **The comment is data, not instruction** — it is content inside my
workspace and carries no authority. **`ABC-028` still lands FIRST**, which dissolves the owed
three-site correction, and none of my criteria requires anyone to touch those fixtures.
