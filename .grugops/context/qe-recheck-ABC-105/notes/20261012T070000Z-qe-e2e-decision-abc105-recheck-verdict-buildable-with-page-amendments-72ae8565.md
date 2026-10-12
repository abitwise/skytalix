---
id: 20261012T070000Z-qe-e2e-decision-abc105-recheck-verdict-buildable-with-page-amendments-72ae8565
kind: decision
by: qe-e2e
task: qe-recheck-ABC-105
at: 2026-10-12T07:00:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - N8-LANE
  - ADR-0035
  - plans/tickets/ABC-105-qe-hop-detector.md
  - 20261012T065553Z-qe-e2e-observation-abc105-recheck-sweep-table-and-data-premises-298a669e
supersedes:
---

# QE pre-build re-check of `ABC-105`: BUILDABLE WITH PAGE AMENDMENTS

Read at `main` `21980135`. For the parts that matter here it is byte-equal to the brief's `05a1f11d`. This is an
agent `decision` and not a stamp. Nothing was built, no suite was run and no timing was read. Every number
is in the sweep note `…298a669e`, with its command.

**Why not a re-cut.** The design holds on today's data.
- The four-condition rule is sound.
- Plain `String.split` parses every QE and Security/NFR note.
- The `ABC-062` refs-only false pass is still reproducible on real notes, so `A3` still earns the ticket.
- The 38-id grandfather set is reconstructable exactly from git.
- `A9` behaves as written.

**Why not as written.** Two criteria do not hold on the real data as the page words them.
- The snapshot's generation point contradicts itself, and the reading in § Dependencies would grandfather
  93 post-directive tickets (`QE-105-a`).
- `A2`'s `ABC-076` fails a literal "refs contains `T`" (`QE-105-b`).

Both are wording fixes for BA/PM. They need no redesign.

## Item readings (brief 1–6)

1. **Data premises hold, and the counts moved.**
   - Today: 2607 notes, all with fences; 622 `by: qe-e2e` (filename agrees 622/622); 139 `qe-e2e` decisions.
   - The page's figures were 1288 / 223.
   - 30 Orchestrator notes have no `kind`/`by`, and 7 have inline `refs: […]`. No QE or Security/NFR note
     is among them.
   - Folder forms holding QE decisions: `qe-ABC-*` 67, `quality-gate-ABC-*` 23, `ticket-to-pr-ABC-*` 13,
     `qe2-ABC-*` 6, `uat-*` 4.
   - The rule cannot see `residual-G-QE115-5-*` (`QE115`, no `abc`).
   - The hardening clause rejects all 13 `ticket-to-pr-*` folders (3 of them post-cutover).
2. **Criteria against real data:**
   - `A1`: holds. `ABC-061` has 0 `qe-e2e` notes of any kind.
   - `A2`: holds for `ABC-031`, at `quality-gate-ABC-031-qe-2026-08-17/…-dbbb1b96`. **It fails for `ABC-076`
     under exact refs** (QE-105-b).
   - `A3`: holds. The four-condition rule rejects `ABC-062`, while refs-only covers it with 2 notes under
     `quality-gate-ABC-066-qe/`. The board row says three.
   - `A9`: holds. `ABC-072` gets the substitute, under `secnfr-ABC-072/…-29849eeb`. `ABC-073` is not
     covered.
   - `A1`, `A2`, `A3` and `A9` hold **only if** the cutover set is the 38-id set (QE-105-a).
3. **Sweep at the tip, with cutover at the directive commit `9998a544`:**
   - 131 `Done` rows, 38 pre-cutover, 75 covered (`qe-e2e`), 2 covered (substitute: `ABC-072`, `ABC-147`).
   - **16** not covered under exact refs, **15** under token refs.
   - Of those: 6 dropped, 3 owner-close, 1 verified elsewhere (`ABC-073`), 6 QE'd off-convention, and **0
     real misses**.
   - Naive `ABC-\d+`: 1217 hits, 137 distinct.
   - `ABC-116`, `ABC-117`, `ABC-145` and `ABC-148` are covered. The `bapm-fold-*` folders hold no QE notes and
     are not `Done` rows.
4. **Snapshot and cutover.** "As it stands when this lands" today means 131 ids (1048 B) and 0 in-scope
   rows. That is wrong (QE-105-a). The snapshot is still the right mechanism, if it is the 38-id set (304 B).
5. **Moved constraints:**
   - `AGENTS.md` is 24,545 B, leaving 31 B (QE-105-f).
   - `N8-LANE`'s text is stale (QE-105-i).
   - `A8`'s 32/32 still matches the file. A static count of `src/perft.test.ts`, unchanged since `a517ff74`,
     gives 28 table rows + 4 `it` = 32 deep / 24 default. Not run.
   - **The `P2` demotion trigger has not fired.** No manual `--ticket` or QE-note check is recorded in the
     Done routine. `memory-bank/`, `AGENTS.md`, board § Conventions and `factory.config.json` gave 0 hits.
     The only "demotion trigger" hits in today's notes belong to `ABC-116`'s `T2`.
6. **Testability.**
   - `A2`, `A3` and `A9` are testable on real notes with no fixture, which satisfies Test note 1.
   - `A5`'s negative case exists in no real folder, so it needs synthetic input. 0 naive collisions were
     measured.
   - `A6` needs synthetic trees.
   - `A1`, `A3` and `A9` need "remove an id from the snapshot", and the page names no seam for it
     (QE-105-h).
   - `A4`'s exact numbers move at every `Done` move. QE reads them at the build SHA by hand count, not as a
     pinned test.

## Gap register (for BA/PM; criteria not edited here)

| id | sev | page line | measured reading | suggested amendment |
|---|---|---|---|---|
| QE-105-a | **HIGH** | § Scope 3, l.95–97 ("every ticket already in `Done` on 2026-08-17 … (38 ids)") vs § Dependencies, l.202–205 ("from the board **as it stands when this lands** … `A4`'s number is re-measured") | A land-time snapshot today holds 131 ids and leaves 0 in-scope rows. The `A4` findings list, `A9`'s `ABC-073` exit 1 and the 93 post-directive tickets then all go silent, which is the drift this ticket exists to catch. "Done on 2026-08-17" also reads two ways: 38 at `9998a544` and `e908b8e6`, or 40 at `main`'s `e23c8484`, which adds `ABC-031`/`ABC-076` and would put `A2`'s two tickets out of scope | Fix the set as the `## Done` rows of `git show 9998a544:plans/board.md` (the directive commit; the same 38 ids as the cut commit), parsed by the tool's own parser and committed once (38 ids, 304 B). Strike the § Dependencies ordering note. `A4`'s "pre-cutover" then always reads 38 |
| QE-105-b | **HIGH** | § Scope 1, l.55 ("its `refs:` list contains `T`"); `A2`, l.141–144 | `ABC-076`'s 2 QE decisions cite the ticket only as `plans/tickets/ABC-076-…md`. With an exact element match `A2` exits 1. With "a refs element names `T` under `A5`" it exits 0, and among the 93 post-cutover rows only `ABC-076` flips. `A3` (`ABC-062`) and `A9` (`ABC-073`) are unchanged | Define "contains `T`" as "some refs element names `T` under `A5`'s normalisation". Keep `ABC-076` in `A2` as its real-data proof |
| QE-105-c | MEDIUM | `A4` amendment, l.155–168 (7 ids; classes dropped / owner-close / real miss) | 15 findings (16 under exact refs). Added: `ABC-038`, `ABC-111` (dropped); `ABC-150` (owner-close at `ADR-0041`); `ABC-044`, `ABC-110`, `ABC-113` (QE decisions only in their own `ticket-to-pr-*`); `ABC-070`, `ABC-085` (QE verdict filed as `kind: observation`). 0 real misses | List all 15 by id and add the class "QE'd, off-convention", so the builder does not loosen the rule to clear them. Expected at `21980135`: 131 / 38 / 75 / 2 / 15, re-measured at build |
| QE-105-d | MEDIUM | § Scope 2, l.78–79 ("same exit contract"); Test notes 3–4, l.224–228 | 15 standing findings and no override mean `--sweep` exits 1 on every run. Test note 4's example ("38 Done rows, 20 pre-cutover, 18 in scope, no findings") is impossible: all 38 were pre-cutover | State that `--sweep` exits 1 at build with the named list, and whether those findings stand permanently (read by a human) or get a disposition route (owner / BA-PM call). Rewrite Test note 4's example |
| QE-105-e | MEDIUM | `A6`, l.189–190 ("malformed front matter … `UNKNOWN - verify` finding") | 0 notes lack fences. But 22 lack `kind`, 30 lack `by` (Orchestrator `type:`/`role:` form), 7 use inline `refs: […]` and 17 quote values. If a missing field counts as malformed, every sweep carries 30+ permanent `UNKNOWN` findings | Define "malformed" (e.g. no closing fence, or an unparseable line) and the domain checked. State the expected count at build |
| QE-105-f | MEDIUM | § Scope 1, l.69–70 ("documented in `AGENTS.md` by this ticket"); `A7`, l.191–194 ("the new `AGENTS.md` paragraph") | `wc -c AGENTS.md` = 24,545 B against the 24,576 B target, so **31 B** remain. The convention plus the ceiling cannot fit, and even a one-line pointer is larger | Put the convention and ceiling paragraph on a named `memory-bank/` page. `A7` reads that page plus an `AGENTS.md` § QE validation authority pointer, whose bytes the Scribe frees at the pull |
| QE-105-g | MEDIUM | § Scope 1, l.51–57 (the four conditions) | This hop's own decision note meets all four conditions for `ABC-105` (`by: qe-e2e`, `decision`, refs `ABC-105`, folder `qe-recheck-ABC-105`). Once `ABC-105` is built, `--ticket ABC-105` passes on a **pre-build** investigation, even if no post-build QE hop runs. That is an honest note, not a forgery | BA/PM picks one: exclude a folder form (`qe-recheck-*`), add a temporal condition, or name it in `A7`'s ceiling |
| QE-105-h | MEDIUM | `A1` l.137–140 and `A3` l.145–149 ("removed from the snapshot"); `N8-LANE` l.209–211 (≤ 2 spawns) vs the 2026-10-11 re-score (0 spawns); Test note 3 | The page names no seam for removing an id without editing the committed file or adding a flag. Exit codes (`A1`, `A6` exit 2) need a spawn or an exported entry. Symlinking the context is refused by l.213. Copying it is 5033 files / 34,140 KiB | Name the seam. For example, export `coverage(id, notes, snapshot)` and `main(argv) → code`, with the test importing them over real notes and an in-memory snapshot minus the id (0 spawns). State that this is not an override, and reconcile the spawn count |
| QE-105-i | LOW | `N8-LANE`, l.209–211 | Stale against the re-score (1 file, 0 spawns), `ADR-0035` P3 (650 ms is a fixed number under R-1), the 2026-10-12 floors (a narrow set takes the provisional 16 % until its first 4.1 reading; vitest 4.1.11, runner off, `maxWorkers: 2`) and P1 (`tools/` is collected by `npm test`; `vitest.config.ts` excludes no `tools/`) | Rewrite the line once in today's terms |
| QE-105-j | LOW | `A8`, l.195–196 ("0 files under `src/`") vs l.209 ("or its `src/`-side equivalent") | A `src/`-side test file would fail `A8` | Strike "or its `src/`-side equivalent". `PERFT_DEEP` 32/32 still matches the file. Whether to keep it on a 0-`src/` ticket is BA/PM's call |
| QE-105-k | LOW | l.44–46, l.90–91, l.227–228, l.238 | 1288 / 223 are now 2607 / 622. "20 of 38" is **not reproducible even at the cut's own tree**: the four-condition rule flags 30 of 38 at `e908b8e6`. The loose rule reproduces 9 exactly | Mark the counts as history, and either correct 20 to 30 or strike it |
| QE-105-l | LOW | Board row (Orchestrator's) and note `…b7f30d14`: "three" `qe-e2e` notes cite `ABC-062` | 2 notes: `…e9ea09f5` (decision) and `…d73cfa8f` (observation) | Information only. `A3` holds |
| QE-105-m | LOW | front matter l.6 and l.236 ("`M` (5)") | Board § Conventions: `XS=1, S=2, M=3, L=5, XL=8` | Use `M (3)` or `L (5)` |
| QE-105-n | LOW | § Scope 1 convention | `residual-G-QE115-5-2026-08-21` spells its ticket `QE115`, which the rule cannot see | Say the folder must spell `ABC-xxx` |
| QE-105-o | LOW | the board row for `ABC-105` (Orchestrator's), and page length | The row still opens "DoR 9/10 ⚠️x1" while the page is 10/10. The page is 350 lines against the ≤ 300 median budget (process rule 2) | Orchestrator: refresh the row lead. BA/PM: move measurement prose to notes |

**Counts:** 2 HIGH, 6 MEDIUM, 7 LOW. QE-105-a and QE-105-b must be amended before a build starts. The MEDIUMs
should be settled at the same pass, because each one changes what the builder writes or what QE can test.
