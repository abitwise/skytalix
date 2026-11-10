---
id: 20261110T132308Z-qe-e2e-observation-eb421bb9
kind: observation
by: qe-e2e
at: 2026-11-10T13:23:08Z
verified_by: 
confidence: high: every check run by QE in its own worktree at 53b4909d; the owner's macOS game not re-run (no macOS host), UNKNOWN - verify
refs:
  - qe-ABC-314
  - ABC-314
  - grugops/qe-ABC-314
  - grugops/ABC-314
  - 53b4909d
  - 860aaa47
  - README.md
  - assets/readme-art.txt
  - bin/skytalix-uci
  - orch-2026-10-30a/20261110T132002Z-orchestrator-decision-08335f5f
  - se-ABC-314/20261110T132058Z-software-engineer-observation-6c266484
  - qe-ABC-312/20261110T105823Z-qe-e2e-observation-0985a5c0
supersedes: 
seal: sha256:253ddb07243f3f65e335c455433abaaad4396ef822285cb9cee604ef4e84be51
---

# qe-ABC-314 observation: commands run and what they printed

QE ran every check below itself, in its own worktree on branch grugops/qe-ABC-314, which was cut from grugops/ABC-314 at 53b4909d (merge base with main: 860aaa47). No SE output was reused (se-ABC-314/20261110T132058Z-software-engineer-observation-6c266484). Spec: orch-2026-10-30a/20261110T132002Z-orchestrator-decision-08335f5f (A1, A2).

## Scope of the diff
- `git diff --name-only main...grugops/ABC-314`: README.md and .grugops/context/se-ABC-314/notes/20261110T132058Z-software-engineer-observation-6c266484.md. Nothing else.
- `git diff --numstat main...grugops/ABC-314 -- README.md`: 4 added, 4 removed. These are exactly lines 90, 95, 100 and 181, the four places A1 names. No other README line differs.

## The four changed lines (branch text)
- Line 90, the En Croissant row's "Run with skytalix" cell: "On macOS, the owner played one game through `bin/skytalix-uci` (2026-11-10). Not tried on Linux or Windows". The platform cells (yes, yes, yes) and the link are unchanged.
- Line 95: "It has been run on Linux only." became "It has been run on Linux and macOS."
- Line 100: "- **macOS:** `<clone>/bin/skytalix-uci`. Not run on macOS." became "- **macOS:** `<clone>/bin/skytalix-uci`. Run on macOS, in En Croissant."
- Line 181, the En Croissant lead: "On 2026-11-10 the owner followed these steps on macOS with `bin/skytalix-uci` and played one game. **They have not been tried in En Croissant on Linux or Windows.** The Windows launcher is untested." The sentence about the owner's own hand-made launcher was dropped, which A1 allows.

## Untested and not-tried statements on main
`grep -niE 'untested|not tried|not been tried|not run|have not|has not|only\.'` on main's README gives 16 lines. QE checked each line with an exact whole-line match (`grep -qxF`) against the branch README:
- 12 survive word for word: lines 72 and 74 (Levels prose, not GUI claims), the Arena row (87), the Cute Chess row (88), the BanksiaGUI row (89), "**The Windows launcher is untested.** ..." (96), "- **Windows:** ... **Untested.**" (102), Arena's lead (129, 131), Cute Chess's "the launcher has not been tried in Cute Chess. The Windows route is untested." (147), and BanksiaGUI's lead (164, 165).
- 4 are gone, and they are exactly the four A1 lines: 90, 95, 100 and 181.
- In the new text, line 181 keeps "The Windows launcher is untested." and adds "not been tried in En Croissant on Linux or Windows". Line 90 adds "Not tried on Linux or Windows".

## Over-claim read
QE read the whole GUI section again on the branch (README lines 81-187).
- No sentence claims En Croissant on Linux or Windows.
- No sentence claims any other GUI on macOS. Arena, Cute Chess and BanksiaGUI text is byte-identical to main.
- The Windows launcher is still called untested in three places (96, 102, 181), and the Cute Chess Windows route at 147.
- "It has been run on Linux and macOS." The Linux half is unchanged from main and rests on the real-engine launcher runs in qe-ABC-312/20261110T105823Z-qe-e2e-observation-0985a5c0. The macOS half rests on the owner's statement quoted in 08335f5f. QE could not re-run it.
- Line 94 ("on macOS and Linux it finds `node` even when the GUI starts it with a short `PATH`") is unchanged from main and outside A1.
- Line 181 says the owner "followed these steps". The steps are 1 (build) and 2 (add a local engine on the Engines page, select the launcher). Running `bin/skytalix-uci` in En Croissant needs both, because without dist/uci.js the launcher exits 1. A1 prescribes this wording.
- The owner's statement names one game, on macOS, in En Croissant, through bin/skytalix-uci. Lines 90 and 181 say one game, and lines 90, 100 and 181 name En Croissant. Nothing claims more than one game, a version of En Croissant or macOS, or a result beyond "played".

## Mechanical checks
- Art: `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt`: exit 0. README lines 1-10 are identical to main (diff exit 0).
- `flock <scratch>/host-test.lock npm run lint` (biome check .): exit 0, "Checked 148 files in 152ms. No fixes applied."
- README.md has no CR bytes (grep -c gives 0). No added line ends in a space.
- No absolute host path in the diff (`grep -E '/home/|/tmp/|/Users/'` on `git diff main...HEAD`: exit 1).
- `node tools/grugops/records-path-check.js --base main --head grugops/qe-ABC-314` before this note: "records-path-check: clean", exit 0.
- `git grep` outside README.md and records finds no user-facing doc that says the launcher was not run on macOS.

## Not run
- The owner's macOS game: no macOS host. It is the owner's word, quoted in 08335f5f. UNKNOWN - verify.
- GitHub's render of the changed table row: not checked. The pipe count of line 90 is unchanged (7).
- Build and tests: not run. The diff is README.md only, with no src change.
