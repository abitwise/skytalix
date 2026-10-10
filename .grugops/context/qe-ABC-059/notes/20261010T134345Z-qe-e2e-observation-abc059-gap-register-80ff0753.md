---
id: 20261010T134345Z-qe-e2e-observation-abc059-gap-register-80ff0753
kind: observation
by: qe-e2e
at: 2026-10-10T13:43:45Z
verified_by:
confidence: high
refs:
  - ABC-059
  - ABC-065
  - ABC-042
  - Q13
  - src/cli.test.ts
  - 20261010T134345Z-qe-e2e-observation-abc059-mutants-cost-gates-4abec244
  - 20261010T134345Z-qe-e2e-decision-abc059-verdict-pass-with-gaps-ce5cf723
supersedes:
---

# `ABC-059` gap register: three LOW, two INFO. Every gap sits in `A1`'s own wording or in hygiene, and none fails a criterion

This note is hand-authored and unsealed. Every gap was measured, and its mutant is in
`…4abec244` and `../probe/mutants-head.out.tsv`. **No test was added for any of them.** Each one
is a property of the span rule that `A1` defines ("to the next sentence terminator") or of the
three spellings `A1` names. Closing one changes the contract, which is BA/PM's call and not a QE
test addition.

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| `QE-059-a` | LOW | **Early terminators hide a claim (false negative).** A `.`/`!`/`?` + space between `Dev / run` and the claim ends the span first. That covers abbreviation dots (`e.g. `, `i.e. `, `vs. `), a question about the slot, and a claim stated in the next sentence. `Q13` itself has none of these, and the file is correct today | `edge-abbrev-unknown`, `edge-question-unknown`, `edge-next-sentence`: all **green 67/67** on head | BA/PM, if the class is worth a follow-up (e.g. span to the end of the paragraph, or an abbreviation list) |
| `QE-059-b` | LOW | **The guard reads the fact through three pinned spellings.** These are the token `Dev / run`, the phrase `UNKNOWN - verify`, and the command form `npm run `. `Dev/run`, `dev / run`, `unknown - verify`, `UNKNOWN – verify` (en dash), `node src/perft-bench.ts`, `npm run-script perft` and `npm start` all pass unseen. This is exactly what `A1` asks for, but it is the ticket's own critique one level down, and the page claims nothing about the class (§ Out of scope) | 7 mutants, all **green** on head | BA/PM (the defect-class rule the Orchestrator declined is the owner's, via the Factory Coach) |
| `QE-059-c` | LOW | **A correct file can red (false positive, fail-loud).** (1) A list item carries no sentence terminator. If the slot's comment loses its first `. `, the span runs into the next list items and picks up `npm run perft`. Today it ends at `` `DEFAULT_BUDGET_MS`). `` (`AGENTS.md:67`). `ABC-065`'s writing rules do not require that period. (2) The engineer's strict reading of `A1`(ii) reds a correct contrastive sentence that names another script. Both print the offending span. The risk is a future hop "simplifying" the guard to quiet it, which the docblock warns against | `edge-slot-comment-short`: `ABC-059` red with the run-on span (`ABC-065` A1/A3 red too). `edge-two-npm-correct`: **RED 1/67** | none now. The Scribe should know (1) when editing the slot comment |
| `QE-059-d` | INFO | **`A2`'s in-file witness is synthetic.** It inserts `Q13` into today's file. The real pre-repair file is witnessed only out of tree. That is unavoidable without reading git in a test, and it was measured: `bf685784~1:AGENTS.md` reds `ABC-059` at head and leaves `ABC-042`'s row green at base | `file-prerepair` | none |
| `QE-059-e` | INFO | **Probe hygiene.** `4230d3ab` commits an empty `.grugops/context/ticket-to-pr-ABC-059/probe/x` that `RUN.txt` does not index. `RUN.txt` indexes `timing-set{1,2}.log`, which are not committed | `git show --stat 4230d3ab` | SE, at the next touch. Not worth a ticket |
