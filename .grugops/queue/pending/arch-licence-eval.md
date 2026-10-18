---
subtask: arch-licence-eval
role: architect-design
from: main HEAD (a10e09c2 + owner-word note)
branch: grugops/arch-licence-eval
worktree: ../wt-arch-licence-eval
---

# Licence evaluation: AGPL-3.0 for the built engine, MIT grugops kit, Michniewski tables (records only)

Read first:
- the owner-word note `.grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md`;
- your note `.grugops/context/arch-engine-revise/notes/…e4a7c912`, sections D13 and Q12.

Evaluate the following, using primary sources (the licence texts, Creative Commons' compatibility pages, FSF guidance):

1. Can the piece values and piece-square tables in `src/evaluate.ts` ship inside an AGPL-3.0 work if they are credited?
   - Are they copyrightable at all? Consider the facts and data doctrine and the threshold of originality, in both the EU (owner is in Estonia) and the US.
   - Can the CC BY-SA 3.0 "later version" clause carry them to BY-SA 4.0, and is BY-SA 4.0 one-way compatible with GPLv3?
   - Does that compatibility also reach AGPLv3, given GPLv3 §13 and AGPLv3 §13?
   - Check which licence the Wiki page is actually under, and its history. Where did the tables originate (Tomasz Michniewski, 2007/2008)?
   - Give a recommendation: credit as-is, or re-derive our own values. Say what credit wording to use and where it goes (a NOTICE or the
     evaluate.ts header).
2. Can MIT-licensed `tools/grugops/` sit in an AGPL repository? Cover the notice requirements, and whether those files are part of the
   "built software" (`dist/` only bundles `src/`).
3. What do the CC0 book data, mulberry32 (CC0) and splitmix64 (public domain) need under AGPL?
4. AGPL §13 network clause. The owner's web backend spawns the engine over stdio. Does running the engine behind a web UI trigger source
   offer obligations for the engine, and does that reach the separate web project? Give a plain-language consequence for the owner.
5. `-only` or `-or-later`: recommend one.

Revise ADR-0044 D13 in place, keeping the ADR PROPOSED: the licence becomes AGPL-3.0, plus the findings above. Write one decision note
under `.grugops/context/arch-licence-eval/notes/`. Label any uncertain conclusion `UNKNOWN - verify`, and say plainly that this is not
legal advice.

Fences:
- `git diff --name-only <base> HEAD -- src tools package.json package-lock.json vitest.config.ts plans` must be empty.
- No LICENSE file is added yet; that is ABC-169's job.
- No test runs. Nothing pushed or merged.
- When finished, write `.grugops/queue/done/arch-licence-eval.md` and `.claim.md`, uncommitted, in main's working tree. Include a trace
  row in your handoff.
