NAME="R2b-book-delete-finally-reset"
CMD="npx vitest run tools/opening-book/book.test.ts"
EDITS=[("tools/opening-book/book.test.ts","      vi.mocked(zobristKey).mockReset(); // an automock spy: back to the original implementation\n","")]
