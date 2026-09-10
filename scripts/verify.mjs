import assert from "node:assert/strict";
import { readFile, access, readdir, lstat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const manifest = await readJson(".cursor-plugin/plugin.json");
assert.match(manifest.name, /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.repository, "https://github.com/robotomail/cursor-plugin");
for (const field of ["logo", "mcpServers"]) {
  const path = manifest[field];
  assert.equal(typeof path, "string");
  assert(!path.startsWith("/") && !path.split("/").includes(".."));
  await access(resolve(root, path));
}
const config = await readJson(manifest.mcpServers);
assert.deepEqual(Object.keys(config.mcpServers), ["robotomail"]);
const server = config.mcpServers.robotomail;
assert.deepEqual(Object.keys(server).sort(), ["auth", "type", "url"]);
assert.equal(server.type, "http");
assert.equal(server.url, "https://robotomail.com/mcp");
assert.deepEqual(Object.keys(server.auth).sort(), ["CLIENT_ID", "scopes"]);
assert.equal(server.auth.CLIENT_ID, "https://robotomail.com/api/mcp/clients/grok-bot");
assert.deepEqual(server.auth.scopes, ["mail:read", "mail:send", "offline_access"]);
const readme = await readFile(resolve(root, "README.md"), "utf8");
assert(readme.includes(JSON.stringify(config, null, 2)), "README configuration must match mcp.json");
const svg = await readFile(resolve(root, manifest.logo), "utf8");
assert(svg.includes("<svg"));
assert(!/<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=|<!ENTITY/i.test(svg), "Logo must be a self-contained SVG");
const allowed = new Set([".cursor-plugin/plugin.json", ".gitignore", "assets/logo.svg", "LICENSE", "README.md", "mcp.json", "scripts/verify.mjs"]);
async function checkFiles(directory = "") {
  for (const name of await readdir(resolve(root, directory))) {
    if (!directory && name === ".git") continue;
    const path = directory ? `${directory}/${name}` : name;
    const stat = await lstat(resolve(root, path));
    assert(!stat.isSymbolicLink(), `Unexpected symlink: ${path}`);
    if (stat.isDirectory()) await checkFiles(path);
    else assert(allowed.has(path), `Review unexpected file before publication: ${path}`);
  }
}
await checkFiles();
console.log("Package configuration, paths, README, logo, and file inventory passed.");

if (process.argv.includes("--live")) {
  const get = async (url) => fetch(url, { redirect: "error", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "Robotomail-plugin-verification" } });
  const metadataResponse = await get("https://robotomail.com/.well-known/oauth-authorization-server/api/auth");
  assert.equal(metadataResponse.status, 200);
  const metadata = await metadataResponse.json();
  assert.equal(metadata.issuer, "https://robotomail.com/api/auth");
  assert(metadata.grant_types_supported.includes("authorization_code"));
  assert(metadata.grant_types_supported.includes("refresh_token"));
  assert(metadata.code_challenge_methods_supported.includes("S256"));
  const clientResponse = await get(server.auth.CLIENT_ID);
  assert.equal(clientResponse.status, 200);
  const client = await clientResponse.json();
  assert.equal(client.client_id, server.auth.CLIENT_ID);
  assert.equal(client.token_endpoint_auth_method, "none");
  for (const callback of ["https://www.cursor.com/bot/mcp/oauth/callback", "https://www.cursor.com/agents/mcp/oauth/callback", "http://localhost:8787/callback"]) assert(client.redirect_uris.includes(callback));
  const unauthorized = await get(server.url);
  await unauthorized.arrayBuffer();
  assert.equal(unauthorized.status, 401);
  assert(unauthorized.headers.get("www-authenticate")?.includes('resource_metadata="https://robotomail.com/.well-known/oauth-protected-resource/mcp"'));
  console.log("Public OAuth discovery, PKCE, callbacks, and unauthenticated-access checks passed. No account authenticated or email sent.");
}
