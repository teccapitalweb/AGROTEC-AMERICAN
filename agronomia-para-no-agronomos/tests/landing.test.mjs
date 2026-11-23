import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const [html, css, js, config] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("styles.css", root), "utf8"),
  readFile(new URL("app.js", root), "utf8"),
  readFile(new URL("site-config.js", root), "utf8"),
]);

test("renders the confirmed course facts from central configuration", () => {
  assert.match(config, /modality:\s*"Online"/);
  assert.match(config, /durationHours:\s*5/);
  assert.match(config, /currentAmountMinor:\s*55000/);
  assert.match(config, /referenceAmountMinor:\s*105000/);
  assert.match(config, /access:\s*"Sin vencimiento"/);
});

test("keeps checkout inactive in phase one", () => {
  assert.match(config, /checkout:[\s\S]*?enabled:\s*false/);
  assert.match(config, /phase:\s*"preview"/);
  assert.match(html, /todavía no se realizan cargos/i);
  assert.doesNotMatch(html + js + config, /js\.stripe\.com|sk_(?:live|test)_|whsec_/i);
});

test("contains no visit-based or fake urgency mechanism", () => {
  const source = html + js + config;
  assert.doesNotMatch(source, /localStorage|sessionStorage|visitCount|visit_count/i);
  assert.doesNotMatch(source, /12\s*(?:→|->)\s*10|10\s*(?:→|->)\s*8/i);
  assert.match(config, /promotion:[\s\S]*?enabled:\s*false/);
  assert.match(config, /mode:\s*"none"/);
});

test("protects certificate integrity", () => {
  assert.match(html, /muestra ilustrativa y anonimizada/i);
  assert.match(html, /La compra no genera el certificado de forma automática/i);
  assert.match(config, /automaticOnPayment:\s*false/);
  assert.doesNotMatch(html, /MIGUEL ÁNGEL GALICIA GARCÍA|IPCI-AGRO-2026-2880/i);
});

test("ships the five official modules closed by default", () => {
  assert.equal((html.match(/<details class="module">/g) ?? []).length, 5);
  assert.doesNotMatch(html, /<details class="module"\s+open/);
});

test("includes responsive and reduced-motion safeguards", () => {
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(max-width: 360px\)/);
  assert.match(css, /\.hero__visual\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*10/);
  assert.match(css, /\.quick-facts\s*\{[\s\S]*?grid-template-columns:\s*1fr\s+1fr/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /width=device-width, initial-scale=1/);
});

test("keeps Irene's portrait only in the instructor section", () => {
  assert.equal((html.match(/irene-garcia\.png/g) ?? []).length, 1);

  const instructorStart = html.indexOf('id="ponente"');
  const instructorEnd = html.indexOf('id="certificado"');
  assert.ok(instructorStart >= 0, "Missing instructor section");
  assert.ok(instructorEnd > instructorStart, "Missing section after instructor");

  const instructorMarkup = html.slice(instructorStart, instructorEnd);
  assert.match(instructorMarkup, /<img[^>]+src="\.\/assets\/irene-garcia\.png"/);
});

test("reserves the hero for the future promotional video without embedding a fake player", () => {
  assert.match(html, /data-video-placeholder/);
  assert.match(html, /Video promocional/i);
  assert.match(html, /Próximamente/i);
  assert.doesNotMatch(html, /<iframe\b|<video\b/i);
  assert.doesNotMatch(html, /(?:youtube(?:-nocookie)?\.com|youtu\.be|vimeo\.com)/i);
});

test("does not advertise a purchasable schema offer while checkout is inactive", () => {
  assert.doesNotMatch(html, /"@type"\s*:\s*"Offer"/);
});

test("uses unique ids and valid in-page anchors", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  anchors.forEach((anchor) => assert.ok(idSet.has(anchor), `Missing target for #${anchor}`));
});

test("all local images and fonts referenced by the page exist", () => {
  const assetRefs = new Set([
    ...[...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((match) => match[1]),
    ...[...css.matchAll(/url\("\.\/(assets\/[^"]+)"\)/g)].map((match) => match[1]),
    ...[...js.matchAll(/"\.\/(assets\/[^"]+)"/g)].map((match) => match[1]),
  ]);
  assetRefs.forEach((asset) => assert.ok(existsSync(new URL(asset, root)), `Missing ${asset}`));
});
