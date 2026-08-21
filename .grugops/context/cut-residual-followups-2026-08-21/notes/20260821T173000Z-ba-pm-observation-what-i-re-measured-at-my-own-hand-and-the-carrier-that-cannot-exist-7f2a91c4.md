---
id: 20260821T173000Z-ba-pm-observation-what-i-re-measured-at-my-own-hand-and-the-carrier-that-cannot-exist-7f2a91c4
kind: observation
by: ba-pm
at: 2026-08-21T17:30:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ABC-117
  - ADR-0017
  - AR-N8SPAWN-DRIFT
  - N8-SPAWN
  - NFR-008
  - ABC-115
  - ABC-108
  - ABC-114
  - G-QE115-3
  - G-QE115-5
supersedes:
---

# WHAT I RE-MEASURED AT MY OWN HAND — INCLUDING A CARRIER THAT CANNOT EXIST, AND A THIRD THING I AM NOT CUTTING

Nothing in the brief is evidence and I treated it that way. Every note upstream of this hop is
**unstamped** (`context.human_admission` is `off`; no `finding` is admissible on this install), so
QE's and Architect/Design's figures were read as claims and re-derived. Tree: a `git worktree` on
`grugops/cut-residual-followups` off `main` @ `fcf12c1`. Node v24.12.0, Darwin 25.5.0 arm64.

## 1. The ids — DERIVED, not trusted

The brief says the highest existing id is `ABC-115` and tells me not to trust it. `ls plans/tickets/`
returns **106 pages**, highest `ABC-115`. Cross-checked for anything reserved above it:
`grep -rno "ABC-1[12][0-9]" plans/ memory-bank/ .grugops/context/ AGENTS.md` returns exactly
`ABC-110`, `ABC-111`, `ABC-112`, `ABC-113`, `ABC-114`, `ABC-115` — **nothing at or above `ABC-116`
anywhere in the repository.** The brief's number was correct; it is now confirmed rather than
inherited. **The two ids are `ABC-116` and `ABC-117`.**

## 2. The eight `NFR-001`–`NFR-008` rows, hashed BEFORE I wrote anything

`grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256`:

```
63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31
```

**8 matched lines.** This is the `63f66795…ca31` the fence names, **verified by hashing, not
promised.** Re-hashed after my write in the artifact note.

## 3. `ABC-117`'s mechanism, re-derived against the DELIVERED build — and it is the two ZERO COUNTS that decide it

Not QE's numbers. Mine, at `fcf12c1`, delivered build, read-only fd handed in as stdout:

```
node src/cli.ts 1</dev/null </dev/null    ->  exit 1
stderr: file:///…/src/cli.ts:159
            if ((error                         ).code !== "EPIPE") throw error;
        Error: EBADF: bad file descriptor, write
        Node.js v24.12.0
grep -c "Usage"          -> 0
grep -c "internal error" -> 0
```

**Those two zeroes are the whole argument and neither is in the upstream note.** `USAGE_EXIT_CODE`
is assigned at `src/cli.ts:140`, which is reached only *after* `process.stderr.write(...${USAGE}\n)`
at `:135` — **so it cannot have been assigned without a usage line, and there is none.** And
`main`'s `catch` at `:193` writes `INTERNAL_ERROR` (`src/cli.ts:107`) — **so it did not run either.**
The status came from Node, not from this product. `USAGE_EXIT_CODE` is `1` at `src/cli.ts:90`;
`INTERNAL_ERROR_EXIT_CODE` is `70` at `:115`. **The collision is a coincidence of value.**

QE's eleven-line out-of-product reproduction, re-run here rather than read: **`CAUGHT:` never
prints**, the banner does, status `1`. The failing write goes through `writeOrBuffer`, which defers
the `'error'` emit to a later tick, so the listener throws with no `try` on the stack. **Node's
shape, not the product's — confirmed by the same result outside the product.**

## 4. `ABC-117`'s SCOPE IS SEVEN SITES, NOT ONE NOTE — and five more that are TRUE and must not be touched

QE framed the work as *"a superseding note"*. Located by content at `fcf12c1`, the false clause is at
**seven sites across five files and two substrates**: the standing residual note `…-8a4b2e69`
(two clauses), `…-9d3a7e52:43`, `…-8c04b19d:66`, `…-6b1e4c72:46`, `plans/board.md:168`,
`plans/tickets/ABC-115-…md:302`, and **`src/cli.test.ts:2980` — a DELIVERED COMMENT**, which is
`ABC-114`'s defect class exactly.

**The trap, and it is the reason this ticket could do damage:** fourteen sites carry the sentence
`1` is `USAGE_EXIT_CODE`, and they are not making the same claim. On the **argument-refusal** path it
is **TRUE** — `:90` defines, `:140` assigns, `:135` prints the usage line — and that truth is the
basis on which `ABC-115` was cut. Those five sites (`ABC-115` page `:62` and `:117`, `ADR-0016:112`,
and the two `cut-epipe-regression-2026-08-20` notes) are **out of scope, and correcting one would
re-open `ABC-115`.** The split is on the ticket page and `A5` is written against it.

**Two files I checked and found CLEAN, so they are fenced out on measurement rather than assumption:**
`plans/traceability.md`'s `ABC-115` row (it says *"flips from exit `1` + 1542 bytes of stack to
SILENT exit `0`"* — a reading, not a mechanism), and `AGENTS.md`'s `EXIT CODES` sentence (*"1 for a
refused command line, 70 for an internal error"* — it describes what the product **assigns**, and
this path assigns nothing).

## 5. `ABC-116`'s PROPOSED CARRIER DOES NOT EXIST IN A WRITABLE FORM — the measurement that changed the ticket

`ADR-0017` §7 and the catalog's `G-QE115-3` section name the carrier as *"the gate checklist and the
`## Security / NFR triggers` block of future cuts"*. I opened the gate checklist.

`agent-factory/checklists/security-nfr-checklist.md` is:
- **read-only KIT** — `AGENTS.md` `## Kit vs state`: `agent-factory/…` is resolved from the kit root
  and **NEVER written**; and
- **machine-GENERATED** — its own header is `<!-- GENERATED — do not hand-edit. Re-run: node
  scripts/generate-asvs-checklist.js · Source: OWASP ASVS 5.0.0 -->`; and
- **about something else entirely** — 345 ASVS requirements across 17 chapters, with **zero**
  mentions of `NFR-008`, `N8-SPAWN`, `N8-LANE` or any budget of this project.

**A `T2` line written there would be outside this repository's state, would break the kit fence, and
would be destroyed by the next regeneration.** And there is no project-side substitute: `.grugops/`
holds `factory.config.json`, `install.json`, `test-skips.md` (human-owned), `context/` and `queue/`,
and nothing else. **This is a refusal on impossibility, not on taste, and it is why `ABC-116`'s
carrier ruling differs from the ruling that proposed it.**

## 6. HOW BADLY `T2` IS CARRIED TODAY — counted, not asserted

- `grep -n "N8-SPAWN" plans/tickets/*.md` — the account is named on **8 ticket pages**. **`T2`
  appears on 0 of them.**
- `grep -rn "T2" src/` — **0 occurrences** of the trigger anywhere under `src/`.
- The `N8-SPAWN` **account block** itself, `plans/nfr-catalog.md` ≈ line **1147**, does not mention
  `T2`. The trigger lives at ≈ line **1508** of a **1531-line** file, inside a dated ruling section.
- **`ABC-115` — the ticket that INSTANTIATED the account — had NO Security/NFR hop.** Re-derived:
  there is no `security-nfr-ABC-115` directory under `.grugops/context/`, against **17** such
  directories for other tickets. Architect/Design's §6 reproduces. **The account's nominal checker
  did not act on the ticket that created it, so "the checker will remember" has already been tested
  here and it failed.**

## 7. THE CARRIER I RULED INSTEAD, and why it is different in kind from a document

`T2` names *"argv, stdin script, substitution hook, settle"*. Those four are **fields of a named type
in `src/cli.test.ts`**: `ChildOptions` at **line 316** declares `input` (the stdin script), `hook`
(the substitution hook) and `timeout` (the settle), and `childOf` at **line 333** takes the argv.
**To change what an existing child does, a hop must edit that surface.** It is the only candidate
where the reader and the trigger-er are the same agent by construction — which is `T1`'s property
(the count pin forces the edit) reconstructed for a trigger that has no count to move.

## 8. THE THIRD THING — FOUND, NAMED, AND LEFT UNCUT

`ABC-114`'s page carries a pre-registered promotion trigger: *"`P1` PROMOTION TRIGGER: … **or** a
fifth false sentence found in the same two files."* Its two files are `src/cli.test.ts` and
`src/result-screen.test.ts`. **`ABC-117`'s S8 is a false sentence in `src/cli.test.ts`.** On my
reading that trigger has fired.

**I am not taking the call.** The brief fences this hop to exactly two tickets and says a third thing
is to be named and left; re-scoring `ABC-114` would be a third action on a third page. Stated with
its own doubt rather than as a verdict: `ABC-114`'s four sites mis-**price guards**, while S8
mis-states a **mechanism** — same genus (*a true-sounding sentence that is not true*), arguably a
different species. **It is the Orchestrator's to route.**

## What I did NOT measure and did NOT do

I did not re-run `N8-SPAWN`'s interleaved paired protocol and I claim no `N8-LANE` line. I did not
build `ADR-0017`'s one-line mutant — the ruling rests on it and I did not need it to cut a carrier
for a trigger the ruling already made. I did not grade `NFR-008`. **`src/` is byte-identical across
this hop** (`git status --porcelain -- src/` empty, `git diff --numstat -- src/` empty).
**`plans/nfr-catalog.md` and `AGENTS.md` were not opened for writing.** I did not move, sign or
mention-as-accepted `ABC-115`.
