---
subtask: qe-redact-SEC-177-1
role: qe-e2e
ticket: — (SEC-177-1, owner decision; FIX-177-1)
branch: work on `grugops/redact-SEC-177-1` from `main`; do not commit on `main`
ref: .grugops/context/security-nfr-ABC-177/
width: 1
---

# Redact foreign-session captures (SEC-177-1, owner option 2) + stop capturing them

**Owner word, 2026-10-21 ~07:50Z:** "2 redact". Redact the captured foreign-session text in the current tree, in a new commit. History is NOT rewritten, and the owner knows the text stays in history.

## Read first
- Security/NFR note `…34fec102` (SEC-177-1) and `…84c196c9` (FIX-177-1).
- `.grugops/queue/done/security-nfr-ABC-177.md`.

## What counts as foreign capture
Any process data from sessions other than this repo's own runs, as recorded by the QE window, sampler and gate scripts:
- command lines;
- paths under `/Users/olgeroeselg/Projects/private/`;
- Keycloak, `kcadm`, `kubectl`, `bats`, `curl`, `docker` and OIDC-probe invocations;
- other sessions' test names.

Prose that only *names* a foreign session ("a foreign `oeselg-labs/platform` session", "a grugops-kit session ran vitest") is not a capture. Leave it, but **do** replace any full private path in prose with `<private-repo>`.

Find the starting set with:
- `git grep -l 'Projects/private'` (31 files at `76ccd413`);
- `git grep -liE 'keycloak|kcadm|oidc-login-probe|verify\.bats|kubectl'` under `.grugops/` and `plans/`.

Read before you redact.

## Do
1. **Redact in place.** Replace each foreign command line with `<foreign: CLASS>`, where CLASS is one of `vitest`, `node`, `bats`, `kubectl`, `docker`, `curl`, `shell` or `other`. Keep row structure, counts, pids, timestamps, CPU and load fields, so every recorded count and grade still reads the same. Don't touch this repo's own command lines.
2. **Checksum files.**
   - If a redacted file is listed in a `SHA256SUMS`, regenerate that `SHA256SUMS`.
   - Record each changed file's old → new sha256 in a redaction-manifest note, so earlier notes citing the old hashes stay checkable: history still holds the originals.
3. **Sealed notes.**
   - Check how `context-io.js` seals notes, and whether `readContext` still accepts an edited note.
   - If edits break the seal, don't edit the sealed note. Publish a superseding note with the same body redacted, `supersedes:` the original. Report which path you took per note.
   - Never forge a seal.
4. **Instruments (forward fix).**
   - Change the scripts that capture foreign processes (`window.mjs`, `sampler174.mjs`, `gate*.sh`, and anything else you find under `probe/`) to log only a count and CLASS per foreign process, never its command line.
   - Fold FIX-177-1 into the same `sampler174.mjs` edit: guard the regex; skip and log unparsed lines; count unparsed lines per sample; never throw from the interval.
   - Re-register the new sha256s in a note.
5. **Verify.**
   - `git grep -n 'Projects/private'` is empty.
   - The foreign-capture grep finds only prose mentions; list them in your result.
   - All `SHA256SUMS` check OK.
   - `readContext` reads every note.
   - lint, typecheck and build still pass. If `src/` is untouched, no `npm test` is needed.

## Fences
- No `src/` change.
- Run no timing.
- No history rewrite and no force operations.
- Never push or merge.
- Commit on `grugops/redact-SEC-177-1` only. The Orchestrator merges.

## Publish
- Sealed notes via the sanctioned writer (task `qe-redact-SEC-177-1`): redaction manifest, instrument re-registration, decision.
- Write `.grugops/queue/done/qe-redact-SEC-177-1.md` (brief + `## Result`) and `.claim.md`, uncommitted on `main`'s working tree, with:
  - the list of files changed;
  - the sealed-note path taken;
  - the verification output;
  - a trace row.
