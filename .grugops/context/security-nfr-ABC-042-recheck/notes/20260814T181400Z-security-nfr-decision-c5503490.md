---
id: 20260814T181400Z-security-nfr-decision-c5503490
kind: decision
by: security-nfr
at: 2026-08-14T18:14:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - RF-7
  - RF-8
  - RF-9
  - RF-10
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# `RF-7`…`RF-10` — four NEW required fixes the re-verification found. None blocks. Three are MY text.

Numbering continues from `RF-1`…`RF-6` so they are citable. **All four are criteria repairs owned by
BA/PM; no code is owed and I did not edit the ticket.** Severity is stated with its reason, and
nothing is inflated to make it block: `security.block_on` is `high` and **none of these is high**.

**Authorship, stated first because it changes how these should be read.** `RF-7`, `RF-9` and `RF-10`
are defects in text **I wrote and BA/PM implemented exactly as demanded**. They are not repair
failures. Holding a block on them would penalise BA/PM for my specification error; that is why every
one is recorded here as a follow-on at medium or low rather than as a reason the gate stays shut.

---

## `RF-7` — MEDIUM — `A6`(i)'s second half has no stated instrument, and `A6`(ii) cannot supply it

> `A6`(i): *"The accepted set is exactly `## Scope`'s closed table — asserted at the resolver: each
> documented spelling resolves, and **no other token does**."*

*"No other token does"* is a universally quantified claim over an infinite complement. Its only
instrument on the page is `A6`(ii), which is a **random sample** — and I measured it blind to a
targeted literal: a resolver recognising `--debug` ships green in **10/10 seeds**;
`P` ≈ **1.4e-9** over 1000 tokens (`…observation-93c48ef8` §3). So the build that caused the original
block still passes every *mechanically checkable* instrument on the page, and fails `A6`(i) only as
**worded**.

**Required fix (owner BA/PM), one clause, no new spawns:** state `A6`(i)'s instrument as
**structural** rather than sampled — the resolver's accepted set is **data** (a single closed
enumeration in one place), the test asserts that data **equals** `## Scope`'s table element for
element, and rejection is the **default** branch. That is deterministic against `--debug`,
`--engine-path`, prefix-matching and case-folding at once, and it is what verifying an allowlist
actually looks like. `A6`(ii) then keeps its real job: proving the rejection path behaves over a
wide corpus.

**Why MEDIUM and not HIGH — stated so the grading is auditable.** The **V2.2.1 [L1]** row asks for
positive validation against an allowlist and for that validation to be verified. After the repair it
**is**: the allowlist is documented as closed with its ASVS citation, `A6`(i) asserts exactness at
the resolver, `A6`(ii) exercises the complement as a property, `A9`(2) makes the resolver the
exclusive validator. `RF-7` is about the **strength of one instrument**, not the absence of the
control — which is the distinction my own `RULING 2` opened with. The residual build is an
undocumented flag in a ~50-line pure resolver on a local-only CLI with no network, no filesystem and
no dependencies, read line by line under a security half that is fired unconditionally. That is a
medium.

## `RF-8` — MEDIUM — `A6`(ii)'s filter clause is ambiguous, and one reading voids a quarter of its corpus

> *"filtered to exclude every spelling in the accepted set"*

Read as *drop any argv containing an accepted token*, the `--colour <word>` shape goes to **0 of
1000** — every one of them contains `--colour` — and the `--colour <anything>` build then ships green
(measured: caught **5/5** seeds under the whole-form reading, **0/5** under the token-wise reading,
`…observation-93c48ef8` §4).

**Required fix (owner BA/PM):** say *whole accepted FORMS* (`--colour white|black|random`, `--ascii`,
`--unicode`, empty argv) rather than *"spellings"*, **and** add the non-vacuity control this ticket
already knows how to write — **each of the four shapes contributes at least N tokens**, asserted
before the rejection property. Bar 2 already carries exactly this instrument (*"non-vacuity FIRST"*);
`A6`(ii) is the other place that needs it.

**Severity:** identical class to `RF-3`(ii) — an assertion that can pass by observing nothing — and
graded the same. Medium.

## `RF-9` — MEDIUM — `BAR 1b`'s `exec` token reds the correct build under a substring reading

`BAR 1b` permits `execFileSync` in sentence 1 and forbids *"Zero occurrences of `exec` and
`execSync`"* in sentence 2, asserted *"textually over the delivered diff"*. Measured
(`…observation-93c48ef8` §5): `process.execPath` and `execFileSync` both contain the substring
`exec`; the merged precedent the ticket cites by name carries **3** substring hits and **0**
word-boundary and **0** call-site hits.

The delivered test file **must** contain `process.execPath` — every spawn-provable criterion depends
on it. So a substring implementation reds the correct build **and** merged green code, and the bar
contradicts itself one sentence apart. **This is the `ABC-041` defect class, now written into a
security bar** — by me.

**Required fix (owner BA/PM), one word:** *"zero **call sites** of `exec(` and `execSync(`"*. That is
how I measured the baseline in `…observation-85881f7a` (0 across all 47 files); the bar says
*"occurrences"* and should say what was measured.

**Severity:** a **false RED**, not a false GREEN — it rejects legal builds and permits nothing unsafe.
Same grading as `RF-2`. Medium.

## `RF-10` — LOW — bar 4's grammar misses `node:http2`

Measured against 27 real specifiers: **25 correct, 2 gaps** — `node:http2` (HTTP/2 client and server,
unambiguously network) and `node:inspector` (`inspector.open()` binds a listening socket) both fail
to match. The alternation tries `http`, then requires `(\/|$)` against the `2`.

**Required fix (owner BA/PM), one token:** add `http2` to the alternation —
`/^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/`. Backtracking makes the position in the
alternation irrelevant; I ran it. **`inspector` I am NOT requiring**: it is a debugger surface, not a
data path, and adding it starts a list this repo cannot close — the compensating control below covers
both.

**Severity LOW, with the compensating control named:** the production floor here is **zero
non-relative imports** (0 of 18 at HEAD, re-measured), and the review obligation independently fires
on *"imports any Node builtin in a production module (permitted set: empty)"* — so a `node:http2`
import is caught by a human read even where the grammar is silent. Low, and it does not reopen
`RF-4`, whose named build (`node:fs`, `node:fs/promises`, zero-import `fetch`) is now caught.

---

## What I deliberately did NOT raise, so the list is not padded

- **`process` aliasing to dodge `A9`(2)** (`const p = process; p.argv`). It fails `A9`(2) anyway —
  zero occurrences is not "exactly once" — and the threat model here is an honest engineer against a
  criteria gate, not a malicious committer.
- **`node:worker_threads` as a code-execution path** absent from bar 1's token list. Real in the
  abstract; on this design it needs a builtin import into a production module that has **zero** of
  them and would trip the review obligation. Naming it would start the same unclosable list as
  `inspector`. **Recorded here as considered-and-declined, not as a fix.**
- **`--numstat` → `--name-only`** in the `A10`→`A12` move. No property rode on the counts.
