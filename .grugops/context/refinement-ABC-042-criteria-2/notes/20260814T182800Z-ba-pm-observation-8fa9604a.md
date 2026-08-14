---
id: 20260814T182800Z-ba-pm-observation-8fa9604a
kind: observation
by: ba-pm
at: 2026-08-14T18:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - RF-7
  - RF-9
  - RF-10
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/history-pane.nfr.test.ts
supersedes: 
---

# What I RAN before writing it into a criterion, and the rule-2 line accounting

Security/NFR's discharge rests on *"measured, not read"*. A criteria repair can honour that too: every
regex and every derived set below was **executed** before it went on the page. Run 2026-08-14 on branch
`grugops/readyfordev-ABC-042`, working tree carrying the first repair.

## 1. `RF-10` — the grammar with `http2`, executed against 22 specifiers

`/^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/`

- **Matches (required):** `node:http2`, `http2`, `node:http2/x`, `node:http`, `http`, `node:https`,
  `node:fs`, `node:fs/promises`, `fs/promises`, `node:dns/promises`, `node:net`, `node:tls`, `node:dgram`.
- **Does not match (required):** `node:child_process` (BAR 1b permits it in the test file), `./frame.ts`,
  `../history.ts`, `fsevents`, `https-proxy-agent`, `nethack`, `dnsjs`, **`http2-wrapper`**.

`http2-wrapper` is the case Security did not list and the one the token could have broken: the `(\/|$)`
anchor holds, so adding `http2` introduces **no** new prefix false positive. Alternation order is
irrelevant, as Security said — `node:http2` matches by backtracking (`http` then `(\/|$)` against `2`
fails, `http2` then `$` succeeds). **`node:inspector` still does not match, deliberately** — Security
ruled it out and named the compensating control; I did not widen past the ruling.

## 2. `RF-9` — the call-site regexes, executed on the merged precedent

`src/history-pane.nfr.test.ts`, the file `ABC-042` cites by name:

```
substring     /exec/g              : 3
word-boundary /\bexec\b/g          : 0
call site     /\bexec\s*\(/g       : 0     /\bexecSync\s*\(/g : 0     /shell\s*:/g : 0
```

Reproduces the Orchestrator's re-measurement exactly. Behaviour on the tokens that decide the bar:

| token | `/\bexec\s*\(/` | `/\bexecSync\s*\(/` |
|---|---|---|
| `process.execPath` — the delivered file MUST contain it | no | no |
| `execFileSync(cmd, [a,b])` — BAR 1b sentence 1 permits it | no | no |
| `cp.exec(cmd)` / `child_process.exec(x)` / `exec (cmd)` | **CAUGHT** | no |
| `execSync(cmd)` / `cp.execSync(cmd)` | no | **CAUGHT** |
| `spawnSync(a,[b])`, `myexec(1)` | no | no |

The word boundary sits between `.` and `e`, so **member-expression call sites are still caught** while
`execFileSync` and `execPath` are not — that is why I wrote the two regexes onto the page rather than the
bare phrase *"call sites"*. `\s*` covers `exec (cmd)`. `myexec(1)` is not a false RED.

## 3. `RF-7` — the derived near-miss set cannot false-RED a legal build

The near-miss clause I added to `A6`(i) derives, for each of the six accepted spellings, its upper-case
form, its `+"x"` extension and its one-character truncation — **18 tokens**. Every one must be rejected
by the correct build, so I checked the set against the accepted set itself:

```
accepted spellings: 6    near-miss set: 18    collisions with the accepted set: 0
```

**Zero collisions**, so the clause cannot reject a token the table accepts. This is the check `RF-3`
would have wanted asked before a byte-level assertion went on a page: the instrument was run against the
build it must pass, not only against the builds it must fail.

## 4. Rule 2 — the size budget, with the number

| point | lines |
|---|---|
| before this hop (after the first repair) | **328** |
| after `RF-7`…`RF-10` | **328** |

The four repairs cost **+15** lines of criteria. I paid for them by moving narration into these notes,
per `AGENTS.md` § Process rules, rule 2 — nothing that a build is measured against was cut:

- header blockquote −1; `A9`'s scope parenthetical −2 (the aside about the audit's one-sentence version
  being false of merged code is narration and lives in the earlier hop's notes);
- `A10`'s deletion parenthetical −1, bar 4's *"grammar not a word list"* rationale −1, test note 4 −1
  (it restated `A6`'s own union sentence verbatim), `A3`'s parenthetical −1;
- `## Scope` 2 −1, `N8-LANE` −1 (the 11-module-closure sentence; the **92 ms** anchor and the **650 ms**
  target both stay, because DoR item 6 is measured on them), `ABC-041`'s dependency bullet −1, the merged
  citation list −1 (repeat file paths collapsed to `:line`, all eight citations intact).

**The budget was not bought with rigour.** Criteria, bars, numbers and named instruments are all still on
the page; what left is narration about *why the previous wording was wrong*, which is what notes are for.
