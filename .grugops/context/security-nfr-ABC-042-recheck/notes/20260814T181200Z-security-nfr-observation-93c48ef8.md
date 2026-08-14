---
id: 20260814T181200Z-security-nfr-observation-93c48ef8
kind: observation
by: security-nfr
at: 2026-08-14T18:12:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - RF-1
  - RF-4
  - RF-5
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/history-pane.nfr.test.ts
  - src/glyph-mode.nfr.test.ts
supersedes: 
---

# The repairs RUN, not read — four measurements that decide the discharge

Every repair below was **executed against real inputs**, not re-read. Run 2026-08-14 on branch
`grugops/readyfordev-ABC-042` at HEAD `eefc217` with the repaired ticket in the working tree.
Reading a repaired clause proves only that the words moved.

---

## 1. `RF-4` — bar 4's grammar, executed against real specifiers

The clause on the page (`:264`) is a regex, so I ran it as one:
`/^(node:)?(fs|net|http|https|tls|dns|dgram)(\/|$)/`.

| specifier | matches | required | why this case is here |
|---|---|---|---|
| `node:fs` | **true** | true | the exact false pass `RF-4` was raised on |
| `fs` | true | true | the only spelling the old word-list caught — and one this repo never writes |
| **`node:fs/promises`** | **true** | true | **the merged in-repo precedent**: a mutant reading through it passed **all 271 tests** (`src/glyph-mode.nfr.test.ts:52-55`) |
| `fs/promises`, `node:dns/promises`, `node:fs/promises/x` | true | true | the sub-path grammar generalises |
| `node:net` / `http` / `https` / `tls` / `dns` / `dgram` | true | true | all seven named modules |
| `node:child_process` | false | false | must NOT match — `BAR 1b` permits it in the test file |
| `./frame.ts`, `../history.ts` | false | false | the shape of **all** 18 production imports |
| `fsevents`, `https-proxy-agent`, `nethack`, `dnsjs` | false | false | the `(\/|$)` anchor holds; no prefix false positives |
| **`node:http2`** | **false** | **true** | **GAP — HTTP/2 client and server, unambiguously network** |
| `node:inspector` | false | true | gap, narrower — `inspector.open()` binds a listening socket |

**25 of 27 correct; 2 gaps, both mine** — `RF-4` proposed this alternation verbatim and BA/PM
implemented what was asked. Recorded as `RF-10`, low, non-blocking.

## 2. `RF-4`'s other half — does the repair RED merged green code?

The wrong repair reds merged code. Scanned all **47** `.ts` files under `src/` for static, dynamic,
`require` and `vi.mock` specifiers, then applied the grammar under both scope readings:

```
bar-4 grammar RED under the ruled PRODUCTION scope:      0
bar-4 grammar RED if it reached test files (wrong scope): 10 hits in 4 files
   glyph-mode.nfr.test.ts  node:fs x3, node:fs/promises x3
   history-pane.nfr.test.ts node:fs x2
   render-seam.test.ts      node:fs
   san.test.ts              node:fs
```

Those are **exactly** the four merged files my earlier census named, and they are **green**:

```
npx vitest run src/render-seam.test.ts src/san.test.ts \
               src/history-pane.nfr.test.ts src/glyph-mode.nfr.test.ts
 ✓ 4 files, 47 tests passed, 365 ms
```

**The repair catches what it must and reds nothing merged** — because bar 4 states its scope
(*"in the production modules"*, test file exempt). Also re-measured: `fetch` **0**, `WebSocket` **0**,
`XMLHttpRequest` **0** across all 47 files, and **zero** production files contain `node:` at all.

## 3. `RF-1` — A6(ii)'s 1000 tokens, GENERATED and RUN against mutant resolvers

I implemented A6(ii)'s generator exactly as the page specifies (printable ASCII, lengths 1–24,
shapes `--<word>` / `-<char>` / `<word>` / `--colour <word>`, filtered against the accepted set) and
ran **10 independent seeds = 10,000 evaluations** against seven resolvers.

| resolver | seeds caught | mean accepted / 1000 | verdict |
|---|---|---|---|
| CORRECT (the allowlist build) | 0/10 | 0.0 | **passes — no false red** |
| M2 lenient: ignores any unknown `--flag` | **10/10** | **338.9** | CAUGHT every seed |
| M5 rejects but never NAMES the token | **10/10** | 0.0 | CAUGHT every seed |
| M3 `--colour <anything>` accepted | **5/5** | — | CAUGHT every seed |
| M6 silently eats `-x` short flags | **5/5** | — | CAUGHT every seed |
| **M1 targeted `--debug`** | **0/10** | 0.0 | **SHIPS GREEN — A6(ii) is blind** |
| M1b targeted `--engine-path` | 0/10 | 0.0 | SHIPS GREEN |
| M4 prefix / `startsWith` matching | 0/10 | 0.0 | SHIPS GREEN |

`P(one generated token is exactly "--debug")` ≈ **1.4e-12**; over 1000 tokens ≈ **1.4e-9**.

**So the repair is a real instrument, not a bigger sample of the same denylist** — it kills four
whole CLASSES of wrong build deterministically, which four literals could not. **And it is blind to
a targeted literal by construction**, which no random sample can fix. That is `RF-7`.

**Consequence for one sentence in BA/PM's notes.** `…decision-c3715e61` states *"the undocumented
fifth argument fails `A6`(ii)"*. **Measured false**, 10/10 seeds. It fails **`A6`(i)** — *"no other
token does"* — which is the clause that actually closes the set. The ticket's own page (`:317`) says
only *"failed by a named criterion"*, which is true; **the correction is owed to the note, not to the
ticket, and I am not asking for a ticket edit for it.**

## 4. `RF-1`'s cost, and `A6`(ii)'s filter clause read both ways

**Cost — the question was whether `A4` has already spent the budget.** `A4`'s 1000 resolutions **plus**
`A6`(ii)'s 1000 tokens, as pure evaluations: **0.112 ms, zero child spawns.** Against `N8-LANE`'s
650 ms CPU and the 92 ms merged spawning-file anchor, the second thousand is **free**. The page binds
this in two places (`## Acceptance` preamble; test note 3).

**The filter clause is ambiguous, and one reading voids a quarter of the corpus.** *"filtered to
exclude every spelling in the accepted set"* reads two ways. Shape census of 1000 tokens:

| reading | `--<word>` | `-<char>` | `<word>` | `--colour <word>` | M3 (`--colour <anything>`) |
|---|---|---|---|---|---|
| **A** — drop only whole ACCEPTED FORMS | 257 | 261 | 249 | **233** | **CAUGHT 5/5** |
| **B** — drop any argv containing an accepted TOKEN | 331 | 346 | 323 | **0 — VACUOUS** | **SHIPS GREEN 0/5** |

Reading B deletes the `--colour <word>` shape entirely (every one contains `--colour`) **and with it
the build that shape exists to catch**. This is the same defect class as my own `RF-3`(ii): an
assertion that can pass by observing nothing. That is `RF-8`.

## 5. `RF-5` / `BAR 1b` — the control is on the page, and its `exec` token is ambiguous

`BAR 1b` is at `:248-252`, substantively verbatim from `…decision-592c0a9e`, and it is grep-assertable.
One defect, in **my** wording: sentence 1 **permits** `execFileSync`; sentence 2 forbids
*"Zero occurrences of `exec` and `execSync`"*. Measured on the merged precedent the ticket cites by
name (`src/history-pane.nfr.test.ts`):

```
substring     /exec/g            : 3   <-- :348 prose, :582 process.execPath, :592 execFileSync
word-boundary /\bexec\b/g        : 0
call site     /\bexec\s*\(/g      : 0
/execSync/g : 0    /\bexecSync\s*\(/g : 0    /shell\s*:/g : 0
```

| token the delivered test file MUST contain | substring | word-boundary | call site |
|---|---|---|---|
| `process.execPath` | **matches → RED** | no | no |
| `execFileSync(cmd, [a,b])` | **matches → RED** | no | no |

Under a substring implementation `BAR 1b` **reds the correct build and reds merged green code**, and
forbids in sentence 2 what it permits in sentence 1. Under a word-boundary or call-site
implementation it is 0/0 and correct. My own measurement in `…observation-85881f7a` counted
**call sites**; the bar says *"occurrences"*. That is `RF-9` — a false RED, not a false GREEN.
