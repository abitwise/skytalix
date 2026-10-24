
  it("QE probe Q6 — the write fails with W and the close with C: the FIRST code, W", () => {
    arm({ write: "EFBIG", close: "EIO" });
    expect(writePgnFile(STARTED_AT, TEXT)).toEqual({ ok: false, code: "EFBIG" });
  });

  it("QE probe Q7 — a fault at the -2 candidate removes that file and leaves the earlier game intact", () => {
    const root = arm({});
    const { stem } = pgnStamp(STARTED_AT);
    expect(writePgnFile(STARTED_AT, TEXT)).toEqual({ ok: true, path: `games/${stem}.pgn` });
    fault.write = "EFBIG";
    expect(writePgnFile(STARTED_AT, TEXT)).toEqual({ ok: false, code: "EFBIG" });
    expect(gamesIn(root)).toEqual([`${stem}.pgn`]);
    expect(readFileSync(join(root, "games", `${stem}.pgn`), "utf8")).toBe(TEXT);
  });

  it("QE probe Q8 — a codeless write failure is a defect and leaves writePgnFile (D5)", () => {
    arm({ write: "no-code" });
    expect(() => writePgnFile(STARTED_AT, TEXT)).toThrow("ABC-213 defect, no code");
  });
