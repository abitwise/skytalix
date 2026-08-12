---
id: 20260813T083000Z-security-nfr-artifact-ref-what-ran-what-was-written-and-everything-i-refused-to-absorb-e0c93f4b
kind: artifact-ref
by: security-nfr
at: 2026-08-13T08:30:00Z
refs:
  - ABC-028
  - ABC-026
  - ABC-029
  - ABC-019
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - .grugops/queue/done/security-nfr-ABC-028-scoped
verified_by:
confidence: high
supersedes:
---

# What ran, what was written, every fence that held, and everything this hop **refused to absorb**

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repository — there is no
> `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is not in
> this session's tools. So these notes were composed by hand against
> `agent-factory/contracts/context-note.md` and the neighbouring folders' convention. **There is no
> derived `index.md` / `index.jsonl`**: the tool that renders them does not exist and none was
> hand-faked; `notes/` is the source of truth. **`scripts/claim.js` does not exist either**, so the
> Workflow 17 step 2 claim was made **by hand** — see `claim.md`.
> **`context.human_admission` is `off` and no `§14-gate` verdict record exists under this task, so
> every note here is `observation` / `claim` / `artifact-ref`. NO `finding` WAS RECORDED AND NO STAMP
> WAS INVENTED.**

## Where this ran

**The main working tree, `HEAD` `0ee148e` (= `main` = `grugops/abc028-owed-2026-08-12`), READ-ONLY
throughout.** No build, no test run, no timing measurement, no worktree of my own created or removed.
`git worktree list` shows the QE re-gate's second worktree at `…/scratchpad/qe-regate-uniq-1/wt`;
**I did not enter it.**

## The claim, by hand (Workflow 17)

`.grugops/queue/claimed/` did not exist. **`mkdir -p` of the `claimed/` parent — which is NOT the
claim** — then a **bare `mkdir` (no `-p`) of `claimed/security-nfr-ABC-028-scoped/`, which IS the
atomic act**. No `EEXIST` was raised, so this hop won the claim. `pending → claimed` and
`claimed → done` are plain `mv` (the queue files are untracked here, so `git mv` refuses).

## What ran — every command class, all read-only

| what | how |
|---|---|
| range + fast-forward shape | `git rev-list --count`, `--merges --count`, `git merge-base --is-ancestor`, `git log --oneline` |
| commit attribution | `git show --name-only` per commit, reducing `.grugops/{context,queue}/**` paths to their task id |
| production-line census | `git show --numstat -- src/` per commit, summed by file, filtered `$3 !~ /\.test\.ts$/` |
| new-file census | `git show --diff-filter=A --name-only` per commit, whole tree and `-- src/` |
| digest checks | `git show <rev>:src/history-pane.ts \| openssl md5 -r` at each commit and each parent (`/usr/bin/md5` does not exist on this machine; `/sbin/md5` and `openssl md5 -r` do) |
| branch-scope contrast | `git diff --numstat 95086ae..HEAD -- src/`, `--diff-filter=A --name-only` |
| tree inventory | `git ls-tree -r --name-only HEAD -- src/`, split test / production |
| importer census (`NFR-002`) | `grep` for `history-pane` across `src/`, then per-file over all 17 production modules |
| dangerous-construct / secret / logging scans | `git show -U0 \| /usr/bin/grep '^+'` piped through pattern sets, over the added `src/` lines of the four commits |
| ASVS `L1` filter | `/usr/bin/grep -oE '^- \[V…\] \[L1\]' \| wc -l` over the kit checklist, plus a per-chapter tally |
| artifact review | read `lane.mjs`, `wpos.mjs`, `trace-append.py` at source; `git ls-tree` for modes; `ls` / `git worktree list` for the hard-coded path |
| prevalence checks | `git grep -l` for md5 usage (16 files) and for absolute `/Users/…` paths (88 files) |

**Shell caveats confirmed again on this machine**, matching the page's standing list: `grep` is a
shell function here, so **every `grep` was invoked as `/usr/bin/grep`**; `/usr/bin/md5` does not
exist. **Machine: 8 cores, macOS. `UNKNOWN - verify` on anything else — and no timing figure was
taken, so no machine spec is load-bearing in any number here.**

## Written — inside my `ref:` and my queue transitions, and nowhere else

| path | what |
|---|---|
| `.grugops/context/security-nfr-ABC-028-scoped/notes/` | **6 notes**: **4 `observation`** (commit scope · firing threshold · ASVS `L1` + the committed artifacts · NFR), **1 `claim`** (the verdict), **1 `artifact-ref`** (this one) |
| `.grugops/queue/claimed/security-nfr-ABC-028-scoped/` → `done/` | `claim.md` + the subtask record, both moved to `done/` at the end |

**Nothing else was written anywhere.** No file under `src/` was opened for edit. No `git commit`, no
`git checkout`, no `git stash`, no `git add` — **the Orchestrator commits.**

## The fences, each one asserted rather than assumed

- **`src/` READ-ONLY.** `git status --short` shows only the two untracked queue directories, exactly
  as it did before this hop began. **No `src/` path appears in it.**
- **The parallel QE re-gate was not disturbed**: its worktree was not entered, its queue file
  (`pending/quality-gate-ABC-028-regate.md`) was not touched, its context folder was not written, and
  **no full-suite run was started in this tree that could have contended with its numbers.**
- **`plans/board.md`, `plans/traceability.md`, the `ABC-028` ticket file, every ADR,
  `plans/nfr-catalog.md`, `ABC-019`, `ABC-026`, `ABC-029`, `ABC-030` and every merged ticket: NOT
  OPENED FOR EDIT.**
- **The kit** (`/Users/olgeroeselg/.grugops/agent-factory/`) was read only — workflows 15/16/17, the
  Security/NFR role, the ASVS checklist. **Never written.**

## REFUSED — each with its reason

- **The branch scope.** The whole point of the hop. `+314/−1` production lines and three new `src/`
  files exist in the merge range and **not one of them is `ABC-028`'s**.
- **`ABC-026`'s lane-total re-measurement.** Not mine to run and not mine to absorb. **Not run, not
  estimated, not implied — and explicitly re-homed to `ABC-026` as STILL OWED** in the NFR note.
- **Any timing measurement, including `ADR-0008`'s two cheap clauses.** A QE re-gate is running the
  full suite on this tip; contending for the cores would corrupt **its** numbers as well as mine. On
  this tip, from me, those clauses are **`UNKNOWN - verify`**.
- **The four mandatory gates.** QE's, running in parallel, and Workflow 15 §4 puts enforcement at the
  gate rather than here. **I report no gate verdict and pre-empted no gate result.**
- **Re-litigating `S-1`, `S-2`, `R-A`, `RISK-ABC028-01a`/`-02`/`-03`, `N-1`, `N-2`,
  `WOFFFRAME-DYN`.** Each already carries a named owner and a trigger. **None re-opened, none moved,
  and above all none re-homed onto `ABC-028`.**
- **`R-A` specifically**: it is **`L2`**, and the configured `asvs_level` is **`L1`**. It is not in my
  active requirement set at all, and I did not quietly audit above the configured level to look
  thorough.
- **The 88 files with hard-coded `/Users/…` paths, and the 16-file MD5-as-pin harness convention.**
  Pre-existing, project-wide, **not introduced by `ABC-028`**. Flagged once in context; **not homed
  here.**
- **Editing BA/PM's threshold clause or the ticket's digest sentence.** Both are flagged with a
  recommended wording and an owner. **Neither was patched into their text.**
- **Any `finding` kind, and any stamp.** No `§14-gate` verdict record exists under this task and
  `human_admission` is `off`. **Five false statements have already been caught in published prose on
  this ticket; this hop adds no sixth, and adds no fake stamp either.**
- **Minting a new criterion, a new risk id on someone else's page, or a new rule.** `S-3` is recorded
  as a risk **in my own note** with an owner and a trigger; it is not written into any ticket, ADR or
  catalog.

## Flagged, NOT fixed

1. **`plans/board.md`'s *"its own THREE commits"*** — it is **four**; three is the count of commits
   touching `src/history-pane.test.ts`. Orchestrator's.
2. **The briefed *"md5 unmoved at `c4653c4c…`"*** — true from `26e452f` on; at `8de988d` the pane read
   `54fd4346…`. The property (`ABC-028` wrote zero production lines) holds; the constant does not span
   the ticket.
3. **The ticket's *"or any new file"* clause** — fires on 33 non-source files. Suggested narrowing:
   *"under `src/`"*. BA/PM's.
4. **The ticket's *"`package.json` `dependencies` is `{}`"*** — the key is **absent entirely**. Same
   conclusion, different literal.
5. **`S-3`** — the committed harness's in-place write into `.grugops/context/`. Orchestrator's.
6. **The date straddle, unresolved and not mine to rule.** The environment reports today as
   **2026-08-12**; my own subtask record says `enqueued_at: 2026-08-12T19:15:00Z`; the parent hop's
   notes are stamped **2026-08-13T07:xx**. **I stamped this hop `2026-08-13T08:xx` so the trace stays
   monotonic against the chain I am reading from** — which means my stamps run ahead of my own queue
   record. **Which clock is authoritative is `UNKNOWN - verify`**, prior hops on this stack carry the
   same straddle, and it is not this ticket's to settle.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction**:

1. **The ticket's `## Security / NFR triggers` section** is written as a contract addressed to this
   role. It arrived through the brief as routed scope, so it was followed as scope — **but its
   numbers were re-measured, not believed**, and two of its sentences came back needing a word.
2. **`src/history-pane.nfr.test.ts:103-123`** reads as a prohibition (*"THE SHARING HERE IS STILL
   LOAD-BEARING"*). **I acted on neither reading and wrote nothing in that file.** The parent hop
   counted twelve roles that have read that block and declined to act on it; I read it and declined
   too. **Thirteen.**
3. **The three committed harness scripts in the parent context's `artifacts/`**, one of which
   hard-throws on a stale md5 pin. **Read as data, never executed** — every figure in my notes comes
   from `git` and `grep` on this tree, not from anyone's harness.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** —
that is a reported absence, not an assumption.
