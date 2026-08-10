---
id: 20260810T165505Z-security-nfr-observation-4e2ab63f
kind: observation
by: security-nfr
at: 2026-08-10T16:55:05Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-023
  - N6
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# The security half: the trigger did NOT fire at 823 of 900 — I read the 823 lines anyway and found nothing, and the trigger itself has a defect that has fired on every ticket this board has ever run

Everything here was measured on this hop against the branch tip. Nothing is inherited from the
brief, which supplied the same 823/0 figure — it was re-derived rather than accepted, because a
gate that takes its own threshold measurement from the role that enqueued it is not a gate.

## 1 — the trigger, measured

`ABC-025`'s own words: *"the security half fires if the delivered diff exceeds +900 lines, or
touches any file that is not a `*.test.ts` file under `src/`."*

```
git diff --numstat main -- src/
    655   0   src/san.qualifier.hardening.test.ts     (the dev hop)
    168   0   src/san.suffix.hardening.test.ts        (the QE hop)
                                                      TOTAL  +823 / -0, two files
git diff -U0 main -- src/ | grep -c '^-[^-]'            0 deletion lines
git diff --name-only main -- src/ | grep -v '\.test\.ts$'   EMPTY  — no non-test file under src/
git ls-files --others --exclude-standard -- src/            EMPTY  — nothing untracked
```

**Clause 1: NOT fired — 823 < 900. Clause 2: NOT fired — both files are `*.test.ts` under `src/`.
The security half does not fire on this ticket.** Said plainly, because a trigger treated as fired
when it has not is a trigger nobody trusts again — this ticket's own sentence, applied to itself.

## 2 — what I did with the 9% margin, and it is not what "proximity fires the trigger" would be

823 is **91.4%** of the threshold, on a ticket whose written prediction was **~+550**. The delivered
diff is **1.5x its own prediction**. `ABC-023` is the precedent the threshold exists because of: a
"none, structural" line written against an expected 17-row diff that delivered **+749** and had to
be over-ruled.

**I did not treat proximity as a trigger.** Reading 823 as if it were 900 would silently move the
threshold down to wherever the auditor felt uneasy, which is the same act as moving a bar — and
this board's standing rule is that a gate does not move a target. The threshold is BA/PM's and it
says 900.

**I read the added lines anyway, as a discretionary review, and I am naming it as discretionary
rather than dressing it up as a trigger.** The reason is cost: 823 lines of test source is minutes
of reading, the structural argument ("it is only tests") is exactly the argument that was wrong on
`ABC-023`, and an argument that has been wrong once on this board is worth checking rather than
repeating. **The review found nothing.** Had it found something, the finding would have stood on
its own evidence, not on the trigger.

## 3 — the read, with what was looked for named

Both files, all 823 lines. `security.asvs_level` is `L1`; the L1 requirements that can bear on a
diff with **zero production lines and no runtime importer** are the code-execution, command-
injection, dependency and secret-handling ones, and they are the ones checked. Everything else in
the L1 set (HTTP responses, database queries, authentication, session management, access control,
cryptography, file upload) has no surface here — the change adds no production line, `src/san.ts`
is byte-unchanged, and nothing in the repository imports a `*.test.ts` file at runtime. Recorded as
structurally not applicable rather than ticked, and **not** claimed as a passed control.

```
imports, both files      vitest, and ./apply.ts ./fen.ts ./legal.ts ./moves.ts ./position.ts
                         ./san.ts — the repository's own modules and nothing else
child_process / exec / spawn                        0        OS command injection: no OS call at all
eval / new Function / dynamic import()              0        ASVS V1.3.2 — nothing to sanitize
node:fs, readFile/writeFile/unlink                  0        the files cannot write anything
network: fetch / http / https / net / socket        0
process.env / process.exit / globalThis / __dirname 0
setTimeout / setInterval / Promise / async / await  0        every test is synchronous
Math.random / Date.now / new Date / performance.now 0        every test is deterministic
while / for(;;) / do-while                          0        every loop is `for...of` over a finite array
secret-shaped literals (token/key/password/PEM)     0        all 167 string literals are FENs, SAN
                                                             strings, square names and test labels
dependencies added                                  0        package.json / package-lock.json
                                                             byte-identical to main; chess.js ABSENT
                                                             from the repository's node_modules
```

**Input class, checked at the source rather than quoted:** `toSan` takes a `Move` produced by
`legalMoves` and a `Position` produced by `parseFen`; every FEN in both files is an inline literal.
No user-supplied string reaches this module, and there is no user surface until `EPIC-006`. The
`ABC-013` gate's own finding — output bounded at 7 characters, printable ASCII, zero control or
escape bytes over 351,644 strings — is not re-run here and not needed: **`src/san.ts` is
byte-unchanged, so its output alphabet cannot have moved.**

**Test-integrity scan, and one false alarm of my own recorded rather than dropped.** A crude scan
reported 17 of the 24 `it` blocks as having no `expect`. That was **my scan being wrong, not the
rows being empty**: the assertions live in the helpers `expectRows` → `moveFor` (which asserts the
`(from, to, promotion)` triple names **exactly one** legal move before any string is read) and
`expectNoMismatches`. Resolved by reading the file. Recorded because a security note that only
reports the errors it finds in others is not a security note. Also checked and clean: **no
`.skip`, `.only`, `.todo`, `xit`, `xdescribe` or `expect.soft` anywhere in either file**, skip count
**0** on the JSON reporter, and **no wall-clock assertion was added to the suite** — the two
`toBeGreaterThan` calls assert counts (3,000 qualifiable moves examined; a non-empty qualifier), not
times, which keeps this board's standing rule that microseconds live in the catalog with their
machine and never in a test.

**Diagnosability, since a failure mode with no log is the incident nobody can diagnose later.**
Good, and better than the per-`expect` form it replaced: `expectNoMismatches` prints a count plus
the first five mismatches, each naming its FEN, its from-square, its to-square, the string actually
emitted in **both** call forms and the rung that was expected. Every hand row is labelled with its
position id and its move. No required fix.

## 4 — the defect in the trigger itself, which nobody has named and which fires on every ticket

Clause 2 as written is *"touches any file that is not a `*.test.ts` file under `src/`."* Taken
literally, over the branch's whole diff:

```
git diff --numstat main            .grugops  +2137/-0     plans  +600/-2     src  +823/-0
                                   TOTAL     +3,560 / -2
files touched that are NOT a *.test.ts under src/          26
```

**Under the literal reading, both clauses fire — on this ticket and on every ticket this board has
ever run**, because every ticket edits `plans/board.md` and writes context notes. Under the reading
every hop actually used (the code diff, i.e. `src/` only), neither clause fires. The trigger's
**denominator is unnamed in exactly the way `N5`'s is**, and the two defects are the same species
found on the same ticket. I applied the code-diff reading — it is plainly what the ticket means,
since the sentence goes on to say *"the added lines get read for secrets, spawns, network calls and
unbounded loops"* — and I am recording the ambiguity rather than quietly picking the reading that
suits the verdict. Owner **BA/PM**, carried as a risk.

## 5 — `A6` re-verified on my own instrument, and `N6`

```
md5 -q src/san.ts                                 cbcc3be37c21414d16e8e6b4d0c68959   UNCHANGED
git diff --numstat main -- src/                   655/0 + 168/0, two files, both *.test.ts
deletion lines under src/                         0
diff over every PRE-EXISTING src/ file            EMPTY   — no existing test row modified or deleted
untracked files under src/                        none
package.json / package-lock.json                  untouched
anything outside src/ plans/ .grugops/            nothing
md5 src/san.qualifier.hardening.test.ts           856ebab15128d8b5945c3038401eeda5
                                                  = the value QE recorded -> the DELIVERED file is
                                                  byte-identical and this gate did not touch it
md5 src/san.suffix.hardening.test.ts              c8beb69c1c4169bde319196c3e138eac
```

**`A6` HOLDS on my own reading.** No row proved the delivered code wrong at this hop either — I
wrote no new row and ran no new oracle, so I add no evidence in that direction and claim none.

**Gates, run by me on the branch tip:**

```
npx vitest run --reporter=json    676 passed / 676 on 22 files, failed 0, pending 0, todo 0
                                  -> SKIP COUNT 0
npm run lint                      exit 0   (40 files, the same 2 PRE-EXISTING infos)
npm run typecheck                 exit 0
npm run build                     exit 0
PERFT_DEEP=1 vitest run src/perft.test.ts    32 passed / 32 EXACT in 36.55 s
```

**`N6` (deep lane 32/32, skip count 0) is MET** — verified directly rather than carried by `A6`,
and this is its fourth independent run on this ticket (Engineer 37.93 s, QE 36.76 s, here 36.55 s).
