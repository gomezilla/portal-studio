const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const script = fs.readFileSync(path.join(__dirname, "../template/connectivity.js"), "utf8");
const defaultUrl = "https://ipwho.is/";
const legacyUrl = "https://speed.cloudflare.com/__down?bytes=1";

async function check({ url, response, error, online = true, wifiHidden = false, dynamicDot = true } = {}) {
  const wifi = { hidden: wifiHidden, dataset: {}, setAttribute() {} };
  const dot = { dataset: {}, setAttribute() {} };
  const calls = [];
  const navigator = { onLine: online };
  const fetch = async (target, options) => {
    calls.push({ target, options });
    if (error) throw error;
    return response || { ok: true, redirected: false, json: async () => ({ success: true }), arrayBuffer: async () => new ArrayBuffer(1) };
  };
  const window = { fetch, AbortController, setTimeout, clearTimeout, setInterval() {}, addEventListener() {} };
  const document = {
    body: { dataset: url ? { connectivityUrl: url } : {} },
    getElementById: () => wifi,
    querySelector: () => dynamicDot ? dot : null
  };
  vm.runInNewContext(script, { document, window, navigator, fetch, AbortController });
  await new Promise(resolve => setImmediate(resolve));
  return { wifi, dot, calls };
}

test("custom endpoint controls both indicators without downloading its body", async () => {
  const result = await check({
    url: "https://example.test/health",
    response: { ok: true, redirected: false, arrayBuffer: () => { throw Error("body read"); } }
  });
  assert.equal(result.calls[0].target, "https://example.test/health");
  assert.equal(result.calls[0].options.credentials, "omit");
  assert.equal(result.wifi.dataset.online, "true");
  assert.equal(result.dot.dataset.online, "true");
  assert.equal(result.dot.title, "Connection check succeeded");
});

test("redirects, errors, offline status and failed responses do not report success", async () => {
  for (const options of [
    { response: { ok: true, redirected: true } },
    { response: { ok: false, redirected: false } },
    { error: new Error("blocked") },
    { online: false }
  ]) {
    const result = await check({ ...options, url: "https://example.test/health" });
    assert.equal(result.wifi.dataset.online, "false");
    assert.equal(result.dot.dataset.online, "false");
  }
});

test("default ipwho.is checks its JSON success field", async () => {
  const success = await check();
  assert.equal(success.calls[0].target, defaultUrl);
  assert.equal(success.wifi.dataset.online, "true");
  const failure = await check({ response: { ok: true, redirected: false, json: async () => ({ success: false }) } });
  assert.equal(failure.wifi.dataset.online, "false");
});

test("saved Cloudflare checks still require a one-byte response", async () => {
  const success = await check({ url: legacyUrl });
  assert.equal(success.wifi.dataset.online, "true");
  const failure = await check({ url: legacyUrl, response: { ok: true, redirected: false, arrayBuffer: async () => new ArrayBuffer(2) } });
  assert.equal(failure.wifi.dataset.online, "false");
});

test("no request is made when both indicators are disabled", async () => {
  const result = await check({ wifiHidden: true, dynamicDot: false });
  assert.equal(result.calls.length, 0);
});
