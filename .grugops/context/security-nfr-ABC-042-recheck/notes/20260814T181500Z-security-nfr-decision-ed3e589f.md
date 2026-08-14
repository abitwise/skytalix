---
id: 20260814T181500Z-security-nfr-decision-ed3e589f
kind: decision
by: security-nfr
at: 2026-08-14T18:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - RF-1
  - RF-2
  - RF-3
  - RF-4
  - RF-5
  - RF-6
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 20260814T172800Z-security-nfr-decision-eb042ead
---

# RULING 3 — the `ABC-042` BLOCK is **DISCHARGED**. `RF-1`…`RF-5` all discharged; four new items, none blocking.

I raised the block at `…decision-eb042ead` and only I may lift it. **`supersedes` names that note
because its VERDICT is overridden — nothing else of it is.** Its ASVS coverage map, its four accepted
risks with owners, and `RULING 1`'s production-scope reading (`…decision-592c0a9e`) all stand
unchanged and are not re-opened here.

**The test I applied, stated before the verdicts:** a repair discharges only if the build that was
previously **passing-but-wrong** now **fails a named criterion**. Words moved on the page do not
discharge anything. Every discharge below names that build, and the evidence is **measured**, not
read — `…observation-93c48ef8` (four runs) and `…observation-bcaaa460` (the delete audit).

---

## `RF-1` — HIGH, **V2.2.1 [L1]**, THE BLOCKER — **DISCHARGED**

| clause | the build that shipped green before | where it fails now |
|---|---|---|
| **(a) close the accepted set** | a resolver that accepts anything not among `A6`'s four literals | **`A6`(ii)** — measured: the lenient build accepts **338.9 of 1000** generated tokens and is CAUGHT in **10/10 seeds**; the un-naming build **10/10**; `--colour <anything>` **5/5**; the short-flag eater **5/5**. The correct build passes with **0** false reds. |
| **(b) exclusive validator** | an entry point that branches on `process.argv` *again* after the resolver returns — a second, unvalidated input path | **`A9`(2)** — *"`process.argv` occurs exactly once … its only use is as the argument to the resolver"*, plus `A9`(3) which forbids `process.` in every other new production module. A second read is a second occurrence. |

`## Scope` also gained **THE ACCEPTED SET, CLOSED**, without which the complement `A6`(ii) ranges over
is undefined. Both clauses of the blocker are met, and the instrument is affordable: `A4`'s 1000 plus
`A6`(ii)'s 1000 cost **0.112 ms and zero spawns** — the second thousand is free.

**The residual, named rather than smoothed:** `A6`(ii) is a random sample and is **blind to a targeted
literal** — the `--debug` build ships green in 10/10 seeds. It fails **`A6`(i)** as worded (*"no other
token does"*), which is a criterion, and before the repair **no criterion said anything about the
complement at all**. That is a change of state, not a re-wording. Instrument strength is `RF-7`,
medium, non-blocking, with the structural fix written out.

**Why this is not me clearing my own gate because clearing was convenient.** `RF-1(a)` demanded, in my
words, *"a property over generated unknown tokens, not four literals … `A4` already runs 1000
spawn-free evaluations, so the instrument exists on the page."* **That is exactly, and only, what
shipped.** `RF-7` exists because the instrument **I specified** is weaker than I believed — I proved
that by running it, and I am recording it against my own name. Holding a HIGH block on my own
specification error, after BA/PM delivered precisely what was demanded, would be moving the goalpost,
not holding the gate.

## `RF-2` — MEDIUM — **DISCHARGED**

The `assembleFrame` disjunct is **deleted, not re-worded** — verified by `grep`: `assembleFrame` and
`sanitize` survive on the page only inside the parenthetical that records the deletion (`:258-259`).
**Previously available:** satisfying bar 2 by asserting a route no legal build can take, which is how
a dead clause becomes tomorrow's false pass. **Now:** the route does not exist on the page, so the
byte-level property is the only way to satisfy the bar. **Nothing was lost in the delete** — the
disjunct was unreachable and was the weaker control (`R-A`: C1/CSI survives `sanitize`).

## `RF-3` — MEDIUM (**V1.3.3 [L2]**, above the L1 floor) — **DISCHARGED**, all three defects

1. **The newline build.** Was: any usage message ending in `\n` violated *"zero C0"* as literally
   worded — a criterion that rejects the delivered build. Now scoped to **the echoed token's bytes**,
   and the page says so in the clause itself. The false red is gone and the vector — the argument —
   is what is asserted.
2. **The vacuous pass.** Was: a build whose message never echoes the argument contains zero C0 and
   **passed trivially**. Now fails **bar 2(i)** — *"non-vacuity FIRST — the token's printable
   characters ARE present"*, asserted **before** the absence.
3. **The `console.error` build.** Was: invisible to a stdout-only assertion, and this repo's own first
   entry point reaches the terminal ~20 times without naming `process.stdout`. Now fails the
   **both-channel capture** in bar 2, and `A5`/`A6`(iii) assert zero frame rows **over stdout ∪
   stderr**. The channel stays the engineer's, and both channels are watched.

The character class is now explicit (C0, `U+007F`, `\x1b`) and states that C1/CSI is deliberately
outside it, citing `R-A`. **`AR-1` stays exactly where it was** — L2, outside the active set, owner
BA/PM, not re-opened; the repair made the gap visible without adding scope, which is the right move.

## `RF-4` — MEDIUM — **DISCHARGED**, both halves measured

**Catches what it must:** `node:fs` **matches**; **`node:fs/promises` matches** — the specifier that
already shipped a false pass through **271 green tests** in this repo; sub-paths, `https`, `tls`,
`dgram` all match; the zero-import network reach fails the new `fetch`/`WebSocket`/`XMLHttpRequest`
clause (baseline re-measured: **0/0/0** across 47 files).

**Without reding merged green code:** under the bar's stated production scope the grammar reds
**0 of 18** production modules. Applied to test files it would red **10 specifiers in exactly the four
merged files** that legitimately import `node:fs` — and those four are **green** (47 tests, 365 ms,
run this hop). The bar's own scope sentence and the test-file exemption are what keep it off them,
which is the ticket's *"a criterion written from it word for word would fail on green code"* standard
honoured rather than quoted. No prefix false positives (`fsevents`, `https-proxy-agent` clean).

**Residual `RF-10`:** `node:http2` is unmatched. Low; one token to fix; the production floor and the
review obligation cover it; **it does not reopen `RF-4`**, whose named build is caught.

## `RF-5` — MEDIUM — **DISCHARGED**

**SCOPE OF THE BARS, RULED** is on the page (`:241-245`) and **`BAR 1b`** is at `:248-252`,
substantively verbatim. **Previously:** every build satisfying `A1` violated bar 1, and the merged,
green, security-**positive** precedent this ticket cites by name was retroactively illegal — while
the one file that may actually spawn was **ungoverned**. **Now:** bar 1 binds the production modules
(where **0 of 18** import anything non-relative), and the file that may spawn is bound to
argument-array form with zero `shell:`. The control I demanded is on the page in a form a reviewer can
assert by `grep` — **with one tokenisation defect, `RF-9`**, in my own wording: *"zero occurrences of
`exec`"* reds `process.execPath` and `execFileSync` under a substring reading. Medium, a false RED,
not a false GREEN, one word to fix.

## `RF-6` — **NOT MINE, still open, not blocking**

`plans/board.md:3`'s *"0-of-47 … invariant BREAKS"* sentence remains false under `RULING 1`. **Owner:
the Orchestrator**, assigned and being handled this hop. I am forbidden the file and did not read a
verdict into it.

---

## The verdict

> **`ABC-042`'s security BLOCK is DISCHARGED.** `RF-1`(a) and (b) — the only items the block rested on
> — are repaired and verified by measurement. **The security half stays TRIGGERED and NOT WAIVED**, and
> `RF-7`…`RF-10` are required fixes at medium/low owned by BA/PM, carrying the same weight `RF-2`…`RF-5`
> carried: they do not block, and they were repaired anyway last hop.

**What this discharge does NOT do.**
- It does **not** pass the `Ready for Dev` exit — that is the Orchestrator's (project rule 1).
- It does **not** move the board. `plans/board.md` is the Orchestrator's file; `RF-6` is pending there.
- It does **not** waive anything. The four accepted risks (`AR-1`…`AR-4`) keep their owners and their
  named revisit triggers, and the production floor — zero `eval`, `Function`, `child_process`, shell,
  argv-derived dynamic `import(` in the entry point and resolver — is untouched.
- It does **not** license the build. These are criteria; the ASVS review of the delivered **code** is a
  separate reading at the gate, where `A6`(i)'s instrument (`RF-7`) is the first thing I will look at.

**What would have kept the block, recorded so the bar is auditable:** if the repair had left `A6` at
sampled literals, or moved the complement property into prose, or if `A9`(2) had been dropped, or if
the delete had taken a live control with it. I checked all four. It did none of them.
