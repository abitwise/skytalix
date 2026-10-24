---
id: 20261023T211544Z-security-nfr-decision-eaaa1133
kind: decision
by: security-nfr
at: 2026-10-23T21:15:44Z
verified_by: 
confidence: high on clause (b), the path surface and the symlink; the N8-LANE reading is owed, not taken
refs:
  - ABC-203
  - security-nfr-ABC-203
  - EPIC-006
  - ADR-0047
  - ADR-0036
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - V5.3.2
  - 55a8f4ef
  - 5e23e249
  - 8fa09e14
  - 730666fb
  - src/pgn-file.ts
  - src/cli.ts
  - plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - arch-design-ABC-203/20261023T195428Z-architect-design-decision-e6de1e00
  - qe-ABC-203/20261023T210415Z-qe-e2e-decision-f28588e1
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-1f3c2e3d
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-2f8e789e
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-5b146b4b
  - 20261023T211544Z-security-nfr-observation-37c4164f
  - QE-203-a
  - QE-203-b
  - QE-203-c
  - QE-203-d
  - QE-203-e
  - AR-203-SYMLINK
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - SEC-203-a
  - NFR-007
  - NFR-002
  - ADR-0035
  - security-nfr-ABC-200/20261022T194346Z-security-nfr-decision-08e4152e
  - security-nfr-ABC-168/20261021T143943Z-security-nfr-decision-75a45be0
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 
seal: sha256:2c4cb32481ee59cda25946706b66d225b2fb679dc91b42b1c27c69f0416b51f6
---

# Security/NFR on ABC-203: **PASS_WITH_RISKS.** No code fix is owed before merge. **One reading is owed before merge: `N8-LANE`.** QE-203-a/-b/-c are accepted as LOW. The `games` symlink is accepted as LOW. § Decision 3 gets no call-graph reach. No HIGH, so nothing goes to the owner

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in `…37c4164f`. The pair is `55a8f4ef..5e23e249`; QE's merge `8fa09e14` has the same code.

## 1. ADR-0036 clause (b): FIRES as predicted, and each limb holds on its merits. No finding
- **Limb 1** (b1) fires on `src/pgn-file.ts`'s `node:fs` import and Ruling 2's whole file. (b2) fires on `cli.ts -> pgn-file.ts`.
  - The holder binds 5 calls: `mkdirSync`, `openSync("wx")`, `writeFileSync(fd)`, `closeSync`, and `unlinkSync` on its own path.
  - It has no read, rename, chmod, rm or append. It writes a new file and never overwrites one (measured with a link at the file name).
- **Limb 2** fires on `cli.ts:245`. The only value it writes is a code that matched `^E[A-Z0-9]+$`. The fixed `catch {` echoes nothing.
- **Limb 3** is silent. The other 6 new edges reach no holder.
- **Ruling 2 now covers 3 limb-1 holders.** Every edit to `pgn-file.ts` routes here, a deleted line included. That includes QE's X1 (dropping the unlink).

## 2. § Decision 3, re-armed twice (sixth holder; first export that takes a caller value): **(b2) still gets no call-graph reach.** The residual stays LOW, owner Architect/Design
- **What a reach would close:** a new `writePgnFile(…)` call over the existing `cli.ts` edge. That call fires nothing today. I agree with the Architect's input, with the reasons measured:
  - **The path.** Only a `Date` reaches it. Even an invalid or extreme `Date` yields only `[A-Za-z0-9-]` (`…37c4164f` § 2), so no separator, no `..` and no absolute path is possible.
  - **The bytes.** A new call could carry other text, but only into a **new** file under `games/`, by exclusive create.
  - **New input needs a new token.** Text taken from the environment needs a `process.` read in `cli.ts`, and limb 2 fires on that.
  - **The test guards.** An extra write in a test child reds the guard "the neutral `games/` holds one file per `PGN saved:` child" (L4526). QE's P1, P2 and P6 each red it.
- **A widened holder fires anyway.** A string path, a directory parameter, or an overwrite or append flag is an edit to `pgn-file.ts` (Ruling 2). A second importer fires (b2).
- **Re-armed for next time:**
  - (i) a seventh holder; or
  - (ii) a holder export whose caller value reaches a **path, a command argument, a URL or a read**, not only the bytes of a new file. That includes `writePgnFile` widening beyond `(Date, string)`.
- **Recording.** The ruling is recorded here. Folding a dated line into `ADR-0036` § S1 is optional and belongs to Architect/Design. It is not owed.

## 3. The `games` symbolic link to a directory: **ACCEPTED, LOW, as `AR-203-SYMLINK`.** Owner: the Orchestrator. The fix, if a trigger fires, is Architect/Design's (`ADR-0047` Alternative 5, refuse with `lstat`)
- **Who can plant the link.** It takes another principal with write access to the cwd. Under the documented `npm run chess`, the cwd is the package root, so that principal can already edit `src/`. **Nothing new is reachable.**
- **Worst case otherwise.** The CLI is run directly from a shared, writable directory, and someone else has planted `games -> <dir>`. The user then creates **one new** ~0.5–2 KB PGN file in a directory the user can write.
  - The name is product-chosen.
  - The bytes are product-made (no typed text).
  - The mode is 0644.
  - No existing file can be replaced: a link at the file name gives EEXIST (measured).
- **TOCTOU on the cleanup unlink.** It runs only after a failed write. It can remove only a `skytalix-*.pgn` name through a link swapped in during the write. Included here, and negligible.
- **ASVS.** No L1 row fails: `V5.3.2` is MET, and `V5.2.5` [L3] is about archives.
- **Triggers** (each makes the `lstat` refusal owed before that ticket merges):
  - (a) a launch path whose cwd is not the package root by design: a `bin` for the CLI, a global install or packaging (`ADR-0018` / `ADR-0007` revisit);
  - (b) the holder gains any mode other than exclusive create;
  - (c) typed, argv, environment or secret bytes start reaching the file.
- **Close:** a trigger fires and the fix lands, or the owner retires the CLI write.

## 4. ASVS L1, "V12 (file handling)": **MET where it applies. The numbering is corrected (INFO)**
- **Wrong chapter.** The kit's checklist is ASVS **5.0.0**, where V12 is Secure Communication. Its L1 rows (`V12.1.1`, `V12.2.1`, `V12.2.2`) are **not applicable**: no network, and limb 3 is silent.
- **The real rows.** The controls the page and the Architect named are 5.0.0 V5:
  - **`V5.3.2` [L1] MET.** The path is built from internal data only: a literal plus a `Date`-derived stem. 0 user-controlled bytes, measured.
  - **`V5.2.1` [L1] N/A.** Nothing is accepted. The written file is bounded by the game: 2 134 B at 300 plies.
  - **`V5.3.1` [L1] N/A.** There is no server and no public folder.
  - **`V1.2.x` [L1] MET by construction.** All tag values come from closed sets (`…37c4164f` § 3).
  - **`V15.3.1` [L1] MET.** stderr carries only the errno code.
- **D5 MET.** Measured by QE (A10 through the CLI), and by source: `catch {` prints only `INTERNAL_ERROR`, with no message and no stack.
- **Exclusive create MET.** QE's A9; my link-at-name probe.
- **"No partial file" MET on a single fault.** QE: EFBIG left no file. It is **not** met on the double fault (§ 5).
- **INFO (no action owed before merge).**
  - `ADR-0047` Alternatives row 1 cites `V12.3.1` and the page says "V12 file handling". Those are **ASVS 4.0.3** numbers; in the pinned 5.0.0 the row is `V5.3.2`.
  - D2's "a `Date` can only yield digits" is loose: `NaN` and `-` are possible. The property that matters still holds.
  - Owners: Architect/Design (ADR) and BA/PM (page), at their next edit.

## 5. QE's findings
- **QE-203-c: ACCEPTED, LOW, as `AR-203-UNLINK`.** Owner: the Orchestrator. The fix is an XS follow-up (BA/PM cuts it, the SE builds it). **It is not a pre-merge fix.**
  - **Reach.** It needs two faults at once: a failed write or close, then a failed unlink.
  - **It fails closed.** Exit 70, the fixed `INTERNAL_ERROR` line, the screen intact, no leak. Only the exit code and a leftover partial file are wrong.
  - **No L1 row fails.** The nearest row, `V16.5.3` "fails securely", is L2, above the dial. Still, it departs from `ADR-0047` D4 ("remove that one path") and D5 ("a failure is an errno code").
  - **The fix.** Guard the cleanup unlink and report the first failure's code. The red plant is QE's resolve-hook reproduction (write EFBIG + unlink EACCES → expect `PGN not saved: EFBIG`, exit 0).
  - **Trigger:** any ticket that edits `src/pgn-file.ts` carries this fix before it merges. Ruling 2 routes every such edit here.
  - **Close:** the fix merges and QE reads the plant red-then-green.
- **QE-203-b ("no partial file" not pinned): ACCEPTED as a residual, LOW, as `AR-203-LANEGAP` (b).** Owner: the Orchestrator.
  - **Compensating control.** X1 is an edit to a limb-1 holder, so Ruling 2 routes it to this gate. QE's RLIMIT_FSIZE reading discriminates (the plant leaves 100 B).
  - **Recommended:** fold the pin into the `AR-203-UNLINK` follow-up. The same fault-injection child pins both "no partial file" and the double fault. Its spawn cost is ruled at that cut against `N8-LANE`.
- **QE-203-a (A10 not pinned at the CLI): ACCEPTED as a residual, LOW, as `AR-203-LANEGAP` (a).** Owner: the Orchestrator.
  - **What the gap covers.** A regression would make a failed save exit 70, which fails closed. It is functional, not a security exposure.
  - **Compensating control.** P7 already reds message text on stderr. QE hand-reads A10 at any hop that edits the PGN wiring in `cli.ts`.
  - **Not owed:** +1 spawn paid by the ticket. It is optional in the same follow-up.
- **QE-203-d, -e: INFO, agreed.** Both are within A5/A10 as written. No action.

## 6. NFRs: **an `N8-LANE` reading is OWED before merge**
- **Why it is owed.**
  - The ticket **adds** a test file (`src/pgn.test.ts`, 448 lines, 1 spawned child) and edits `src/cli.test.ts`: every entry-point child moves to a `mkdtemp` cwd, and 2 guard rows are added. "Every ticket that adds a test file inherits this" (`NFR-008` § standing bar).
  - Precedent: `ABC-200` (`…08e4152e` § 3).
  - The page's ≤ 0.05 s is an estimate, not a reading.
- **The writer's child cannot be netted through `N8-SPAWN`.** No criterion names it. It was added at design, after the cut ("a child … no criterion names", exclusion 3). Under the account's own wording that is a finding against the ticket and never a charge.
  - **SEC-203-a, LOW (NFR accounting).** The page says 0 spawns and the ticket delivers 1. The Architect's ruling licensed it for a measured reason (`ERR_WORKER_UNSUPPORTED_OPERATION`).
  - **Disposition:** no charge and no code action. The `N8-LANE` reading carries the child gross. Owner: BA/PM, who notes it at the next page edit.
- **The measurement** (`ADR-0035` D1/D2 as amended 2026-10-12):
  - Arms: `B` = `git archive 55a8f4ef`, plus a one-assertion placeholder at `src/pgn.test.ts`. `T` = `cp -R B`, checked identical with `diff -r`. `H` = `git archive 8fa09e14`.
  - Set: `src/pgn.test.ts src/cli.test.ts src/cli.real-engine.test.ts`, plus `npx vitest related --run src/cli.ts src/pgn-file.ts src/pgn.ts src/result-screen.ts` at `H`.
  - Run: n ≥ 8 interleaved, heap 128 for multi-file, load1 logged. Bound 650 ms CPU. `F` per set (provisional 16 % if this set has no reading).
  - **Owner: the Orchestrator, who schedules a quiet window.** QE or Security/NFR takes it.
  - **Not taken here.** This hop is records only, and the host had two other hops live (load1 6.4–9.7).
- **The full-lane `NFR-008` (R-1) reading** is owed before merge **only if** `N8-LANE` reads NOT MET or UNRESOLVED, or H−B exceeds the headroom left after `ABC-197`'s published 1.065 s.
  - QE's single `npm test` run (vitest "Duration 9.87 s", real 11.04 s at load1 ≈ 5.7) has no twin and is not admissible. **It is not a verdict.** It is why this condition is kept.
- **Write ≤ 50 ms: MET.** QE: 8.39 ms max, n = 5, M3, cold, 300 plies. One host, so other hosts are `UNKNOWN - verify`. **No catalog row is placed.** It is a ticket bar, and one reading does not warrant a row.
- **`NFR-007` and `NFR-002`: unchanged.** I agree with QE: A12's source row, one `new Date()` before the loop, no filesystem work before the loop, and nothing per ply.

## Result: **PASS_WITH_RISKS**
- **Required code fixes before merge:** none.
- **Owed before merge (a reading, not a fix):** `N8-LANE` (§ 6). Full-lane `NFR-008` only on its condition.
- **Accepted, all LOW:** `AR-203-SYMLINK` (Orchestrator; fix Architect/Design on trigger), `AR-203-UNLINK` (Orchestrator; XS follow-up), `AR-203-LANEGAP` a/b (Orchestrator), § Decision 3's residual (Architect/Design, re-armed as in § 2).
- **SEC-203-a:** LOW, owner BA/PM.
- **INFO:** the ASVS numbering (§ 4).
- **No HIGH, so nothing goes to the owner.** UAT is already signed by QE's verdict under the delegation (`…5aaf7cec`).
- **Not touched:** `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md`, the catalog, the page, ADRs. The board move (`In Security/NFR` → `Ready for UAT`) and the trace row are the Orchestrator's. Not pushed, not merged.
