---
id: 20260813T081500Z-security-nfr-observation-asvs-l1-walked-at-seventy-and-the-only-code-this-ticket-added-outside-src-c5d09b73
kind: observation
by: security-nfr
at: 2026-08-13T08:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - V1.2.5
  - V1.3.2
  - V5.3.2
  - V11.4.1
  - V15.1.1
  - V15.2.1
  - .grugops/factory.config.json
  - .grugops/context/ticket-to-pr-ABC-028-t493/artifacts/lane.mjs
  - .grugops/context/ticket-to-pr-ABC-028-t493/artifacts/wpos.mjs
  - .grugops/context/ticket-to-pr-ABC-028-t493/artifacts/trace-append.py
supersedes:
---

# ASVS **L1** walked at **70** requirements (counted, not quoted) — **no failure**. Six have any surface; the only one that bites at all is in the three harness scripts this ticket committed, and it is an operational hazard, not an ASVS fail

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**, no stamp invented.

## The filter, stated honestly per Workflow 15 step 1

`.grugops/factory.config.json` → `security.asvs_level` **`L1`**, `security.block_on` **`high`**,
`compliance_regime` **`[]`** (so no Compliance Officer hand-off is owed). ASVS levels are cumulative;
at L1 the active set is every requirement tagged `[L1]`.

**Counted mechanically off the checklist rather than quoted: 70.** Matching the number the workflow
and the checklist header both state, which is a cross-check I would have reported if it had failed.

```
V1  8   V2  4   V3  8   V4 2   V5 4   V6 13   V7 6   V8 4
V9  4   V10 5   V11 3   V12 3  V13 1  V14 2   V15 3        = 70
```

**64 of the 70 have no surface on this project's shape at all** — no HTTP, no browser, no cookies,
no TLS endpoint, no auth, no session, no OAuth/OIDC, no self-contained tokens, no database, no file
upload, no WebRTC, no deployment (`ADR-0007`: local-only, no CLI entry point until `EPIC-006`). That
is an absence of surface, and I record it as such rather than as 64 ticks.

## The six that have a surface, each with its evidence

| req | level | verdict | evidence, measured this hop |
|---|---|---|---|
| **V1.3.2** — avoid `eval()` / dynamic code execution | L1 | **PASS** | zero in the added `src/` lines; zero in the three new scripts. **One grep hit reported rather than hidden:** `trace-append.py:64` `re.compile(...)` — regex compilation, not code execution. A scan that suppresses its own false positives is not a scan |
| **V1.2.5** — OS command injection / parameterized OS calls | L1 | **PASS** | zero OS calls in the added `src/` lines. The **one** OS call this ticket committed anywhere is `lane.mjs:64` `execFileSync("npx", ["vitest","run","--reporter=json",…], {cwd: lane})` — **argv-array form, no shell, no interpolated data**. That is the form the requirement asks for |
| **V5.3.2** — file paths built from internally generated / trusted data | L1 | **PASS** on the requirement's own terms | every path in the three scripts comes from `import.meta.url`, a hard-coded constant, or `argv` values used **only as md5 comparison values, never as a path segment**. *The write-location hazard below is NOT a V5.3.2 failure and I am not tagging it as one* |
| **V11.4.1** — approved hash functions; MD5 disallowed | L1 | **assessed, NOT a failure — both readings written out below** | `lane.mjs:18` `createHash("md5")`, used to PIN file contents |
| **V15.2.1** — only components inside documented remediation time frames | L1 | **unchanged by this scope** | zero dependency change: `package.json` / lockfile untouched by all four commits |
| **V15.1.1** — documentation defines remediation time frames | L1 | **not engaged by this diff; project-level** | named so my silence is not mistaken for a tick. **NOT homed on `ABC-028`** — hanging a standing project gap on a test-only ticket is the same scope error this hop exists to prevent |

## V11.4.1 and MD5, because the default severity would have been `high` and `block_on` is `high`

**The strict reading:** a digest used as an integrity check is a cryptographic purpose; V11.4.1 says
MD5 *"must not be used for any cryptographic purpose"*; an L1 failure defaults to **`high`**, and
`security.block_on` is `high`, so it would block.

**The reading I take, and why it survives being argued with:**

1. **The use is drift detection against ACCIDENT, not integrity against an ADVERSARY.** The pin's
   entire job is to make the harness `throw PIN MISMATCH … REFUSING to measure` when the tree moved
   under it (`lane.mjs:20-27`) — and it was demonstrated doing exactly that before its results were
   relied on. An adversary who can rewrite the tree can rewrite the pin in the same commit, so no
   hash choice buys anything here.
2. **It is not in the application.** `grep` over all 17 production modules: **zero** `md5`, **zero**
   `createHash`. Nothing hashed by this project ships or runs.
3. **And decisively for SCOPE: it is not `ABC-028`'s practice.** MD5-as-pin appears in **16 tracked
   files** across `quality-gate-ABC-028-qe`, `-narrow`, `-final`, `-instrument`,
   `refinement-ABC-028-shape` and this ticket's own artifacts — QE's, BA/PM's and the Engineer's
   alike. It is the project's harness convention. **Homing it on this ticket would be the branch-scope
   mistake in a different costume.**

**I am not overriding a default severity; I am recording that this is not a V11.4.1 failure.** Both
readings are written out so the Orchestrator can overrule me **on the reading** rather than on the
verdict. If the strict reading were taken, the owner is the project (the harness convention), never
`ABC-028`.

## The one real item in `ABC-028`'s own new files — verified at source, and BOUNDED

`1ae7b8f` committed three scripts under `.grugops/context/ticket-to-pr-ABC-028-t493/artifacts/`.
`wpos.mjs:6` imports `buildLane` from `lane.mjs`, and `lane.mjs` reads:

```
:14   const HERE = dirname(new URL(import.meta.url).pathname);
:42   const lane = join(HERE, "lanes", name);
:43   rmSync(lane, { recursive: true, force: true });
:44   mkdirSync(lane, { recursive: true });
:45   cpSync(join(WORKTREE, "src"), join(lane, "src"), { recursive: true });
```

**Run from its committed location, the harness writes into `.grugops/context/…/artifacts/lanes/` —
a write into the shared verified context by a path that is not the sanctioned writer.** Workflow 16
is explicit that `context-io.ts` is the only sanctioned writer of `.grugops/context/`.

**And here is the bound, stated instead of the scary version:**

- `rmSync` targets **only** `lanes/<name>`, which does not pre-exist. It is not a delete of anything
  that is there.
- The run then **aborts immediately at `:45`**, because `WORKTREE` is hard-coded at `:13` to
  `/Users/olgeroeselg/…/cli-chess-abc028-t493` — a worktree that **no longer exists** (checked: `ls`
  → *No such file or directory*; `git worktree list` shows only this tree and the QE re-gate's
  scratchpad worktree).
- **Realistic blast radius today: one stray empty directory inside the context folder.** Not data
  loss.
- **Same shape, same dead path, in `trace-append.py`**: `:8` hard-codes that worktree's
  `plans/traceability.md` and `:93` opens it `"w"` — a **full rewrite**. It raises `FileNotFoundError`
  before writing today. **If that worktree path is ever recreated, the committed script rewrites that
  file on the spot.**

**What is new here versus the parent hop.** The Engineer flagged "run the copy from a fresh scratch
root, never from the context `artifacts/` directory" **in prose**. Prose is not a mechanism. What this
note adds is that the mechanism is **verified at source**, **bounded**, and carries an **owner and a
trigger**:

> **`S-3` — a committed dev harness writes into `.grugops/context/` when run in place.**
> **Severity: LOW** (latent; nothing executes it automatically; bounded as above; aborts on a dead
> path). **Owner: the Orchestrator** — the `.grugops/context/` substrate is its, and the artifact is
> committed under it. **Trigger: the first hop that runs the committed copy in place** instead of from
> a fresh scratch root, **or** the first recreation of the `cli-chess-abc028-t493` worktree path.

**NOT homed here, because it is pre-existing and pervasive:** hard-coded absolute
`/Users/olgeroeselg/…` paths in committed content appear in **88 tracked files under `.grugops/`**,
by many roles across many tickets. `ABC-028` did not introduce the practice and does not own it.
