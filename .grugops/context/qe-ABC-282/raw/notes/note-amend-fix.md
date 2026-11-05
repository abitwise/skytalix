# qe-ABC-282 correction to the amendment `…5833fc48`, sealed before any game: its "`--dry-run` argv is byte-equal from both checkouts" was FALSE when sealed, and its sparse set was short. Both are now fixed and read

QE sealed `…5833fc48` in the same command as the check, and the check had failed: the dry run from the small checkout exited 1 with `ERR_MODULE_NOT_FOUND` on `tools/opening-book/compile.ts`, because `tools/rating/openings.ts` imports outside `tools/rating`. The note's sentence was written before the result was read. That is QE's process error. No game was played on it.

- **The sparse set is `tools`, `src` and `data`**, not `tools/rating`, `src` and `data`. Commit `701326a5` is unchanged.
- **Read after the fix, before this note:** the dry run exits 0 from both checkouts, 42 lines each, and `cmp` reads them byte-equal. `tools/` and `src/` are `diff -r` clean against the worktree, and `tools/rating` is tree `8f03fe47`.
- The rest of `…5833fc48` stands. Nothing about the bars, builds or control changes.
