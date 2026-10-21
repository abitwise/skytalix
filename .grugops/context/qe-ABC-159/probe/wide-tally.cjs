// QE-ABC-159 wider tally probe: joined comment text, sentence split that tolerates dots inside code spans/filenames.
// usage (from the repo root): node .grugops/context/qe-ABC-159/probe/wide-tally.cjs src/*.ts
// Known false positive: status-panel.nfr.test.ts "twice" falls in code after the header (sentence split runs on); "again" matches "against".
const fs = require("fs");
const words = /\b(once|twice|thrice|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+times\b|\b(twice|thrice|both times|each time|every time|each after|once more|yet again|again|times now|repeatedly|several|many times|the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|latest|last|newest|next)\b)|\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(st|nd|rd|th))\s+(bar|time|move|lesson|record)/i;
for (const f of process.argv.slice(2)) {
  const t = fs.readFileSync(f, "utf8").replace(/\n\s*\* ?/g, " ").replace(/`[^`]*`/g, m => m.replace(/\./g, "․"));
  // sentence split: a period followed by whitespace+capital/asterisk or end
  for (const s of t.split(/(?<=[.!?])\s+(?=[A-Z*`(_])/)) {
    if (!/nfr-catalog|catalog|on this project|off (a|the) clock|onto a count/i.test(s)) continue;
    const m = s.match(words);
    if (m) console.log(f + " [" + m[0] + "]: " + s.trim().slice(0, 300).replace(/․/g, "."));
  }
}
