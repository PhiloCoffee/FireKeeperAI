import assert from "node:assert/strict";
import test from "node:test";
import { parseServerSentEvent } from "../src/api/client.js";

test("parseServerSentEvent reads event names and JSON payloads", () => {
  assert.deepEqual(parseServerSentEvent('event: token\ndata: {"text":"hello"}'), {
    event: "token",
    data: { text: "hello" }
  });
});

test("parseServerSentEvent joins multi-line data payloads", () => {
  assert.deepEqual(parseServerSentEvent('event: token\ndata: {"text":\ndata: "hello"}'), {
    event: "token",
    data: { text: "hello" }
  });
});

test("parseServerSentEvent ignores comments and empty events", () => {
  assert.equal(parseServerSentEvent(": keep-alive"), null);
});
