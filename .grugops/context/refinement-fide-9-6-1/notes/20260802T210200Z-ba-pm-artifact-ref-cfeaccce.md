---
id: 20260802T210200Z-ba-pm-artifact-ref-cfeaccce
kind: artifact-ref
by: ba-pm
at: 2026-08-02T21:02:00Z
verified_by: 
confidence: high
refs:
  - refinement-fide-9-6-1
  - ABC-020
  - src/gameend.ts
  - 20260802T210100Z-ba-pm-decision-968fe5b1
  - .grugops/context/refinement-fide-9-6-1/sources/FETCH-MANIFEST.txt
  - .grugops/context/refinement-fide-9-6-1/sources/E012023-laws-of-chess-2023.html
  - .grugops/context/refinement-fide-9-6-1/sources/E012023-article-9.txt
  - .grugops/context/refinement-fide-9-6-1/sources/E012014-article-9.txt
  - .grugops/context/refinement-fide-9-6-1/sources/E012017-article-9.txt
  - .grugops/context/refinement-fide-9-6-1/sources/E012018-article-9.txt
supersedes: 
---

# The retrieved Laws text, retained verbatim under this task with integrity hashes

The primary source the ruling rests on is **saved in this repo**, not merely cited. A later reader
re-derives the ruling from these files without a network call and without trusting the note that
quoted them.

## Location

`.grugops/context/refinement-fide-9-6-1/sources/`

| File | What it is |
|---|---|
| `E012023-laws-of-chess-2023.html` | **The verbatim response bytes** for the CURRENT edition — the operative text, retained whole and unaltered. |
| `E012023-article-9.txt` | Article 9 of the current edition, tags stripped, wording unaltered. The quotable form. |
| `E012014-article-9.txt` | Article 9 of the 2014 edition — the source of the "five consecutive alternate moves" wording. |
| `E012017-article-9.txt` | Article 9 of the 2017 edition — the edition that removed it. |
| `E012018-article-9.txt` | Article 9 of the 2018 edition. |
| `FETCH-MANIFEST.txt` | URL, HTTP status, byte count, **sha256** and page `<title>` for all four fetches. |

## Retrieval

Fetched by `ba-pm` on 2026-08-02 with `curl` from this sandbox — network egress confirmed working,
as the routing decision predicted. **No other role fetched this and handed it over; nothing was
relayed agent-to-agent.** Publisher is `handbook.fide.com`, FIDE's own handbook, which is the
authoritative publication rather than a mirror or a summary.

All four responses: **HTTP 200**.

```
E012023  186226 bytes  sha256 e0c8bee28c2dee07b724357b9802fee8591e9d11efd2a910b38e9bd21d3c7643
E012018  188830 bytes  sha256 61166d399ec6f21af488da272424673c60038441900d41a77b5c10ca4f8f4e37
E012017  189226 bytes  sha256 d1d99aacd2361045c81f79cae1c80451fa3c04704ae8fb62543aff2711e33e36
E012014  163624 bytes  sha256 dd466d3cd2814b84d821c57651bab8ea38336c5befd96f298c97eb019c512f7c
```

## What was retained and what was not — stated so the gap is not discovered later

- The current edition is retained as **raw response bytes**. It is the evidence the ruling turns on.
- The three superseded editions are retained as **extracted Article 9 text plus sha256**, not as raw
  HTTP bodies. They serve only to date the wording change, the sentences quoted from them are
  verbatim, and the hashes let anyone re-fetch and confirm. Keeping three more full HTML bodies
  would have added ~540 KB to the repo for no additional evidentiary value. This is a deliberate
  choice, recorded rather than left implicit.
- Extraction is mechanical: `<script>`/`<style>` dropped, block tags turned into newlines, remaining
  tags stripped, HTML entities decoded, `&nbsp;` normalised to a space, blank lines collapsed. **No
  wording was edited, reordered, or summarised.** Each extracted file carries this statement in its
  own header.

## Independent corroboration inside the same documents

Two cross-checks were available in the retrieved text itself and both hold:

- The **Glossary** of every edition — 2014 included, i.e. the edition that carried "consecutive" in
  the article body — defines repetition as: *"1. A player may claim a draw if the same position
  occurs three times. 2. A game is drawn if the same position occurs five times."* A plain count,
  with no consecutiveness, even where the article text had it.
- The four editions differ from each other in exactly the places FIDE's own renumbering predicts
  (`9.2b` → `9.2.2`, lettered sub-clauses → numbered). A mangled or partial fetch does not produce
  that pattern, which is evidence the retrieval is faithful rather than truncated.

## Provenance

Written **by hand** into `notes/` — no `scripts/context-io.ts` and no `mcp__grugops__propose_note`
in this install, the standing degradation recorded since 2026-07-31. This is an `artifact-ref`, a
pointer kind that needs no verification stamp; **nothing is self-stamped** and no `finding` was
recorded or attempted.
