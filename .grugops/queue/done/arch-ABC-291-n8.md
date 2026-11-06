---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T22:30:13Z
subtask: arch-ABC-291-n8
role: architect-design
ref: .grugops/context/arch-ABC-291-n8/
branch: new grugops/arch-ABC-291-n8 from main — worktree .claude/worktrees/arch-ABC-291-n8
width: the route for NFR-008 UNRESOLVED on ABC-291. No src, no test, no run: QE's raw files are enough.
---
# NFR-008 on ABC-291: H − B +0.155 s against ≤ +0.10 s
Read qe-ABC-291's …024bbd63, …5826dcf6, raw/out/read-a1/n8 (worktree .claude/worktrees/qe-ABC-291, read only), …b9038a14, …f30bd604, …f40ce634, ABC-307's rows and records. Not a void, not a miss, so no re-read of this lane as it stands. K4 is spent, met by 0.0033. Production files do not move.
My route, unless you find it wrong: a row move first, the standing rule's first step, then a new graded read under a new note. No bar moves, and I am not waiving a sealed rule on a close figure (…f40ce634 1).
1. Where the wall goes: the added rows cost 34 ms, shared rows about +100 ms in-thread, uci-session +83 ms, CPU +0.76 s. Is it the term's tree (more nodes), the build, or noise? Say what the evidence supports and what stays `UNKNOWN - verify`.
2. Row supply: name candidate rows that can leave the default lane, with their remnants and mutant reads, as in ABC-307, and how much they buy. Aim: H − B at most +0.10 s with margin, not at the edge. If the supply cannot buy that, say so plainly: that goes to the owner, as a named moved bar, with the cost to later terms (ABC-290, ABC-292, ABC-293) stated.
3. Does this row move ride on ABC-291's branch, or is it its own ticket as ABC-307 was?
4. What carries to the new read: may K4, K5 and K0–K3, K7 carry by production-file identity, as …9e2facfa carried P6 and P7? Row-move test changes only.
5. n8-grade.py prints "NFR-008 MET, graded" from three legs while its budget line prints OVER. Name the correction for the new read's PREREG.
If an item would move a bar, stop and say so. Fences: ADRs and your records. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**2026-11-06, Architect/Design. All five items answered. Two stopped at a bar, as the brief says. Records only, on `grugops/arch-ABC-291-n8` from `main` `fcc59889`. Notes `…64648b53`, `…61a939d3`. `…a9e7118e` read on `main` at `97a0acf0`. No test, build, engine or read run. No ADR, ticket, EPIC, board, `src/` or test edit. Nothing pushed or merged, nothing left running.**

- **The route:** as written it fails if the rows merge first. They would sit in both arms, and H − B would not move. It holds only riding on `grugops/ABC-291`, in the one merge. The "standing rule" is written for a lane at or above 9.6 s, and H is 9.30 s, so the route is a reading.
- **1 (the wall):** the cost is real, about +0.16 s, with a read noise of 0.06 s, so the bar sits inside the spread. Added rows about +0.017 s. Shared rows +0.03 to +0.05 s, where the tree is enough but not shown. The other +0.09 to +0.13 s is `UNKNOWN - verify`, outside row bodies. "+100 ms" and "+83 ms" are H's alone; H2 reads +53 ms. QE's run files in `<scratch>/qe291` can answer it with no lock. I did not open them.
- **2 (supply): stopped.** Nine candidates, N1 to N9, 12 rows, about 225 ms saved, −0.08 to −0.11 s, against an aim of −0.13 to −0.175 s. They reach the bar at the edge, about 53 to 82 %, and they are the last rows of 20 ms or more. **Rows alone cannot buy the aim.** Named for the owner, not ruled: `ABC-291`'s leg reads ≤ +0.20 s on `…024bbd63`'s read. The cost to `ABC-290`, `ABC-292` and `ABC-293` is tabled in `…61a939d3`. One unread lead, two file folds, is not counted.
- **3 (ride or ticket):** it rides, in the one merge, if any row moves. **Stopped on one reading:** keeping B at `780d9021` after a merge to `main` is a moved bar by another name. H3 may be ruled games first: it moves no bar, and a C2′ miss closes this for free.
- **4 (carry):** K4, K5, K0, K3 carry. K1 and K7 carry if their files are untouched. K2 in part. Gates, the run rule and `NFR-008` do not. The key is a new one, over non-test files, since `src`'s tree will differ from `…9e2facfa`'s. His ruling must come before any new figure. § 7 still stands.
- **5 (grader):** one state line from § 5's four legs; x(k) added to NOT MET; flags read; the old line renamed; the budget compared on a rounded value. Today 11 of 60 exact +0.10 s differences read OVER by floating-point error.
- **Every ms and second of forecast is an estimate,** on `se-ABC-305`'s census at `35a694ee`. No remnant is built and no mutant is read.
- **Owed:** the Orchestrator: `…61a939d3` § For the Orchestrator, six items. BA/PM, if ruled: `ABC-291`'s page, and a budget line or a stated none on the three term pages.
