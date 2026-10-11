// design-ABC-152: does `vi.fn(m)`, where `m` is already a mock, get its OWN call state? (A1's red class.)
// Read on 3.2.7 and 4.1.11. Prints the counts; the `it` asserts the 3.2.7 behaviour (own state).
import { expect, it, vi } from "vitest";

it("vi.fn(mock) has its own call count", () => {
  const inner = vi.fn((x) => x + 1);
  const outer = vi.fn(inner);
  outer(1);
  inner(2);
  inner(3);
  const lambda = vi.fn((x) => inner(x));
  lambda(4);
  console.log(
    `fnwrap outer=${outer.mock.calls.length} inner=${inner.mock.calls.length} lambda=${lambda.mock.calls.length} same=${outer === inner}`,
  );
  expect(outer).toHaveBeenCalledTimes(1);
});
