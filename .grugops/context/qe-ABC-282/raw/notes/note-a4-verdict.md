# qe-ABC-282 verdict, re-issued after A4: **PASS_WITH_GAPS, NO BLOCKING GAP. It signs UAT.** A4 read and MET on both sides. Every other bar stands as read on `04ebeb7e`. Supersedes `…a6a2ba28`

QE/E2E, read at `04ebeb7e` (`src/` `d235214c`) against `22931005`, by PREREG `…6b4674af` § 9 and `…416a183f`'s verdict rules. Under the owner's delegation of 2026-10-22, PASS_WITH_GAPS with no blocking gap signs UAT.

| bar | state | note |
|---|---|---|
| A4 M1 | **MET, both sides.** 0 losses on time; closest call 6 705 ms White, 1 100 ms Black | `…1434a7d1` |
| A4 M2 | **MET, both sides.** 12 side-periods; least 93.16 % White, 95.77 % Black | `…1434a7d1` |
| A6 | MET, 45 / 32 / 23 = 56.5, 100 / 100, 0 faults, 0 on time. Not re-played | `…b4427cbd` |
| A0, A1, A2, A3, A5, D12, non-clock identity | MET | `…e4b8527a`, `…ee3bb3dc` |
| lane budget | MET, +0.020 s; `NFR-008` 9.48 s | `…dfa196bf` |
| gates, skips, -t lines | MET | `…e4b8527a` |
| QE-300-a | closed | `…b4427cbd` |

- **F1–F7: none fired.** F5 is now read: A4 is not a miss, so nothing goes to Architect/Design as a stop.
- **Blocking gaps: none.** QE-282-a is closed (`…4f8f7f5d`). Open and non-blocking: b, k MEDIUM; d, f, g, l, m LOW; c, e LOW as recorded; h, i, j, n INFO.
- **Why PASS_WITH_GAPS and not PASS:** A4 was not ALONE (QE-282-k), an A7 gap by `ABC-223`'s rule, on top of the gaps already named.
- **At merge:** QE-282-j's count re-read stands, because `ABC-304`'s test files are on `main`. The game reads are not re-played.
- QE signs the verdict only. The merge and the board moves are not QE's. Nothing was pushed or merged.
