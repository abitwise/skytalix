---
id: 20260813T081000Z-security-nfr-observation-the-firing-threshold-verified-at-source-and-the-digest-sentence-needs-one-word-back-8f2b61d5
kind: observation
by: security-nfr
at: 2026-08-13T08:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The firing threshold **DOES NOT FIRE** — measured at source as an empty set, not quoted. One briefed digest sentence needs a word back, and the branch would have fired it 314 times

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**, no stamp invented. Every figure was RUN at this hop.

**The contract I am gating against**, `plans/tickets/ABC-028-…md:1849-1852`:

> *"Security: NONE, and it is not pre-waived. Test-only, zero production lines, no new dependency
> (`package.json` `dependencies` is `{}`), no input reaches the process from outside it. **Firing
> threshold … : any production line at all, or any new file.**"*

## 1. Zero production lines — measured as an EMPTY SET over the four own commits

Union of `8de988d 26e452f 593ba70 1ae7b8f`, restricted to `src/`:

```
+504  -4   src/history-pane.test.ts          TEST
 +32 -21   src/history-pane.nfr.test.ts      TEST
---------------------------------------------------
+536 -25   across exactly TWO files, both *.test.ts

production lines (src/, non-*.test.ts):  0 added, 0 removed   -- the filtered set is EMPTY
new files under src/ (--diff-filter=A):  NONE                 -- the filtered set is EMPTY
```

**Both are reported as empty sets from a filter, not as a claim.** The `src/` inventory at `HEAD` was
enumerated first (`git ls-tree`) and classified: **17 production `.ts` modules, 28 `*.test.ts`
files**. `history-pane.test.ts` and `history-pane.nfr.test.ts` are in the test half; that
classification is the whole load-bearing step and it is mechanical.

## 2. `src/history-pane.ts` — empty diff at all four commits, and ONE WORD needs to come back

Per commit, `git diff <c>^ <c> -- src/history-pane.ts` and the md5 either side:

| commit | before | after | diff |
|---|---|---|---|
| `8de988d` | `54fd4346dcc1a0060c4e66ae0149265d` | `54fd4346…` | **EMPTY** |
| `26e452f` | `c4653c4c263c4c417ea34969164ccd86` | `c4653c4c…` | **EMPTY** |
| `593ba70` | `c4653c4c…` | `c4653c4c…` | **EMPTY** |
| `1ae7b8f` | `c4653c4c…` | `c4653c4c…` | **EMPTY** |

**The load-bearing property HOLDS: `ABC-028` never wrote a line of `src/history-pane.ts`.**

**The briefed sentence — *"`src/history-pane.ts` md5 is claimed unmoved at `c4653c4c…`"* — is true of
three of the four commits and NOT of the first.** At `8de988d`, this ticket's own first commit, the
pane read `54fd4346…`. The digest moved once inside the branch range — at **`b7e1226`**, `+1/−1`,
which is **`ABC-029`'s** (`ticket-to-pr-ABC-029-dev`) — between this ticket's first and second
commits.

**The correction is one word, and it matters on this page more than on most:** *"unmoved at
`c4653c4c…`"* → **"unmoved BY EACH of `ABC-028`'s own commits"**. A constant quoted as if it spanned
the ticket is exactly the shape `## Test notes` 11 was written about, and the ticket that changed the
constant is the one whose lines a branch-scoped review would have handed to `ABC-028`.

## 3. What the BRANCH would have charged this ticket — measured, for the contrast

```
production diff 95086ae..0ee148e:   src/turn-loop.ts    +313 / -0
                                    src/history-pane.ts   +1 / -1
                                    TOTAL               +314 / -1
new files under src/ in branch scope:  src/turn-loop.ts, src/turn-loop.test.ts,
                                       src/turn-loop.nfr.test.ts   (THREE)
```

**The Orchestrator's `313 on src/turn-loop.ts` reproduces EXACTLY.** The branch total is **314**, not
313, because `ABC-029` also moved one comment line on the pane — **and neither is `ABC-028`'s**. A
branch-scoped review would have fired this ticket's threshold on **both** of its clauses at once:
314 production lines it did not write and three new `src/` files it did not add. The scope
instruction was not a formality; it was the difference between a measured `PASS` and a fabricated
`FAIL`.

## 4. The threshold's LETTER fires; its INTENT does not. Both readings, because the clause is the contract

The clause says *"any production line at all, **or any new file**"*. `ABC-028`'s own commits added
**33 new files** — **all of them under `.grugops/`**: 30 context notes and queue records, plus three
harness scripts (`lane.mjs`, `wpos.mjs`, `trace-append.py`).

**Measured, so the intent reading is evidenced rather than assumed — none of the 33 is in any
shipped, built or executed path:**

- **Not built.** `tsconfig.json` `include` is `["src/**/*.ts", "spike/**/*.ts"]`. `.grugops/` is
  outside it, so `npm run typecheck` / `npm run build` never see them.
- **Not collected by the runner.** There is **no vitest config file in the repo**, so discovery is
  vitest's default `**/*.{test,spec}.?(c|m)[jt]s?(x)`. `git ls-files` finds **no `*.test.*` or
  `*.spec.*` anywhere outside `src/`**. Cross-checked against the live suite: `src/` holds exactly
  **28** `*.test.ts` files and the recorded suite reports **28 files** — the counts agree, so nothing
  outside `src/` is being collected. *(That cross-check is an inventory identity, not a suite run: I
  did not run the suite — see the NFR note for why.)*
- **Not imported.** Nothing under `src/` references any of the 33.
- **Not executable bits.** All three scripts are mode `100644`.

**So: the letter of the clause fires on 33 non-source files; the intent — "the ticket changed shape
and now ships or runs something new" — does not fire at all.** I am recording both rather than
picking the convenient one. **Recommended narrowing, NOT taken:** *"any production line at all, or any
new file **under `src/`**"*. **Owner: BA/PM** (the page is theirs). **Trigger: the next ticket that
inherits this threshold verbatim** — three already have. The ticket file was **not opened for edit**.

## 5. No dependency, no secret, no new surface — each one a filter, each one empty

- **Dependencies.** The four commits' complete file list is: two `src/*.test.ts`,
  `plans/traceability.md`, and `.grugops/**`. **`package.json`, `package-lock.json`, `tsconfig.json`,
  `biome.json`, and every CI/config file: untouched.** Zero dependency change.
  **Precision on the ticket's own wording:** it says *"`package.json` `dependencies` is `{}`"* — in
  fact the key is **absent entirely**; there is no `dependencies` key at all, only `devDependencies`.
  Same security conclusion (zero runtime dependencies), different literal. Recorded because a
  true-sounding literal is this page's characteristic failure.
- **Scans over the ADDED `src/` lines of the four commits** (`git show -U0 | grep '^+'`), each
  returning nothing:
  `eval(` · `new Function` · `child_process` · `execSync` · `spawn` · `require(` · `import(` · `fs.` ·
  `readFile` · `writeFile` · `process.env` · `process.argv` · `net.` · `http(s).` · `fetch(` ·
  `WebSocket` · `Buffer.allocUnsafe` · `__proto__` · `prototype[`.
- **Credential-shaped literals** in the added lines (`password|secret|api[_-]?key|token|BEGIN …
  PRIVATE KEY|aws_|bearer |authorization`, case-insensitive): **none**.
- **Logging surface added** (`console.` / `process.stdout` / `process.stderr` / `writeSync`):
  **none**.
- **Input from outside the process:** the ticket's claim holds structurally — the added tests build
  `GameHistory` fixtures in memory and call `renderHistory`; there is no argv, env, fd, socket or file
  read anywhere in the added lines, which is what the scans above establish.

**VERDICT ON THE THRESHOLD: it does not fire on the meaning it was written to catch, and this is a
MEASURED non-trigger — an empty filtered set on each clause — not a shrug.**
