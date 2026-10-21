---
id: 20261021T090600Z-software-engineer-decision-436be2c2
kind: decision
by: software-engineer
at: 2026-10-21T09:06:00Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - ABC-162
  - ABC-095
  - grugops/ABC-180
  - acb52edf
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T082900Z-security-nfr-decision-06c147db
supersedes: 
seal: sha256:63c0b404c8c375cf4be1b2a2ed6e3ca788943d548df9e164f3c32ca4542fd783
---

# ABC-180 build decisions: the decoy's bytes, the assertion order, the label words, the base

- **Decoy bytes:** the UTF-8 text `ABC-180 decoy: not an opening book\n`, written by `writeFileSync(join(neutral, BOOK_PATH), …)` after `mkdirSync(dirname(join(neutral, BOOK_PATH)), { recursive: true })`, in `A7`'s existing `beforeAll`, after `mkdtempSync` and before both spawns. It is valid UTF-8 but not JSON, so `parseBook` refuses it with `is not valid UTF-8 JSON`, the one fixed message the page pins. Readable text was chosen over raw invalid bytes so an editor who opens the directory can see what it is.
- **Assertion order in `A7`:** present, then does-not-parse, then differs-from-delivered. The does-not-parse check comes before the differs check so that plant PD (a byte copy of the delivered book) reds at the does-not-parse assertion, as `A1` requires. In the reverse order PD would red at "differs" first. The parse check mirrors `parseBook`: `JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes))` must throw.
- **Label words:** comment `// THE AR-095-CWD / AR-162-FALLBACK DETECTOR: a cwd read meets the decoy and warns here.` directly above `expect(booked.stderr, "AR-095-CWD / AR-162-FALLBACK detector: stderr must be empty, or the book was read from the working directory").toBe("")`.
- **Imports added:** `mkdirSync`, `writeFileSync` (node:fs) and `dirname` (node:path), needed by the decoy write. No new `mkdtemp`, removal, spawn or `it`.
- **Base:** `main` `ccccc6bb` (the tip at start). `src/` is identical to `e68962d6` there (`git diff --quiet e68962d6 ccccc6bb -- src/` exit 0), so the page's base readings apply.
