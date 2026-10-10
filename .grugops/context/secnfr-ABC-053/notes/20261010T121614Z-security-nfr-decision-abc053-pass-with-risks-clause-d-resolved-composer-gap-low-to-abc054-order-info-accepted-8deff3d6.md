---
id: 20261010T121614Z-security-nfr-decision-abc053-pass-with-risks-clause-d-resolved-composer-gap-low-to-abc054-order-info-accepted-8deff3d6
kind: decision
by: security-nfr
at: 2026-10-10T12:16:14Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-041
  - ABC-043
  - ABC-054
  - ABC-057
  - ADR-0029
  - ADR-0030
  - ADR-0035
  - NFR-002
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - V1.2.5
  - V1.3.2
  - V5.3.2
  - AR-053-COMPOSER
  - AR-053-ORDER
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - plans/tickets/ABC-053-frame-path-probe-measures-load-time.md
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20261010T121614Z-security-nfr-observation-abc053-child-runs-under-permission-model-composer-gap-full-lane-cost-031ms-91ac4dd3
  - 20261010T120534Z-qe-e2e-decision-abc053-verdict-pass-with-gaps-928ba81f
  - 20261010T120534Z-qe-e2e-observation-abc053-clause-d-for-security-nfr-7f43accf
  - 20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2
  - 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
supersedes:
---

# `ABC-053` Security/NFR: **PASS_WITH_RISKS**. Clause (d) fires and is resolved; (a)–(c) do not fire. QE-053-a is **LOW** and goes to `ABC-054`, accepted until then. QE-053-e is **INFO** and accepted. The cost is +0.008 s / +0.031 s CPU on the narrow set, with 0 files and 0 children added

This note is hand-authored and unsealed. It is a `decision`, not a stamp: `human_admission` is
`off`, and this install has no sanctioned writer.
- **Reviewed:** `e15eb31d..218677eb` on `grugops/ABC-053-frame-path-per-frame`. The code commit is
  `c9509031`.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** in `…91ac4dd3`. Every timed figure carries its load1 there.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so **nothing blocks**.
- **There is no required fix on this branch.**
- One LOW gap goes to `ABC-054` as a follow-up and is accepted until it lands (`AR-053-COMPOSER`).
- One INFO gap is accepted (`AR-053-ORDER`).
- The board move to `Ready for UAT` is the Orchestrator's.

## Ruling 1. Clause (d) FIRES, and the gate resolves it: the blast radius is the two files named in advance, with no new capability

- **It fires.** The diff touches `src/render-seam.test.ts`, a file under `src/` other than the
  probe. This is a fact, not a dispute. `ADR-0029` and `A5` named the file before any code landed.
- **The resolution: the radius is accepted as built.** Five facts, each read from git (R1):
  1. The `src/` diff is **exactly** the two paths `A5` names.
  2. There are **0** production lines, **0** new files and **0** manifest bytes.
  3. The second file's change is +6/−6: a header sentence, a test title, and one assertion. The
     assertion went from a **membership** check (`FRAME_PRODUCERS` contains `"render-seam.ts"`) to
     an **exact-line** match (`COMPOSITION_ROOT` equals `"render-seam.ts"`). That is stronger than
     what it replaced. QE's `Q-ROOT-RENAME-FULL` shows it reds when the root's name changes.
  4. The file's `LICENSED_DRIVERS` assertion and its `declaredList` helper are unchanged. So
     `ADR-0011` clause 3's licence guard did not move.
  5. Neither file gained a Node import. The only builtins are the pre-existing ones.
- **What (d) is FOR, answered:** it exists so that a second module cannot carry a literal or an
  ambient read one file away from an instrument that reads one file (`ABC-041` `A10`). The second
  file here is a test file. Its change carries no literal into production, and no ambient read.

## Ruling 2. Clauses (a), (b), (c) do NOT fire

- **(a):** 0 `package*.json` bytes. No `dependencies` key.
- **(b):** 0 non-`.test.ts` paths under `src/`.
- **(c): the subject is capability, as ruled at `ABC-058`.** That means a new call site, a new
  executable, a new spawn option, or a new child. **None moved:**
  - `spawnSync(` 1 → 1, with the same executable (`process.execPath`) and the same stdio
    (`ignore, ignore, pipe, pipe`), and no `shell`.
  - The argv went from the root list to `[arming, root, START_FEN, "40"]`. Every element is a
    test-file constant or a URL built from one. It is data in an argument array to an existing
    non-shell child.
  - **The child does more work, but not with new rights.** It runs two more imports inside `src/`,
    two frame calls and a 3-turn settle.
  - **Measured, not read (R2):** the delivered child passes under
    `--permission --allow-fs-read=<tree>/src/*` with nothing else granted. It has no write, network,
    child-process, worker, addon, WASI or inspector permission. A planted write, fetch, spawn and
    out-of-`src/` read each go RED with the matching `ERR_ACCESS_DENIED`.
  - The parent's new `readFileSync` over `src/` production modules (the tripwire) is read-only
    `node:fs` over the repository's own source. That is the precedent (c) names.

## Ruling 3. QE-053-a: **LOW**, a follow-up in `ABC-054`, accepted until it lands as `AR-053-COMPOSER`

**What it is.** The composer tripwire reads static `import … from "./frame.ts"` statements. A second
composer that binds `assembleFrame` through an `export … from` hop, or through `import("./frame.ts")`,
is not counted. **This hop shows it passes lint, typecheck and the full 51-file default lane** when it
is hosted in a module without its own text guards (`S-REEXPORT-RS`, `S-DYNAMIC-RS`, R3).

**This is not a security exposure.** No ASVS requirement fails, so the L1→high default does not apply.
`NFR-002` is a render-latency property, and this is a gap in the reach of its structural guard.

**Severity: LOW.** Reasons:
1. **The consequence needs a second edit, and that edit is pinned.** A second composer reaches the
   live frame path only through the entry point's wiring line. `ABC-043` `A1` pins that line
   textually, and a per-frame wrapper there is RED (`S-WRAP-CLI`). The other route is an edit to
   `turn-loop.ts`, a licensed driver.
2. **The production tree holds 0 such spellings today.** The only value importers of `./frame.ts`
   are `render-seam.ts` and `turn-loop.ts`.
3. **The build follows its ruling.** `ADR-0029` says to use `ADR-0030` decision 2's definition, and
   that definition excludes re-exports by decision.

**But the docblock overclaims, and that is written down plainly.** It says *"IT FAILS CLOSED ON A
SECOND COMPOSER"*. For these two spellings it fails **open**. `ADR-0030`'s "an under-count fails
safe" holds for `A8`'s "at least one consumer" claim. **It inverts for an equality tripwire:**
under-counting a second member leaves the result at `[root]`, which is green (R3). Neither spelling
is among the docblock's four uncovered cases.

**Disposition: no fix on this branch.** A fix here would mean either changing the instrument against
the ruling's borrowed definition, or a docblock edit that sends the ticket back through the Engineer
and QE. `ABC-054` is sequenced next on this exact file (`053` → `054` → `057`), and it is the general
consumer instrument.

**The follow-up (for BA/PM to fold into `ABC-054` at its pull; LOW):** the tripwire either
1. counts a re-export hop (resolving `export … from "./frame.ts"` one level) **and**
   `import("./frame.ts")`; **or**
2. the docblock narrows its claim to "a second composer that binds `assembleFrame` by a static value
   import". In that case it adds re-export hops and dynamic imports to "what neither phase covers".

Either closes the overclaim. Option 1 also closes the reach.

**For Architect/Design (owner of `ADR-0029`/`ADR-0030`): an observation, not a ruling, and no ADR is
edited.** `ADR-0029` decision 2's tripwire borrows `ADR-0030`'s consumer definition, and that
definition's fail-safe argument runs the opposite way for an equality check. A pointer line at
`ADR-0029` would stop the next borrower from re-learning this.

**Accepted risk `AR-053-COMPOSER`: LOW, owner BA/PM.**
- **It covers** the window until `ABC-054` lands with either option above, or permanently if BA/PM
  declines the fold. A decline must say so in `ABC-054`'s out-of-scope.
- **Promotion trigger:** any production diff for which this grep is non-empty:
  `grep -rnE 'export[^;]*from "\./frame\.ts"|import\(\s*["'"'"'\x60]\./frame' src --include='*.ts' | grep -v '\.test\.ts'`.
  So is any edit of the pinned `render:` line in `src/cli.ts`. Either makes the follow-up P1,
  to be fixed in or before that diff.
- **The trigger is armed:** the grep is empty at `218677eb`. It hits both `S-REEXPORT-RS` and
  `S-DYNAMIC-RS`.

## Ruling 4. QE-053-e: **INFO**, accepted as `AR-053-ORDER`, no fix

**What it is.** "Arming last" (`A3b` (iii)) is held by the order of statements in the child, not by an
assertion. QE measured it (`…594c5d57`):
- With the arming moved first **and** a recorder that goes deaf after it, `X5b` is GREEN.
- With the arming last and the same deaf recorder, the run is RED on `the probe is ARMED`.

**Severity: INFO.**
- It needs **two coincident faults in test code**: a reorder, and a recorder that stops recording.
- No production byte can cause either.
- It is test code guarding test code, and no ASVS or NFR level is touched.

**No fix required.** A cheap hardening is recorded, but requiring it is gold-plating at this severity.
- **The hardening:** the child pushes a phase label as each phase runs, and the parent asserts the
  sequence `load → per-frame → arming`.
- Take it if `ABC-054` or `ABC-057` restructures the child anyway.

**Accepted risk `AR-053-ORDER`: INFO, owner BA/PM.**
- **The action:** carry one test note into `ABC-054` and `ABC-057`, the next two hops that open the
  child. It says: re-run QE's `Q-CTRL-DEAF-AFTER-LOAD+X5b` (must be RED) and
  `Q-CTRL-ARMING-FIRST+DEAF+X5b` (a reorder must not ship).
- **Promotion trigger:** any diff that moves `await import(arming)` or either `loaded = []` clear
  inside the probe string. That diff then owes the phase-label assertion above.

## Ruling 5. QE-053-b, -c, -d, -f, -g: no security weight; QE's routing stands

- **QE-053-b, -c and -d** are about the docblock and its wording. They are routed to the `ABC-054` /
  `ABC-057` docblock pass, BA/PM's call. This gate adds nothing to them.
- **QE-053-f** is contrived and stays INFO.
- **QE-053-g** (Node 22) stays `UNKNOWN - verify`. Node 22 is not installed here either.

## Ruling 6. Cost: the Engineer's narrow-set reading is admissible and stands; no `N8-LANE` line is in scope

**The Engineer's set 2 is accepted** (`…3a8f5aa3`). This hop re-scored it from his TSV and
reproduced it exactly:
- n = 12, k = 3, load1 median 11.3;
- twin +0.52 %, sign 7/12, R 0.052 s;
- **head +0.008 s CPU**, interval −0.023..+0.068.

**His set 1 is correctly discarded and left unpooled** (twin +8.55 %).

**This hop's own set agrees** (R4):
- n = 8, load1 median 6.7;
- twin −0.29 %, sign 3/8, R 0.035 s;
- **head +0.031 s CPU**, interval −0.010..+0.059.

**The readings:**
- **Under the catalog rule in force:** both admissible sets are under 650 ms at their worst
  interval end (+0.068 s).
- **Under `ADR-0035` (proposed):** both sets resolve 650 ms (R ≤ 0.650 s) with medians under it.
  That would read **MET**.
- **This gate claims no `N8-LANE` line.** `N8-LANE`'s scope is files the branch **adds** under
  `src/`, and there are 0. `ADR-0035` decision 2 would read per-ticket cost on this narrow set, and
  it is not yet accepted.
- **Floor account:** 0 files.
- **Spawn account (`N8-SPAWN`):** 0 children added. `spawnSync(` 1 → 1.
- **`NFR-008`:** no verdict is claimed. Its total is a full-lane question, and `ADR-0035` decision 5
  has it with the owner.
- **`NFR-002`:** the structural guard now observes the per-frame path, measured for two game states
  (QE). No wall clock is asserted or claimed. Frame WRITE stays `UNKNOWN - verify` in the catalog.

## Checklist (`security.asvs_level` L1, cumulative)

- **`V1.2.5 [L1]`** (OS command injection): **MET.**
  - One `spawnSync` with an argument array and no shell.
  - Every argv element is a constant from the test file.
- **`V1.3.2 [L1]`** (dynamic code execution): **MET for this change.**
  - `node -e <probe>` and the child's `import(root)` are pre-existing.
  - The probe string is a constant template with no interpolation.
  - The new `import(new URL("history.ts?fixture", root))` and `import(new URL("legal.ts", root))`
    take no external input.
- **`V5.3.2 [L1]`** (file paths from trusted data): **MET.**
  - The tripwire's `readFileSync(`${directory}${file}`)` iterates `readdirSync` of the test's own
    directory.
  - That is the same pattern as the licence guard.
- **Logging and diagnosability:**
  - A failing child surfaces its stderr (`probe child failed (<status>): …`), which is pre-existing.
  - Each phase reds under its own message (`AT LOAD`, `PER FRAME`, the frames list, the per-frame row
    counts, `the probe is ARMED`).
  - The tripwire names the offending modules (`['cli-options.ts','render-seam.ts']`).
  - A failure here is diagnosable from its message alone.
- No secrets, personal data, network, migration or runtime dependency is in scope.

## Not done by this gate

- No change to `src/`, `plans/board.md`, `plans/nfr-catalog.md`, any ADR, `AGENTS.md` or the
  ticket page.
- Nothing merged, nothing pushed.
- **UAT** is waived if the merge keeps 0 production lines. That was measured as 0 at `218677eb`, and
  it is re-checked at merge.
- **Owed at merge, unchanged:** the `XS` comment-only follow-up for the three stale production
  docblocks (`src/render-seam.ts:34-36`, `src/result-screen.ts:13-15`, `src/cli.ts:8`), BA/PM's.
- **Next:**
  - The Orchestrator moves `ABC-053` to `Ready for UAT`.
  - BA/PM folds `AR-053-COMPOSER`'s follow-up into `ABC-054`, or declines it, and carries
    `AR-053-ORDER`'s test note into `ABC-054` and `ABC-057`.
  - Architect/Design may take the `ADR-0029`/`ADR-0030` pointer.
