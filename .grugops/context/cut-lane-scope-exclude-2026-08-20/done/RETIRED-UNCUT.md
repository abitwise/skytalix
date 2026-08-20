---
task: cut-lane-scope-exclude
role: ba-pm
status: RETIRED UNCUT
at: 2026-08-20T13:00:00Z
---
**Never ran, and correctly so.** The owner did the work himself at `2bef492`
(`biome.json` + `vitest.config.ts`) while `ABC-113` was in flight. Cutting a ticket for
already-delivered work would be theatre, so this is retired rather than dispatched.

Verified at retirement: the default lane (no `--dir`) now reports **40 files / 1207 tests /
skip 0**, identical to the contained lane, and `npm run lint` exits **0** over 72 files.
**Both are defects four hops worked around by hand.**

What is NOT retired with it: the Orchestrator's routing note in `../notes/` records WHY the
change was kept out of `ABC-113` (it would have destroyed `A4`'s pin), and that reasoning
still stands — the change rode in on the branch beside the ticket, not inside it.
