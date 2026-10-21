---
id: 20261021T091230Z-qe-e2e-observation-42fba2a4
kind: observation
by: qe-e2e
at: 2026-10-21T09:12:30Z
verified_by: 
confidence: high for the readings; QE-179-a is search-bounded (phrasings listed)
refs:
  - ABC-179
  - qe-ABC-179
  - grugops/ABC-179
  - dd131b71
  - a7d64e07
  - ccccc6bb
  - plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
  - QE-179-a
  - QE-179-b
  - QE-159-d
supersedes: 
seal: sha256:9e443e5dcea6d0a79002718248c3ee8f0c262bb1d8abea377a56a6b27ae4e2bc
---

# ABC-179 QE gap register (2 entries, both INFO, neither against a criterion)

## `QE-179-a` (INFO, pre-existing, outside ABC-179's scope): status-panel's "recorded in the catalog"
- **Site:** `src/status-panel.nfr.test.ts:10-12`, unchanged by this ticket: "It lives in its own file because a `vi.mock` factory is hoisted to file scope … That is `src/gameend.nfr.test.ts`'s lesson, recorded in the catalog and followed here."
- **Reading:** I did not find that lesson in `plans/nfr-catalog.md`. `vi.mock` occurs once (`:50`, in a list of `src/history.ts` importers). "file scope" and "re-route" occur 0 times. Every "hoisted" is about hoisting work out of a timed region. "its own file" occurs once (`:25`, a harness asserting its own file and test count). The lesson is written in `src/gameend.nfr.test.ts:12` and in ticket pages.
- **Why it is not an A2 miss:** A2 reads sentences that name `plans/nfr-catalog.md`, and this one says "the catalog" without the path. Scope 4 forbids any other change in the file. It is the same class as `QE-159-d`: the header credits the catalog with words it does not hold. No earlier note or page rules on it.
- **Search-bounded:** the catalog may state the lesson in other words. If so it is not under the phrasings above, so `UNKNOWN - verify`.
- **Route:** BA/PM, to rule (cut, bundle or accept). Not edited here.

## `QE-179-b` (INFO): `A12`'s pointer elides with U+2026
- **Site:** `src/cli.test.ts:1831` names `` `expect(runtimeImporters).toEqual(…)` ``.
- **Reading:** a verbatim search for the whole span, with its `…`, finds 0 lines in `src/history-pane.nfr.test.ts`. The prefix before the ellipsis finds `:390` first.
- **Why it is not an A3 miss:** the `…` is the conventional elision, and the ticket writes the same equality the same way (`production.filter(…)`).
- **Route:** none. Recorded so the next reader knows the search key is the prefix.
