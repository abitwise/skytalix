---
id: 20260816T011500Z-security-nfr-decision-abc041-four-clauses-and-the-clause-b-misreading-4c1e77a3
kind: decision
by: security-nfr
at: 2026-08-16T01:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-041
  - ABC-042
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/cli.ts
supersedes: 
---

# `ABC-041`'s four clauses, each answered on my own measurement — and clause (b) does NOT read the way `ABC-066` says it does

Hand-authored per `AGENTS.md` § Role / workflow files. **No `kind: finding` and no `§14-gate#<id>`
stamp** — `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this repository
and from the kit, and `context.human_admission` is `off`. QE's `Q5` records the same limitation and
it is referenced, not restated. Everything below is a `decision` or an `observation`.

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0**. Branch
`grugops/security-nfr-ABC-066`, off `grugops/ticket-to-pr-ABC-066` @ **`8fb6ff1`**, in a **linked
`git worktree`**; the shared checkout holds `main` @ `c13e5a4` and was not moved.

**The subtask told me to test the ticket's reading of clause (b) rather than ratify it. I did, and
the reading is wrong.** The outcome is unchanged — the gate fired and here it is — but the reasoning
on the page is not one a later ticket should inherit.

---

## Clause (a) — Runtime dependency. **DOES NOT FIRE.** Measured

> *Fires if `package.json` gains a `dependencies` key, or if `package.json` / `package-lock.json` is
> touched at all.*

Both halves of the clause's own instrument, run by me:

```
git diff --numstat ab0864e~1 ab0864e -- package.json package-lock.json   ->  0 lines
git diff --name-only 4e9ed1d HEAD  -- package.json package-lock.json     ->  0 paths   (whole branch)
node -e 'Object.hasOwn(require("./package.json"),"dependencies")'        ->  false
```

Neither manifest is touched by the delivered commit **or anywhere on the branch**, and there is no
`dependencies` key at all — the package has **zero runtime dependencies**. **(a) does not fire. The
ticket is correct.**

## Clause (b) — Production capability. **IT FIRES. The ticket says it does not, and the ticket is wrong**

> *Fires if **any non-`.test.ts` file under `src/`** — this module or any module in its runtime
> closure — imports a Node builtin, reads `process.`, or calls `spawn`/`exec`/`fetch`/`eval`/
> `new Function`.*

**`ABC-066` gets the SUBJECT right and the TENSE wrong.** Its wording is *"(b) does not fire on its
own subject, which is CAPABILITY, not file-touched"*, and it then answers a **delta**: *"no Node
builtin import is added, no new `process.` read, no `spawn`/`exec`/`fetch`/`eval`/`new Function`."*

The clause contains **no delta language anywhere**. Its verb is *"Fires if any non-`.test.ts` file
under `src/` … **reads** `process.`"* — a **state** predicate over the tree, present tense, not a
predicate over the diff. Its parenthetical instrument is a whole-tree `grep -r` over `src/`, not a
`git diff`. So the ticket is right that the subject is capability rather than file-touched — that
much is a genuine and useful correction — and wrong that the answer is therefore "does not fire."

**The state, measured on this branch's tree (20 production files, 50 `.ts` total):**

| clause (b) limb | production-only measurement | fires? |
|---|---|---|
| imports a Node builtin | `grep -rlE 'from "node:' src/ \| grep -v '\.test\.ts'` → **EMPTY** | no |
| **reads `process.`** | **7 files**: `frame.ts`, `turn-loop.ts`, `perft-bench.ts`, **`cli.ts`**, `status-panel.ts`, `glyph-mode.ts`, `render.ts` | **YES** |
| calls `spawn`/`exec`/`fetch`/`eval`/`new Function` | 1 grep hit, `src/cli-options.ts:7-8` — the **words** "spawning"/"spawn" in a doc comment, **0 call sites** | no |

`src/cli.ts` alone reads **`process.argv`, `process.exit`, `process.exitCode`, `process.stderr`,
`process.stdout`**. The clause's middle limb is satisfied by the subject module itself. **(b) fires.**

### This is not a quibble — the clause's own instrument under-covers its own body

Clause (b) has a **three-limb body** and a **one-limb parenthetical instrument** (`grep 'from "node:'`
only). The parenthetical also predicts *"`ABC-042` is the hop that ends it"* — and **`ABC-042` did
not end it.** `ABC-042` added `process.` reads, **not** a `node:` import; the `node:` grep is
**still empty today across all 20 production files**, exactly as it was when the clause was written.
So a hop that runs only the printed command concludes (b) is clean, while the clause's own sentence
says it fires. **The instrument and the body disagree, and they have disagreed since `ABC-042`
merged.**

### The precedent is against the ticket, and it is `ABC-042`'s own page

`ABC-042` § Security reads: *"**triggered, and NOT waived** — the first production module in the
repository that reads `process.argv` (verified: **zero** occurrences in all 18 production files at
HEAD)."* That is the **state** reading applied to the **same limb** on the **same module**, by the
hop that created the condition, and it was accepted at that gate. `ABC-066` now reads the same limb
on the same module and reaches the opposite answer. **Both cannot be right, and `ABC-042`'s is the
one that matches the clause's words.**

### What actually saved this ticket

`ABC-041`'s closing sentence — *"Whichever way a reading is disputed, it fires and the gate resolves
it"* — and `ABC-066`'s own echo of it, *"Disputed either way, it fires and the gate resolves it."*
**The fail-safe worked. The reasoning above it did not.** A future BA/PM who copies `ABC-066`'s
clause-(b) paragraph **without** its closing sentence has a page that argues the security gate away.
Recorded as `S1`.

### Ruled: (b) FIRES, and is then CLEARED on the merits

Firing is not failing. (b) fires, so the gate runs; the gate ran; and the capability is **cleared**,
because the capability surface of `src/cli.ts` is **byte-identical before and after** this change:

```
                       ab0864e~1                        ab0864e
imports                5, all relative first-party      5, IDENTICAL (no node: builtin either side)
process.* reads        argv, exit, exitCode,            IDENTICAL, same 5 names, same 10 occurrences
                       stderr, stdout
spawn/exec/fetch/      0                                0
  eval/new Function
exports                0                                0
```

The capability `src/cli.ts` holds is `ABC-042`'s — merged, reviewed at ASVS L1, `BLOCKED` on `RF-1`
and discharged on measurement 2026-08-14. **This ticket adds none of it and removes none of it.**
The delivered production diff is **one string literal and a six-line doc comment**, nothing more.

## Clause (c) — Test-lane capability beyond existing precedent. **DOES NOT FIRE.** Measured

> *Fires if a **test** file in the diff introduces a capability this lane does not already hold:
> network, a filesystem write outside a temp dir, or a new `child_process` spawn.*

Measured over `src/cli.test.ts` at the branch tip, and over the **added lines** of the diff:

| capability | file state | **added by this diff** |
|---|---|---|
| network (`node:http/https/net/dns/tls`, `fetch(`) | **0** | **0** |
| filesystem **write** (`writeFile*`, `mkdirSync`, `rmSync`, `unlink`) | **0** | **0** |
| new `child_process` spawn | `spawnSync` only, **1 call site**, argv-**array** form | **0** |
| `node:` builtins imported | `node:child_process`, `node:fs`, `node:process` — all pre-existing | **0** |

`git diff ab0864e~1 ab0864e -- src/cli.test.ts | grep '^+' | grep -cE 'node:|spawnSync|exec|fetch|writeFile|shell:'`
→ **0**. Not one added line introduces any of them. `node:fs` is read-only over the repository's own
source, which clause (c) names as **explicit precedent**. **`ABC-042` bar 1b re-verified**: `exec(`
call sites **0**, `execSync(` call sites **0**, `shell:` **0** — the three grep hits at
`src/cli.test.ts:16-17` are the module docblock's **prose describing the rule**, not call sites.

**`spawned` is 10 and the fence is intact**: `expect(spawned).toBe(10)` at `:836`, and `CHILDREN` has
exactly **10** entries — `npmRun, white, black, random, conflict, difficulty, shortFlag, badColour,
bareWord, escape`. My own campaign added **no child to the repository**: every probe ran out of tree.
**(c) does not fire. The ticket is correct.**

## Clause (d) — Blast radius. **DOES NOT FIRE.** Measured

> *Fires if the diff touches any file under `src/` other than this module, its test file and the one
> probe-root line.*

```
git diff --name-only        ab0864e~1 ab0864e   ->  src/cli.test.ts, src/cli.ts        2 paths
git diff --numstat          ab0864e~1 ab0864e   ->  92 0 src/cli.test.ts / 7 2 src/cli.ts
git diff --diff-filter=A    ab0864e~1 ab0864e   ->  0                                  0 new files
git diff --numstat ab0864e~1 ab0864e -- src/cli-options.ts  ->  0 lines
```

Two paths, the module and its test file, nothing else under `src/`. `src/cli-options.ts` — the
vocabulary — is **untouched**, so `ACCEPTED_ARGUMENTS` cannot have moved. The `7 2` on `src/cli.ts`
is **6 doc-comment lines added + 1 removed** and **1 code line added + 1 removed**: the whole
production change is one string literal, and I read the diff rather than inheriting the count.
**(d) does not fire. The ticket is correct.**

---

## Summary of the four clauses

| clause | ticket says | **my ruling** | agree? |
|---|---|---|---|
| (a) runtime dependency | does not fire | **does not fire** — 0 manifest lines, no `dependencies` key | **yes** |
| (b) production capability | **does not fire** | **FIRES** — state predicate; 7 production files read `process.`, `src/cli.ts` among them. Fires, then **CLEARED**: capability surface byte-identical | **NO** |
| (c) test-lane capability | does not fire | **does not fire** — 0 network, 0 fs writes, 0 new spawns, 0 added lines carrying any of them | **yes** |
| (d) blast radius | does not fire | **does not fire** — 2 paths, 0 new files, `cli-options.ts` untouched | **yes** |

**Three of four confirmed on my own measurement. One overturned.** The correction changes no
verdict on `ABC-066` — (b) firing means the gate runs, and it ran — and it is recorded so the
sentence does not propagate.

## Stop conditions: none fired

No acceptance criterion of `ABC-066` needs re-wording, so nothing routed to BA/PM as a blocker.
**No merged `ABC-042` row has to move** — re-measured, `git diff ab0864e~1 ab0864e -- src/cli.test.ts`
is `92 0`, purely additive, **0 deleted content lines**. No HIGH was reached, so nothing was
softened to let a merge through. `ABC-041`'s page is **not edited by me** — it is merged and `Done`,
and `S1` is a routed recommendation, not an edit.
