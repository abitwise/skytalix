# se-ABC-305-main readings: `main` is in, A1 to A3 hold again, every gate and deep lane reads green by count. The read is not taken

Software Engineer, brief `se-ABC-305-main`. **Merge `35a694ee`,** parents `148c42e9` and `a8594b50`. Gates and lanes ran at `9f0048de` (the merge plus the claim), one job at a time, in one hold of the host lock, 21:57:55Z to 22:05:07Z. Every output file was non-empty when read. Raw: `raw/out/gates2/console.txt`.

- **The merge:** one conflict, `plans/traceability.md`, both sides appending rows; all kept. A rebase was not used.
- **A1:** `git merge-base --is-ancestor` exits 0 for `b297ab89`, `e763119c` and `main`, and 1 for `dd88560f`, `d5041c54` and `e9cbeb40`. `158bb992` is still the one commit with `b297ab89` as a parent.
- **A2:** outside the record paths `git diff --name-only main...HEAD` lists exactly the six paths. `git diff b297ab89 HEAD -- tools/tune src/evaluate.king-mobility.test.ts` is empty. All five `…WithoutBundle` lines stand in `src/evaluate.passer.test.ts`.
- **A3:** `git diff --name-only main HEAD -- src` prints the two test files only, and `src/evaluate-params.ts` is byte-equal. `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json` and `AGENTS.md` do not differ. **Zero production lines.**
- **A4:** `main` `a8594b50` 71 files / 2 709 passed / 0 / 0, tip 71 / 2 710 / 0 / 0, each exit 0. N + 1. Skip capture 0 at the tip and 0 on `main`. `test-skip-integrity` prints `No findings.`, exit 0. `npm run lint`, `typecheck` and `build` exit 0. `dist/` holds 24 files, 0 from `tools/`.
- **A6, the page's lanes, spelled as the page does:** `TUNE_DEEP` `tools/tune` **25 of 25**; `SEARCH_DEEP` `src/evaluate.passer.test.ts` **29 of 29**. Each exit 0, 0 failed, 0 skipped.
- **Lanes of the files arriving from `main`, each exit 0, 0 failed, 0 skipped, each count read from its JSON report:**
  - `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts` (`AGENTS.md`'s line): **270**.
  - The same prefix on `src/book.test.ts`: **36**. On `tools/grugops/qe-hop-integrity.test.ts`: **36**.
  - The same prefix on `src/cli.test.ts`: **109**.
  - All four equal `…43e6d8fd`'s counts on `main`.
- **Where the brief and the records differ:** `AGENTS.md` has a line for `uci-session` only. `book` and `qe-hop` take `ABC-307` A4's prefix. `ABC-307`'s page says `src/cli.test.ts` has no deep lane, and the file reads no `*_DEEP` variable, so its 109 are its default rows under the flag: a read of the file, not of a deep lane. I also ran `AGENTS.md`'s nearest line, `CLI_DEEP=1 … src/cli.real-engine.test.ts`, so nothing named "CLI" stays unread: **11 of 11**. That file did not arrive from `main`.
- **A7, green at the tip:** P1, `ABC-301 P1 — the hot path's E4a sum at the probed values (QE-271-h, …)`, in the default lane. P2, the seams row `… called from test files only … (QE-271-g)`. P3, the six rows of `ABC-301 QE-271-i: E4a traced and emitted … [deep, TUNE_DEEP=1]`, the emission row reading 17 value exports. `QE-270-e`'s helper is in `src/evaluate.king-mobility.test.ts`.
- **The arms:** B = `a8594b50`, H = `35a694ee`, H2 = `cp -a` of H. `diff -r --no-dereference H H2` is empty, `.test-results` included. Outside the records B and H differ in the six paths only. 19 338, 19 364 and 19 364 files. The old arms were removed; read 1's raw stays in `raw/out/n8-void/`.
- **PREREG `…987ae6ca`** was committed at `3f676dbd`, before any poll. Its one reading of my own: the 15-minute clock runs from the read hop's launch, because this note cannot know when the owner's window comes.

**Not run:** the `N8-LANE` read, so A5 has no verdict. Nothing here is a timing read and no wall is cited. The two preflight `npm test` runs are counts only.

**Foreign load:** a `vitest` of another project (`marketing`, not `grugops`) was live on the host at 21:56Z, before the hold; `ps` showed none after it. I did not sample during the hold, which held no timing read. Nothing was touched. Whatever window the owner names has to cover that project as well as `grugops`.

**`main` moved during this hop:** `a8594b50` to `53bbd275`, records only. `git diff --name-only a8594b50 main` over the lane inputs is empty, and `git merge-tree` reads it clean against the branch. I did not merge it again; the brief's merge and the arms stand on `a8594b50`.

**For the read hop:** arms and scripts are in `<scratch>/se305`. `reread.sh <lock> <scratch>/se305/arms <scratch>/se305/out/n8-r2 900`. First the lane-input check `…987ae6ca` names.
