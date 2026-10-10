---
id: 20261010T132352Z-security-nfr-decision-catalog-abc074-m3-only-risk003-0p8x-nfr003-no-tab-8f6351d1
kind: decision
by: security-nfr
at: 2026-10-10T13:23:52Z
verified_by:
confidence: high
refs:
  - ABC-074
  - ABC-038
  - ABC-131
  - RISK-002
  - RISK-003
  - NFR-002
  - NFR-003
  - NFR-004
  - NFR-005
  - ADR-0003
  - ADR-0034
  - ADR-0035
  - plans/nfr-catalog.md
  - plans/traceability.md
  - .grugops/context/wave-2026-09-25/notes/20261010T104855Z-orchestrator-decision-owner-word-d7a1c3e5.md
  - .grugops/context/wave-2026-09-25/notes/20261010T105406Z-orchestrator-decision-owner-word-r4-6b2f90e4.md
  - .grugops/context/wave-2026-09-25/notes/20261010T105902Z-orchestrator-decision-owner-word-adrs-91c4e7a0.md
  - .grugops/context/epic003-drop-abc038/notes/20261010T111342Z-ba-pm-decision-epic003-scope-amended-abc038-dropped-cde53f5a.md
  - .grugops/context/secnfr-ABC-127/notes/20261010T102852Z-security-nfr-decision-abc127-pass-with-risks-a7-met-guards-hold-budget-edge-red-expected-at-abc083-2468e396.md
supersedes:
---

# Catalog brought up to the owner's 2026-10-10 rulings: `ABC-074` dropped (targets hold on the M3 reference only), `RISK-003` worded on `ADR-0034` (b) at 0.8x, and `NFR-003` no longer names tab-completion. **No level, bar, target or measured figure moved.**

Hand-authored and unsealed. This is a `decision`, not a stamp: the install has no sanctioned writer, and
`human_admission` is `off`. Branch `grugops/secnfr-catalog-2026-10-10`, based on the wave at `0b6e1c25`.

## What changed in `plans/nfr-catalog.md`

1. **`ABC-074` dropped** (*"ABC-074 - rule the test out"*).
   - The "Any non-M3 machine" item in `NFR-002`'s unknowns table is CLOSED on its hardware half, by the
     owner's ruling and not by a measurement. The Node-version half stays open.
   - Every target holds on Apple M3 (Mac15,13) only. Off it, `UNKNOWN - verify` is a scope statement and no
     measurement is owed.
   - **Rows whose wording had to change: `NFR-005` only.** Two phrases ("PROVISIONAL pending non-M3
     measurement"; "that spike is the verification that LIFTS the PROVISIONAL marker") are struck through and
     kept, with a dated note.
   - **The `PROVISIONAL` marker is kept.** No measurement can lift it now. Keeping or retiring it is the
     owner's word, because he ratified it (`ADR-0003` (2c)).
   - The other rows only state `UNKNOWN - verify` off the M3, and that is still true. No change is owed.
   - **Dated notes are added at three prose places** that named the spike as forthcoming: `AR-NFR004-A`'s
     scope; the `NFR-004` fence's cell trigger, re-pointed to the next Security/NFR ruling on the M3 reference
     with `RF-1` landed; and deploy-fence item 1.
2. **`RISK-003`, on `ADR-0034` (accepted, (b) at 0.8x).**
   - **Hang guard:** the quiet printed wall × 6.3 must stay under the guard. The 300 s guard admits up to
     47.6 s quiet; gating reads 20.4–24.3 s. Precondition: `ABC-083` `A5`, under `ADR-0031`.
   - **Count gate:** it records its margin. The rule is 0.8x once `ABC-131` lands; the margin is −4 % today.
   - **A red is read by `ADR-0034` decision 3's class table.** My `ABC-127` proposal's line "one ply shallower
     = drift" is **withdrawn**: `ADR-0034` shows that a broken search reads shallower too.
   - `R1` is discharged and `AR-PUZZLE-EDGE` is not needed.
3. **`ABC-038` dropped** (*"R4: drop it"*). This item was added mid-hop by the Orchestrator.
   - `NFR-003` `Target` strikes *"and tab-completion"*. The `< 100 ms` bar is unchanged and now covers `moves`
     alone.
   - Recorded, not ruled: production `src/` has no `setRawMode`, so the terminal driver does the keystroke echo
     at today's prompt. The I/O half stays `UNKNOWN - verify`.

## Verified

- **Row hashes before and after** (`sha256` of each `^| NFR-00n |` line). `NFR-003` changed
  `79e391ff…` → `b4e0d7f2…`, and `NFR-005` changed `3b8a185a…` → `00e245db…`. `NFR-001`, `-002`, `-004`, and
  `-006` to `-009` are identical.
- **The eight-row hash** (`^\| NFR-00[1-8] \|`) moved `7dfc86fa…` → `d7ee3487…`, through `NFR-003` and `NFR-005`
  only.
- **Not applied:** `ADR-0035`, which is proposed. `NFR-008` is untouched.
- No `src/`, board, ADR, ticket page or epic byte changed. Nothing was measured.

## Handed on (each with an owner)

- **Olger Oeselg, via the Orchestrator:**
  - Does `NFR-005`'s depth-7 `PROVISIONAL` marker stay as a permanent label, or is it retired? It blocks
    nothing.
  - The reference M3 now runs Node v26.11.0 against the catalog's v24.12.0. Re-basing the reference is
    Architect/Design's for the protocol and the owner's for the level. LOW.
- **Security/NFR:** the `NFR-004` `Verified by` cell moves at its next M3-reference ruling. The cell is not
  moved here.
- **Orchestrator:** the board's `EPIC-003` row still owes the tab-completion strike (`…cde53f5a` item 4). It
  is not touched here.
