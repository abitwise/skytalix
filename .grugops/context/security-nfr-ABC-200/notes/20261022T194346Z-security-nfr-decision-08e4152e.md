---
id: 20261022T194346Z-security-nfr-decision-08e4152e
kind: decision
by: security-nfr
at: 2026-10-22T19:43:46Z
verified_by: 
confidence: high on (b1), the input surface and AR-1; the N8-LANE reading is owed, not taken
refs:
  - ABC-200
  - EPIC-006
  - G6
  - ABC-037
  - ABC-041
  - ABC-173
  - ABC-178
  - ABC-199
  - ADR-0016
  - ADR-0035
  - ADR-0036
  - ADR-0044
  - AR-1
  - AR-096-C1CP
  - R-173-2
  - NFR-003
  - NFR-007
  - NFR-008
  - N8-LANE
  - V2.1.1
  - V2.2.1
  - V2.3.1
  - V1.3.2
  - bd745ac9
  - 1efd2cee
  - 0a07df04
  - be70482f
  - 20261022T191404Z-architect-design-decision-f612277c
  - 20261022T191359Z-architect-design-observation-0d7cbff3
  - 20261022T193034Z-software-engineer-decision-11628f2f
  - 20261022T193009Z-software-engineer-observation-f274160a
  - 20261022T193009Z-software-engineer-observation-3ccb839a
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T174056Z-release-manager-decision-edd18e94
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
  - 20261022T194345Z-security-nfr-observation-efa18ef6
supersedes: 
seal: sha256:d1fc6e888cef4e6760fb43af24c8b82cffca2ed17a385eef78619383bac99b8a
---

# ABC-200 Security/NFR gate: **PASS_WITH_RISKS**. ADR-0036 (b1) fires on limb 2 only and adds no capability. The input surface holds at L1. An `N8-LANE` reading is owed after `ABC-178`'s hop; `NFR-003` is not owed. AR-1 5a–5e are clean. No required fixes

Security/NFR, task `security-nfr-ABC-200`, 2026-10-22. The readings are in this task's observation note. Records only: no vitest and no timing. Reviewed `bd745ac9..1efd2cee` in full at tip `0a07df04`, against the Architect's ruling `…f612277c` and the SE's decision `…11628f2f`. Dial: `asvs_level` L1, `block_on` high.

## 1. ADR-0036 clause (b1): FIRES on limb 2. Ruled: no new capability
- **The canonical instrument fires limb 2 on three `cli.ts` lines:**
  - `:150`, the `process.argv` read, with its binding renamed;
  - `:167`, `const stdin = process.stdin;`, new;
  - `:200`, the book probe's `process.stderr.write` warn, moved into the `try` byte for byte.
- **Limbs 1 and 3 do not fire.** (b2) does not fire on any limb: the 4 new edges reach no holder.
- **Ruling on each line:**
  - **`:150`:** the same argv, the same exclusive validator (`resolveOptions`) and the same usage path. Only the name changed.
  - **`:167`:** an alias of a handle `cli.ts` already held twice. The token count stays 2, and `process.stdin.destroy()` became `stdin.destroy()` on the same object.
  - **`:200`:** the same fixed stderr warning, now constructed inside the `try`.
- **The `process.*` multiset in `cli.ts` code is unchanged** (10 tokens). The one new exposure is a new consumer: `startup-questions.ts` now reads the stdin handle and writes to the stdout sink. It holds no limb, imports no builtin, installs no listener and has no `try`. § 2 rules on it.
- **`ADR-0036` § 3's trigger does not fire, and neither does S1's re-armed trigger.** No new holder exists.
- **Record correction, verdict unchanged.** The page and `…f612277c` say (b1) fires on "the moved `const sink = process.stdout;`". The instrument shows that line unchanged; its number moved because the lines around it moved. The (b1) set is `:150`, `:167` and `:200`. The Orchestrator may fold this sentence into the ticket page. I did not edit it.

## 2. Input-handling surface: holds at ASVS L1
- **Validation (`V2.2.1` [L1], MET).** Each answer is checked against a closed allow-list by exact equality, after trim (and lower-case for the colour). The accepted values are imported from `cli-options.ts`, so they are the flags' own. 9 look-alikes are rejected (P4). Strict `isTTY === true` gates the questions (P10). The rules are documented on the page (scope 2–4) and in the module header (`V2.1.1` [L1], MET). Order is colour then difficulty, and a flag skips only its own question (`V2.3.1` [L1], MET). There is no `eval`, OS call or file path (`V1.3.2`, `V1.2.5`, `V5.3.2`: limb 3 is 0, and the answers reach no path).
- **The echo sanitising: holds for C0, ESC, DEL and over-length.**
  - P1 wrote 0 C0 or DEL bytes, and on a real pty the app echo of a typed `\x1b[2J` is `"[2J"`.
  - An over-cap line echoes `""` (P5). A wrong answer within the cap echoes at most 1 024 units.
  - Out/in is 1.053 (P6), so there is no amplification, and no retry cap is needed: each rejection costs one line of the user's own input.
  - **C1 code points (`U+0080`–`U+009F`) and bidi pass the filter (P2, P3):** accepted risk `AR-200-C1ECHO`, below.
- **The line limit: holds.** `MAX_LINE_LENGTH` is 1 024 UTF-16 units, moved unchanged and shared by both callers. 1 MiB with no newline frees `pending` past 1 025, and the next answer is accepted (P5). The overshoot queue stays bounded by one chunk.
- **The shared reader's single waiting slot: safe as wired, with a latent residual.** P8 measured what overlapping reads do: the first read never settles and one `data` listener leaks. `src/` has exactly 2 callers of `lineReaderOf`, and both await sequentially. `cli.ts` awaits the questions before `runTurnLoop`, and the loop awaits each read. Accepted risk `AR-200-SLOT`.
- **The new exit-70 path before the loop: acceptable.** A defect thrown by the questions, the glyph-mode session, `newGame` or `createBookProbe` now writes the fixed `INTERNAL_ERROR` line and exits 70. At base it was an unhandled rejection, which printed a stack and exited 1.
  - **Security:** neutral to positive. No internals reach the user.
  - **Reliability:** the stack is lost for these defects, the same as the loop's existing `[D31]` posture. Accepted as `AR-200-NOSTACK`.
  - **The non-defect path:** end of input at a question returns `null` before any frame and leaves the exit status unset. On a real pty, Ctrl-D at either question gave exit 0, 0 stderr bytes, no frame and no hang. Architect residual 3 reads clear on this host. QE's `A8` still owns the criterion.
- **`EPIPE` during a question:** unreachable, because questions need a TTY stdout. I concur with Architect residual 2 (`AR-200-EPIPEQ`).

## 3. NFR readings
- **`N8-LANE` (`NFR-008`): OWED. Not taken here.** The catalog says "every ticket that adds a test file inherits this". `ABC-200` adds `src/startup-questions.test.ts` (22 rows) and edits `src/line-input.test.ts`. BA/PM's ≤ 0.05 s is an estimate, not a reading. Precedent: `ABC-173` `R-173-2`. Unlike `ABC-199` (`…3a990437`), this ticket adds work.
  - **The measurement** (`ADR-0035` D2, the catalog's `N8-LANE` bullets as amended 2026-10-12; take it after `ABC-178`'s timing hop, on `grugops/ABC-200` merged up with `main`):
    - **The pair:** `<base>` is the merge-up's first parent on `main`, and `HEAD` is the merged-up tip.
    - **The set:** `src/startup-questions.test.ts` and `src/line-input.test.ts`, plus `npx vitest related --run src/cli.ts src/cli-options.ts src/line-input.ts src/line-reader.ts src/startup-questions.ts`, resolved at `HEAD`. At `<base>`, the added file is a one-assertion placeholder at the same path.
    - **The trees:** three out-of-tree trees, each with its own `npm ci`: base plus the placeholder, head, and a `cmp`-verified identity twin.
    - **The instrument:** CPU user + sys by `/usr/bin/time -p`.
    - **The rounds:** n ≥ 8 interleaved, order rotated, a fresh process per run, round 0 discarded, load1 logged before each run (not gated), and the thermal rule the Orchestrator sets.
    - **The statistic:** the median of paired head − base deltas, with the sign test on the non-zero deltas.
    - **Admissibility:** the twin is ≤ max(1.5 % of the base median, 0.010 s) with its sign at chance, and the twin R is reported (`ADR-0035` D1).
    - **The bar:** ≤ 0.650 s. The states are MET, NOT MET or UNRESOLVED, and UNRESOLVED is never written MET.
    - **Accounts:** the floor is charged by count (1 file) to the floor account. `N8-SPAWN` takes 0, because no criterion forces a spawn.
    - **Every figure carries its machine.**
  - **The hazard, stated:** `vitest related` on `cli.ts` and `cli-options.ts` may pull in the spawning suites. Their spawns are unchanged base to head, so they cancel in the delta but widen R. If R exceeds 0.650 s, the result is UNRESOLVED, and the way forward is Architect/Design's under `ADR-0035`, not this gate's.
- **`NFR-008` full lane:** not a separate reading at this gate. The next full-lane window after the merge includes the +1 file. It is owed **before merge** only if `N8-LANE` reads NOT MET or UNRESOLVED, because the published headroom is 0.605 s.
- **`NFR-003`: NOT OWED.** The questions read in canonical line mode. The kernel's tty echoes keystrokes, and the app writes nothing per keystroke. The per-line read path is the moved code, unchanged (verified mechanically). The answer work is a trim, a lower-case and a membership check over ≤ 5 values. The I/O half stays `UNKNOWN - verify`, as before, and it is not this ticket's.
- **`NFR-007`: no reading owed by this ticket.** On the no-question path (flags given, or not a TTY), the added work is loading two small modules and one early return. `A9` keeps the book read after the questions. The row stays `UNKNOWN - verify`.

## 4. AR-1 premise checks 5a–5e (and 4) on the tip: clean
- **5a–5d over `F` (44 files):** 5a, 5b and 5d are empty, and 5c is `node:fs node:readline`.
- **Check 4:** rc 0, and exactly `> !! dist/`.
- **5e over `dist/` (22 files):** empty, empty, empty, then `node:fs node:readline`.
- **The rest:** no new package import, and the built-in set is unchanged. Neither new module ships in `dist/`. `package*.json` is untouched. Clause (2) is quiet.
- **Instrument note for the Release Manager (LOW, not a risk to AR-1):** spell check 4's `diff` as `command diff`. A shell function named `diff` on this host turned its output git-style, which the `grep '^[<>]'` filter cannot read. That fails toward a drift alarm, never toward a pass.

## 5. Result: **PASS_WITH_RISKS**
- **Required fixes:** none.
- **Owed before merge (a reading, not a code fix):** the `N8-LANE` narrow-set reading in § 3, after `ABC-178`'s timing hop. Owner: the Orchestrator, who schedules it. QE or Security/NFR takes it.
- **Accepted risks** (all LOW, so none blocks under `block_on: high`; accepted by the Orchestrator under the owner's delegation `…5aaf7cec` item 1):
  - **`AR-200-C1ECHO`** (LOW; owner the Orchestrator).
    - **The risk:** C1 and bidi code points typed or pasted at a question are echoed.
    - **Why LOW:** no L1 item fails, because `V1.2.x` names no terminal context. The source is the user's own TTY, and the tty line discipline already echoed those bytes raw before the app read them, so the app's echo adds no reach. The filter matches `cli.ts` `printableOf`, and precedent is `AR-096-C1CP`.
    - **Trigger:** the questions ever echo text from a source that is not the user's terminal.
    - **Optional fix:** widen both `printableOf` copies to `U+0080`–`U+009F`, as one `XS` ticket.
  - **`AR-200-SLOT`** (LOW; owner the Orchestrator, fix by Architect/Design).
    - **The risk:** overlapping `read()` calls on one reader orphan the first read and leak a listener (P8).
    - **Trigger:** any new caller of `lineReaderOf`, or any read that is not awaited before the next.
  - **`AR-200-NOSTACK`** (LOW; owner the Orchestrator).
    - **The risk:** a pre-loop defect exits 70 with a generic line and no stack, the same as the loop's `[D31]`.
    - **Trigger:** an exit-70 report that cannot be reproduced.
  - **`AR-200-EPIPEQ`** (LOW; owner the Orchestrator; Architect residual 2).
    - **The risk:** `EPIPE` while a question waits.
    - **Trigger:** questions ever asked on a stdout that is not a TTY.
- **Compliance:** `compliance_regime` is empty. No personal data, secret or persistence is involved: the answers are not stored, logged or sent anywhere.
- **Not done here:** no board, trace, ticket or catalog edit. The trace row is in the done record, for the Orchestrator. QE's verdict (`A1`–`A9`, with `A8` on a pty) is still owed and is not pre-empted by § 2's pty reading.
