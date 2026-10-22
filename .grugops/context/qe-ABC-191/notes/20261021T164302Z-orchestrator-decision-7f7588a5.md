---
id: 20261021T164302Z-orchestrator-decision-7f7588a5
kind: decision
by: orchestrator
at: 2026-10-21T16:43:02Z
verified_by: 
confidence: high
refs:
  - ABC-191
  - AR-188-BINARY
  - ADR-0036
  - QE-191-a
  - QE-191-b
  - QE-191-c
  - 20261021T164023Z-qe-e2e-decision-16ba4076
supersedes: 
seal: sha256:d20a9bf5cb1027b064c9f2689d6733d9c15cc4dca986ca9f789af84afe2a1813
---

# ABC-191 merged to main; AR-188-BINARY CLOSED; the `--numstat` stand-in retires

- **Close.** QE `…16ba4076` (PASS_WITH_GAPS) read A2–A7: both binary plants fire at head and are silent on base's instrument, per Security/NFR `…f5843a71` § 3. The close condition is met, so **AR-188-BINARY is closed**.
- **Merge.** The page needs no Security/NFR gate (§ Security / NFR triggers). I merged `grugops/qe-ABC-191` (`b5ac124d`) into `main` under the owner's per-ticket grant. Gates on the staged merge:
  - lint, typecheck and build exit 0;
  - `npm test`: 1987/1987, `last-run.json` success;
  - skip-integrity `--skip-count 0`: `No findings.`;
  - CLI_DEEP 11/11 and PERFT_DEEP 32/32;
  - the waiver form and the `--numstat` stand-in both print nothing.
- **UAT is waived:** 0 production lines.
- **Stand-in.** From this merge on, the Orchestrator no longer runs `git diff --numstat … | awk '$1=="-"'` at routing and merge (`ADR-0036` § S1, ABC-191 block).
- **Gaps carried:**
  - QE-191-a (LOW per QE): the operator's own config or environment can still blind the one diff call. The routes are an external diff driver, `GIT_EXTERNAL_DIFF`, `color.diff=always` and `diff.srcPrefix`/`dstPrefix`. It is outside AR-188-BINARY's term. Security/NFR rates it in `security-nfr-QE-191-a`.
  - QE-191-b (INFO): non-ASCII production file names; carried.
  - QE-191-c (INFO): carried.
