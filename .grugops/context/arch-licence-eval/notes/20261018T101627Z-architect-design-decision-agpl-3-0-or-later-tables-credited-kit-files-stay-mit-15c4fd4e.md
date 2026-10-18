---
id: 20261018T101627Z-architect-design-decision-agpl-3-0-or-later-tables-credited-kit-files-stay-mit-15c4fd4e
kind: decision
by: architect-design
task: arch-licence-eval
at: 2026-10-18T10:16:27Z
verified_by:
confidence: medium
refs:
  - ADR-0044
  - EPIC-007
  - ABC-169
  - ABC-170
  - ABC-172
  - ADR-0023
  - src/evaluate.ts
  - src/levels.ts
  - src/zobrist.ts
  - src/engine.test.ts
  - data/opening-book/ATTRIBUTION.md
  - tools/grugops/
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - .grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md
  - .grugops/context/arch-engine-revise/notes/20261018T095000Z-architect-design-decision-adr-0044-revised-book-levels-go-limits-skytalix-artifact-gpl-e4a7c912.md
supersedes:
---

# Licence evaluation: `AGPL-3.0-or-later` is possible. Credit the Michniewski tables as they are; the four kit files stay MIT

**This is a licence evaluation by an engineering role. It is not legal advice.** The owner makes the
final call. Confidence is `medium`. The licence texts and the repository facts are `high`. Whether the
tables are protected at all is a legal question, and it is marked `UNKNOWN - verify`. `ADR-0044` D13 is
authoritative. This note holds the evidence and one line per decision. It supersedes `…e4a7c912` on
D13 only (GPL-3.0 becomes AGPL-3.0). `ADR-0044` stays **PROPOSED**.

*Clock note:* this host's UTC clock read `10:16:27Z` at writing. The owner-word note `…6b2d90f1` is
stamped `10:30:00Z`, so it sorts after this note although this note answers it. `UNKNOWN - verify` which
stamp is off. The `refs` and `ADR-0044` § Revision — licence give the true order.

## Repo facts, read at `main` `930a812c` (not run)

- `src/evaluate.ts` does not name Michniewski. It calls the tables "hand-written". The values match his
  page (checked by `…e4a7c912`). The file uses the king middle-game table only, and `PIECE_VALUE[KING]` is 0, not 20000.
- `tools/grugops/` holds 11 tracked files. Four came from kit installs: `reference-check.js` and
  `test-skip-integrity.js` (`49edb4f7`), `uat-spec-integrity.js` (`355b2078`), `host-protection.js`
  (`1674f745`). Seven are this repository's own work (`lane-inventory.js` ABC-118, `qe-hop-integrity.js`
  and its test ABC-105, `result-file-reporter.js` ABC-142/143/152, `run-bounded*.js` ABC-122/123).
  `result-file-reporter.js` imports vitest's `JsonReporter` and copies none of its code.
- No file in `tools/grugops/` carries a licence notice. The installed kit (`~/.grugops/agent-factory`)
  ships no licence file. Web search found no public grugops repository. The MIT notice text is `UNKNOWN - verify`.
- The installer also writes tracked files outside `tools/` (`.grugops/install.json` ledger:
  `.claude/settings.json`, `.gemini/settings.json`, `.pi/prompts/grugops.md`). The ledger is partial, so the full list is `UNKNOWN - verify`.
- The repository has no `LICENSE` or `NOTICE` today, and `package.json` has no `"license"`.
- Credits already present: `data/opening-book/ATTRIBUTION.md` (CC0, provenance). `src/levels.ts` and
  `src/zobrist.ts` name mulberry32 and splitmix64 but not their authors.
- `src/engine.test.ts` `describe("A4 …")` (line 478) holds the `max_?depth` ban (line 517) and the
  loop-header pin (line 523). The Orchestrator relayed them as lines 515 and 520. The header is `src/engine.ts:483`.

## Findings, with primary sources

1. **The tables.**
   - Origin. They come from Michniewski's post to *progszach*, for a "Unified Evaluation" tournament (the
     wiki page's own text). Pawel_Koziol created the wikispaces page on 31 May 2008, and GerdIsenberg
     edited it to 2014 (archived page history). The date of the list post is `UNKNOWN - verify`
     (before 31 May 2008).
   - Licence. The page is CC BY-SA 3.0 (the current footer, and the 2009 wikispaces footer). The wiki's
     contributors granted that licence. Whether Michniewski did is `UNKNOWN - verify`.
   - EU and Estonia. The numbers are probably unprotected. The tests are free and creative choices
     (Infopaq ¶37; Brompton ¶23–26; Football Dataco ¶38–39, 46). Function is not expression (SAS ¶39).
     Estonia excludes "facts and data" (Copyright Act § 5, via the Estonian Patent Office). There is no
     sui generis right for creating data (BHB ¶31, 40–41). `UNKNOWN - verify`.
   - US. Unsettled. Feist and 17 U.S.C. § 102(b) point one way, and `CDN v. Kapes` ("We agree" that
     prices "are not facts") points the other. `UNKNOWN - verify`.
   - The CC chain, if the tables are protected: BY-SA 3.0 § 4(b)(ii) → BY-SA 4.0 → GPLv3 (CC, 8 Oct
     2015, 4.0 only, one-way) → combined with AGPLv3 (GPLv3 § 13, AGPLv3 § 13). CC states no 3.0 → GPLv3
     route, and the chain needs the tables to be an Adaptation (BY-SA 3.0 § 4(a)). `UNKNOWN - verify`.
   - Decision: **credit them as they are, do not re-derive.** Use the header and `NOTICE` wording in
     `ADR-0044` D13. Re-deriving is the rollback if the rights holder objects. Optional: email Michniewski.
2. **Kit files.** MIT is GPL-compatible (FSF list: Expat, X11). Keep the MIT notice with the four kit
   files (MIT's one condition). They are not in `dist/` (D8 builds only `src/uci.ts` and its imports).
   They are not Corresponding Source (AGPL § 1), and they form an aggregate (AGPL § 5). The seven
   project files are AGPL.
3. **CC0 and public domain.** Nothing is owed. The FSF says public domain and CC0 are compatible. The
   book (CC0 § 3 fallback), mulberry32 (CC0 dedication) and splitmix64 (public domain plus a permission
   sentence) each have a fallback, so Estonia's unwaivable moral rights do not bite. `NOTICE` names them as a courtesy.
4. **AGPL § 13.** The duty arises only for a **modified** version, offered to users *"interacting with it
   remotely"*. A stdio UCI engine is probably outside that (FSF FAQ `#AGPLv3InteractingRemotely`). The
   broader test (`#AGPLv3ServerAsUser`) leaves it `UNKNOWN - verify`. The owner, as developer, is not
   bound by his own licence (`#DeveloperViolate`). The one path to a duty for him runs through GPLv3 § 13's
   *"will apply to the combination as such"*, if the tables are protected. The web project stays
   separate while it only spawns the engine and talks over pipes (`#MereAggregation`). A JavaScript
   import or a Worker bundle of `src/` would combine them. Advice: put one "Source" link in the web UI
   to a public copy of the exact version. It meets § 13 under every reading.
5. **`AGPL-3.0-or-later`** (SPDX). The FSF recommends it (`#VersionThreeOrLater`), and it is the owner-word
   default. Edge: GPLv3 § 13 names AGPL version 3 only, so the tables' GPL-3.0 part might not combine
   with a future AGPL v4. `UNKNOWN - verify`, and low stakes.

## Also folded in (the Orchestrator's mid-task message, from BA/PM)

- D8 and D13: the package, the repository and the terminal game are renamed `skytalix` by `ABC-172`. The
  directory and remote rename is the owner's step. New Q14 asks whether `npm run chess` keeps its name (default: keep).
- D12: `A4` changes in two checks (517 and 523), with a dated line. `ABC-170` `A4` names both.

## Owner questions (kept to two)

- **Q14.** `npm run chess` after the rename? Default: keep it.
- **Q15.** (a) Credit the tables as they are (recommended), re-derive them, or ask Michniewski. (b) Supply
  the grugops MIT notice. (c) Confirm `-or-later`. It blocks `ABC-169` only.

## Sources

- CC BY-SA 3.0 legal code: <https://creativecommons.org/licenses/by-sa/3.0/legalcode> (§ 1(a)–(c), § 4(a)–(c))
- CC BY-SA 4.0 legal code: <https://creativecommons.org/licenses/by-sa/4.0/legalcode.en> (§ 1, § 2(a)(5), § 3(a)–(b))
- CC compatible licenses: <https://creativecommons.org/share-your-work/licensing-considerations/compatible-licenses/>
- CC wiki, ShareAlike compatibility, GPLv3: <https://wiki.creativecommons.org/wiki/ShareAlike_compatibility:_GPLv3>
- CC FAQ: <https://creativecommons.org/faq/>
- GNU AGPLv3: <https://www.gnu.org/licenses/agpl-3.0.txt> (§ 1, § 5, § 7(b), § 13, § 14); GNU GPLv3: <https://www.gnu.org/licenses/gpl-3.0.txt> (§ 13)
- FSF licence list: <https://www.gnu.org/licenses/license-list.html>; GPL FAQ: <https://www.gnu.org/licenses/gpl-faq.html>
- SPDX: <https://spdx.org/licenses/AGPL-3.0-or-later.html>, <https://spdx.org/licenses/MIT.html>
- The wiki page: <https://www.chessprogramming.org/Simplified_Evaluation_Function>; archived 2009:
  <https://web.archive.org/web/20090530084756/http://chessprogramming.wikispaces.com:80/Simplified+evaluation+function>;
  archived history: <https://web.archive.org/web/20180713073412/https://chessprogramming.wikispaces.com/page/history/Simplified+evaluation+function>
- CJEU on EUR-Lex: C-5/08 (CELEX 62008CJ0005), C-604/10 (62010CJ0604), C-833/18 (62018CJ0833), C-406/10 (62010CJ0406), C-203/02 (62002CJ0203)
- Estonian Patent Office, copyright FAQ: <https://www.epa.ee/en/copyright/copyright/faq> (the Riigi Teataja text did not render for this hop)
- US: Feist, 499 U.S. 340 (<https://www.law.cornell.edu/supremecourt/text/499/340>); 17 U.S.C. § 102 (<https://www.law.cornell.edu/uscode/text/17/102>); 37 CFR 202.1; CDN v. Kapes, 197 F.3d 1256 (<https://law.resource.org/pub/us/case/reporter/F3/197/197.F3d.1256.html>)
- mulberry32: <https://gist.github.com/tommyettinger/46a874533244883189143505d203312c>; splitmix64: <https://prng.di.unimi.it/splitmix64.c>

## What this hop did and refused

- **Wrote** `ADR-0044` (revised in place, still PROPOSED) and this note, on `grugops/arch-licence-eval`
  (worktree `../wt-arch-licence-eval`, from `main` `930a812c`).
- **0 lines** in `src/`, `tools/`, `package.json`, `package-lock.json`, `vitest.config.ts` and `plans/`.
  No `LICENSE` or `NOTICE` was added (`ABC-169`'s job).
- **Ran no test, vitest, build or timing.** It read source, git history and primary sources over the web.
  Nothing was pushed or merged.
- **Admission.** This note is hand-authored and unsealed. `scripts/context-io.ts` is absent on this install
  (`AGENTS.md`), so no `finding` was attempted.
