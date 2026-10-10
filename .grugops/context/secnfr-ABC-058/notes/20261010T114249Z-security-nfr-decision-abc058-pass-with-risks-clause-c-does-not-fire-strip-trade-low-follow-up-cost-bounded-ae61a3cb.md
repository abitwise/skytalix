---
id: 20261010T114249Z-security-nfr-decision-abc058-pass-with-risks-clause-c-does-not-fire-strip-trade-low-follow-up-cost-bounded-ae61a3cb
kind: decision
by: security-nfr
at: 2026-10-10T11:42:49Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-041
  - ABC-042
  - ABC-059
  - ABC-115
  - V1.2.5
  - V1.3.3
  - N8-LANE
  - N8-SPAWN
  - NFR-008
  - ADR-0035
  - AR-1
  - src/cli.test.ts
  - src/cli.ts
  - plans/tickets/ABC-058-three-security-bar-instruments-cannot-observe-their-own-clauses.md
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20261010T114147Z-security-nfr-observation-abc058-pty-zero-bytes-pin-blind-at-base-content-0154ms-04a3b792
  - 20261010T113116Z-qe-e2e-decision-abc058-verdict-pass-with-gaps-47836894
  - 20261010T113116Z-qe-e2e-observation-abc058-clause-c-question-for-security-nfr-ebb74095
  - 20261010T113116Z-qe-e2e-observation-abc058-gap-register-904bdd2d
  - 20261010T111050Z-software-engineer-observation-abc058-gates-mutants-a1-a8-cost-b98960df
supersedes:
---

# `ABC-058` Security/NFR: **PASS_WITH_RISKS**. Clause (c) does **not** fire; QE-058-a is **LOW**, goes to a follow-up ticket and is accepted until then; QE-058-c is **LOW** and accepted; the cost is bounded at 0.154 ms of content and 0 files / 0 children

Hand-authored and unsealed: this is a `decision`, not a stamp. `human_admission` is `off`, and this
install has no sanctioned writer.
- **Reviewed:** `b21ec7cf..be12015a` on `grugops/ABC-058-security-bar-instruments`. The code is
  `f2235ecd`, `src/cli.test.ts` +12/−7.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** in the observation `…04a3b792`. Every timed number carries its load1 there.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so **nothing blocks the merge of `ABC-058`**.
- **No required fix on this branch.**
- **One follow-up ticket is recommended (`F-058-1`, LOW), and two LOW risks are accepted with an
  owner.** `V1.2.5 [L1]` and `V1.3.3 [L2]` stay **MET** at the delivered build. This change arms
  their instruments. It does not move either verdict.
- **Board moves are the Orchestrator's.**

## Ruling 1. `ABC-041` clause (c) does NOT fire

**The clause, verbatim:**

> Fires if a **test** file in the diff introduces a capability this lane does not already hold:
> network, a filesystem write outside a temp dir, or a new `child_process` spawn.

**Its subject is CAPABILITY, so "a new spawn" reads on spawn capability.** That means any of:
- a new call site;
- a new executable or command;
- a new spawn option (`shell`, `env`, `cwd`, inherited stdio, `detached`);
- or a new child.

**None of them moved.** Measured:
- `N8_SPAWN` = `CHILDREN` keys = `spawned` = 27.
- One `spawnSync(` call site, at line 341 in `childOf`. Four views agree: raw, stripped, TypeScript
  scanner (QE) and the TypeScript parser (this hop, R3).
- The command is `process.execPath ENTRY_POINT --colour <token>`, with the `childOf` defaults: piped
  stdio, no `shell`.

**What changed is DATA in an argument array to an existing command, with no shell between them.**
- **Handing a C0 to this same child is a capability the lane already holds.** It has held it since
  `ABC-042`: the base token already carried ESC (`0x1b`, a C0).
- BEL is the same class.
- DEL is the class bar 3's clause (ii) already names, and `printableOf` already strips it.
- No NUL is possible in an argv.

**The disputed reading was argued at the gate, as the page asked, and it changes nothing.** Read (c)
as "the child's input changed, so review it like a spawn", and that review happened here. It found no
exposure:
- The bytes reach only the child's argv, and they come back over pipes.
- **On a RED, 0 BEL, 0 DEL, 0 `ESC[2J` and 0 `purple` reach the output.**
  - With output captured to a pipe: QE `…ebb74095`.
  - **On a real pty: this hop, R1, which closes QE's `UNKNOWN - verify`.**
  - **This holds even with the filter deleted outright.** The bar reports the bytes as integers
    (`expected [ 7, 27, 127 ] …`).

**The boundary, written down so it is not argued again at the next hop.** A change to argv or stdin
bytes **DOES fire (c)** when the changed datum:
- **reaches a shell word.** This covers any of `ABC-115`'s seven `/bin/sh -c` children, or any future
  one. There, data becomes code, and `V1.2.5` is the live question;
- **or changes which executable runs.**

Bytes in an argument array to an existing non-shell command do not fire it.

**`ABC-041`'s page is gated and is not edited.** This ruling lives here and in the trace row.

## Ruling 2a. QE-058-a: LOW, with a follow-up ticket, and accepted until it lands

**What it is.** `executableCodeOf` strips `//…` and `/*…*/` without knowing about strings. A real
direct child goes uncounted, and ships GREEN at head where base was RED, in three shapes:
- after a `//`-bearing string on the same line (`Q11`; `P2`, a URL, is the realistic form);
- between a `"/*"` string and the next `*/` (`Q12`);
- a namespace import whose `cp.spawnSync(` sits after a `//`-bearing string (`Q13`).

**The direction of the trade is the wrong one for a security instrument, and it is written down as
such.**
- It removed a loud false RED: a prose `` `spawnSync(` `` reddened a correct file.
- It bought that by adding a silent false GREEN on narrow shapes.

**Severity: LOW.**
- **The default L1→high mapping does not apply.** It is for a *failed* requirement, and `V1.2.5 [L1]`
  is MET at the delivered build: one call site, `spawnSync` the only imported name, no
  `exec`/`execSync` (R3).
- A reader who maps this as an L1 miss would get `high`. **I set LOW. The override is this gate's,
  and the risk owner is named below.** Reasons:
  1. **Two coincident accidents are needed.** One is a second child that bypasses `childOf`, against
     the file's documented layout. The other is a `//` or `/*`-bearing literal before it, on the same
     line or above it.
  2. **That literal shape is absent from all 51 test files,** apart from the strip helper's own regex
     (R3).
  3. **The pin was already blind at base to wider shapes of the same class.**
     - `Q14`: an alias.
     - **`P1`: a namespace import plus `cp.execSync("true")`, a shell child.** It ships GREEN at base
       **and** head (R2).
     - The pin is a drift guard and was never an adversary guard. QE-058-a adds one narrow hole to it.
       It does not remove a property the pin had.

**Disposition: no fix on this branch.**
- The fix is an instrument redesign: count over a token view and not over a regex-stripped string.
  That is out of `ABC-058`'s "one identifier" scope, and it needs a test-side `typescript` import this
  ticket does not justify.

**Recommended follow-up `F-058-1` (LOW, P3), for BA/PM to cut and size.**
- **The pin counts `node:child_process` use over the TypeScript parser's view.** That means:
  - imported names, of every import form;
  - **and every call whose callee resolves to a `child_process` member.**
- **That one assertion kills `Q11`–`Q13` and `P1`.** `probe/scan-literals.mjs` shows the parser view
  is a few lines.
- `Q14` (an alias) may stay out. If it does, the ticket says so.
- Folding `P1` in is BA/PM's call. **It is pre-existing and not `ABC-058`'s.** It is recorded because
  `S1`'s cut on 2026-10-10 rested on `MS4` alone, and `P1` is a shape that cut does not cover.

**Accepted risk `AR-058-STRIP`: LOW, owner BA/PM.**
- It covers the window until `F-058-1` lands, or permanently if BA/PM declines it.
- **Promotion trigger:** any diff to `src/cli.test.ts` that adds a string, template or regex literal
  containing `//` or `/*`, or a second `node:child_process` import form. That makes `F-058-1` P1, to
  be fixed in or before that diff.
- **The check:** `node .grugops/context/secnfr-ABC-058/probe/scan-literals.mjs <tree>` lists more
  than the one helper regex for `cli.test.ts`.

## Ruling 2b. QE-058-c: LOW, accepted, no ticket

**What it is.** Bar 3 samples one member per class, as the page asked (`A5` MET). A string-literal
exemption of a C0 that the token does not carry ships green, and `A8`'s number row cannot see a
string literal.
- QE showed this with TAB (`Q3`).
- The exposed case is a non-whitespace C0 that the token lacks, for example BS (`0x08`, which can
  overwrite displayed text).
- Whitespace C0s are dropped by the locator anyway (QE-058-d).

**Severity: LOW.**
- `V1.3.3` is **L2, above the active L1 floor**, and it is MET.
- The control is a numeric range compare, with its numbers transcribed by `A8`.
- An exemption needs a deliberate per-character string edit to `printableOf`.

**Accepted risk `AR-058-SAMPLE`: LOW, owner BA/PM.** It sits beside `AR-1` (C1/CSI, L2, owner BA/PM).

**The cheap option, recorded but NOT required, because requiring it is gold-plating at L1.**
- Put all 26 non-whitespace C0s plus DEL into the **same** argv token of the **same** child.
- That costs zero spawns and keeps `[2Jpurple` intact.
- Take it if V1.3.3 ever enters the active set.

## Ruling 3. Cost: bounded, not a risk, and no `N8-LANE` line is claimed

**The Engineer's two sets on the narrow set (`src/cli.test.ts` alone, n = 8), unpooled:**
- Set 1: R 0.254 s, head −0.610 s. **MET** under `ADR-0035`.
- Set 2: R 1.097 s, head −0.081 s (−0.141..+0.107). **UNRESOLVED**, charge at most +0.107 s.
- load1 6.5 / 6.2.

**Under the catalog's rule in force** (`ADR-0035` is `proposed`), both sets are admissible, and both
medians are ≤ 650 ms.

**Under `ADR-0035` if accepted:**
- Set 2 stays **UNRESOLVED**, and this gate does not write it MET.
- **Even its worst interval end, +0.107 s, sits under 650 ms.** It is not NOT MET by any reading.

**This gate's rule for that line.** An UNRESOLVED set does not block here when all three of these
hold:
- its upper charge is below the bound;
- a MET set stands beside it;
- the content is timed directly.

**The content, timed directly (R4):**
- **0.154 ms median per run** (max 0.187 ms), at load1 5.05;
- floor account: 0 files;
- spawn account: 0 children, `N8_SPAWN` 27 unchanged.

**No `N8-LANE` line is claimed by this file (the pin's comment), and none is claimed by this gate.**

**Routed to Architect/Design, as the owner of `F`** (`ADR-0035` decision 3). **Not ruled here; the
ADR is not edited.** QE's observation stands. A 27-child file read twin R 0.254 s and 1.097 s, above
the one-file `F` of 0.17 s, which was taken from child-free files.
- Under decision 3's own rule (fewer than three readings → largest R), **this file's floor is
  1.097 s, above 650 ms.** A 650 ms timing bound on `src/cli.test.ts` would therefore be refused at
  the cut.
- **The count is the pin**: `N8_SPAWN`, and the file count. `ABC-058` `A7` already does exactly that.
- The recommendation to the owner of `F` is to key `F` per file, or per "spawns children" class,
  rather than one figure for all single files.

## Checklist (`security.asvs_level` L1, cumulative)

- **`V1.2.5 [L1]`** (OS command injection): **MET.**
  - Argument-array form only, one call site, no `shell`.
  - The instrument is stronger for prose (`A1`) and weaker for the string-hidden shapes
    (`AR-058-STRIP`).
- **`V1.3.3 [L2]`** is above the floor and is reported. **MET**, and the probe now fires for DEL and
  BEL (`A5`, `Q1`).
- **`ABC-041` clauses:**
  - **(a)**, **(b)** under DELTA, and **(d)**: quiet (R5).
  - **(c)**: Ruling 1.
- **Logging and diagnosability.** A failing bar 3 names each offending code point as an integer, so
  the failure is diagnosable and never reaches the terminal.
- No secrets, personal data, network or migration is in scope.

## Not done by this gate

- No `src/` byte, `plans/board.md`, `plans/nfr-catalog.md`, ADR, `AGENTS.md` or ticket page change.
- Nothing merged, nothing pushed.
- UAT is waived if the merge keeps 0 production lines (measured 0 at `be12015a`). It is re-checked at
  merge.
- **Next:** the Orchestrator moves the ticket to `Ready for UAT`, and BA/PM cuts or declines
  `F-058-1`. `ABC-059` follows on the same file.
