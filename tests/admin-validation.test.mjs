import test from "node:test";
import assert from "node:assert/strict";
import { validateAdminRecord } from "../src/lib/admin-validation.mjs";

test("allows an HTTPS registration form URL", () => {
  assert.equal(validateAdminRecord({ registration_url: "https://forms.google.com/example" }), null);
});

test("rejects non-HTTPS external URLs", () => {
  assert.match(validateAdminRecord({ external_url: "javascript:alert(1)" }), /https/);
  assert.match(validateAdminRecord({ registration_url: "http://example.com" }), /https/);
});

test("allows omitted optional links and email", () => {
  assert.equal(validateAdminRecord({ title: "Announcement" }), null);
  assert.equal(validateAdminRecord({ registration_url: "", contact_email: "" }), null);
});

test("accepts a valid public contact email", () => {
  assert.equal(validateAdminRecord({ contact_email: "mun@example.edu" }), null);
});

test("rejects malformed contact email", () => {
  assert.match(validateAdminRecord({ contact_email: "invalid-address" }), /email/);
});
