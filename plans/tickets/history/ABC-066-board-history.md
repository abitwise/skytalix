# ABC-066 — board history

Per-hop board headers for `ABC-066`, archived verbatim before each replacement, newest last.
The board carries one header at a time; this file is where the superseded ones live, because they
carry content that exists nowhere else.

## Hop 1 — the ticket cut on the owner's direct request, and the stranded work it found (Orchestrator, task `usage-line-fix-2026-08-15`)

> Archived VERBATIM per the board's own rule, BEFORE replacement. Source md5 `842505145b68804751c998509b9cac0d`, 2013 characters.
>
> Two of its statements were overtaken by events within the day and are corrected in the incoming
> header, not here: `AGENTS.md` now carries the owner's 2026-08-15 grants (the three commits it
> reports as unmerged are in `main` at `c732fe2`), and the queue claim it declined to sweep has
> been moved `claimed/` → `done/` as FINISHED work. The line below is preserved as written.

_Updated: 2026-08-15 by the Orchestrator (task `usage-line-fix-2026-08-15`, Workflow 03): **`ABC-066` CUT ON THE OWNER'S DIRECT REQUEST — the defect HE found by hand, in one command, that nineteen passing scenarios do not ask about.** `src/cli.ts:53`'s usage line instructs the user to type the command that produced the error he is reading; `npm run chess -- ` occurs **0** times in the program's output and **0** times under `src/`. **BA/PM RULED IT A SEPARATE TICKET, NOT AN AMENDMENT TO `ABC-065`**: the two diffs are disjoint and neither's criteria can be satisfied by the other's diff, and folding would break `ABC-065`'s own zero-production-lines clause — **not the `ABC-040` failure, which is two rows for one ticket, where this is two tickets over two files.** A third relationship was found and fenced rather than left to collide: `ABC-062` already owns *a usage line is written and its vocabulary matches*; `ABC-066` owns *its content is a command that runs*, pinned so either merge order stays green. **A GUARD TEST IS REQUIRED, NOT OPTIONAL — the word `usage` appears in the whole suite exactly once, inside a comment, and QE proved the string can be deleted with 856/856 still green: the wrong line passed two gates, a 30-file suite AND a 19-scenario pack.** `S`, `P1` (nothing in the product is broken), **DoR 10/10**, `Backlog`, 223 lines against rule 2's 300. `Ready` stays 0/8. **STRANDED WORK FOUND AND NOT TOUCHED: `main`'s `AGENTS.md` carries ZERO mentions of the owner's 2026-08-15 grants and still reads "Never deploy" — the text contradicting the owner's own directive — while three gated commits sit unmerged on `grugops/agents-md-owner-grants`, and its queue claim is now 6h54m past a 30-minute TTL.** Escalated to the owner, NOT swept: a mechanical sweep returns finished work to `pending/` and invites a redo, and merging a branch that rewrites deploy safety text is not a coordinator's call at a close. Detail lives in `.grugops/context/usage-line-fix/notes/`, never here._
