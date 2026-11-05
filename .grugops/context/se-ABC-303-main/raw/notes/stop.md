Cause: engineer

# se-ABC-303-main STOP: 19 rows arriving from `main` pin W1 on the shipped path, and the bundle moves what they read. Settling them needs a moved pin, so none is moved

Tree `c0c5b84c`, `main` `572edf13` merged at `39a5b912`. Nothing tuned, no expectation moved. All 19 are `ABC-282` rows. `main` read them green at `a6ae8227` (`…16e0ec2c`). They are the only reds: no bar of `ADR-0056`'s tables is red, and no read shows W1 or the merge at fault.

**Default lane, 3 rows, so `npm test` exits 1.**
| row | pin | reads |
|---|---|---|
| `src/engine.test.ts` A1 (a) | `base.depth` 3 | 4. Head depth 3, 1 262 nodes; base 2 197 |
| `src/engine.test.ts` A2 (a) | kept `a1b1`, 450 | `a1f6`, 475, partial. Incumbent `a1e5`, 484, unchanged |
| `src/uci-session.test.ts` D5 | `info depth 2 score cp 450 … pv a1b1`, `bestmove a1b1` | the same position keeps `a1f6`, cp 475 |

**Deep only, 16 rows.** `src/engine.test.ts` A0-1 (six) and A0-2 (four); `src/uci-session.test.ts` A0-3 (six). They pin `main`'s shipped counts; the new reads are in the readings note.

**Why these are not a wiring defect.**
- W1 still acts on the shipped path: A1 (a)'s head stops at depth 3 with 0 nodes of depth 4, and A2 (a) keeps a move that beat the incumbent.
- On `chooseMoveWithoutQuietBundle` with `softMs`, a scratch diagnosis (`raw/w1probe.ts`, nothing committed), A1 (a) reads base depth 3 and A2 (a) keeps `a1b1`, 450: the pinned figures.
- S1 12 / 12 and S2 58 / 58 hold against `572edf13`.

**Why I stopped.** The brief says a conflict settled by moving a value or a pin is a STOP, and it names no such row.
- Moving the figures is a pin move. `ADR-0071` D8 says the rows bind and the numbers are the base's, and D12 item 4 re-reads them, but no record on this ticket names these rows for a move.
- A re-point is not open either. `ADR-0072` d11 says "The doors take no `softMs`", and `ADR-0071` D12 item 6 says no test hands them one. The two session rows' kind, D5 and A0-3, run through the session, which has no door.

**For the Orchestrator or the Architect.** The ruling needed is which form these 19 rows take with the bundle on. `ABC-303` test note 4 and `ADR-0072` d7 cover rows that pin shipped-path counts; whether they reach W1's rows is `UNKNOWN - verify`. Not to be retried without that ruling: any edit of these rows.
