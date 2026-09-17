#!/usr/bin/env node
// Regenerates the "Supported Versions" table in SECURITY.md from
// scripts/security-packages.json and each package's latest stable release.
//
// A row only changes when something policy-relevant changes: a package's major
// version (Latest `0.x` minor → Latest `1.x` minor), a first release (`main`
// branch → registry), or a package added/renamed in the manifest. Ordinary
// minor/patch releases leave the table untouched, so the scheduled workflow
// opens a pull request only when the policy really needs updating.
//
// Usage:
//   node scripts/update-security-table.mjs          # rewrite SECURITY.md
//   node scripts/update-security-table.mjs --check  # exit 1 if it would change
//
// Node 22+, no dependencies. GITHUB_TOKEN (optional) raises the GitHub API
// rate limit for Swift releases.

import { readFile, writeFile } from 'node:fs/promises';

const START = '<!-- security-table:start -->';
const END = '<!-- security-table:end -->';
const POLICY = new URL('../SECURITY.md', import.meta.url);
const MANIFEST = new URL('./security-packages.json', import.meta.url);

const STABLE = /^v?(\d+)\.(\d+)\.(\d+)$/;

async function get(url, { json = true } = {}) {
  const headers = { 'user-agent': 'norbix-code-security-table' };
  if (url.startsWith('https://api.github.com/') && process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return json ? res.json() : res.text();
}

function newestStable(versions) {
  const stable = versions
    .map((v) => ({ v, m: STABLE.exec(v) }))
    .filter((x) => x.m)
    .sort((a, b) => {
      for (let i = 1; i <= 3; i++) {
        const d = Number(a.m[i]) - Number(b.m[i]);
        if (d) return d;
      }
      return 0;
    });
  return stable.length ? stable[stable.length - 1].v : null;
}

// Latest stable version string for a package, or null if never released.
const sources = {
  async npm(id) {
    const doc = await get(`https://registry.npmjs.org/${id.replace('/', '%2f')}`);
    return doc ? newestStable(Object.keys(doc.versions ?? {})) : null;
  },
  async nuget(id) {
    const doc = await get(`https://api.nuget.org/v3-flatcontainer/${id.toLowerCase()}/index.json`);
    return doc ? newestStable(doc.versions ?? []) : null;
  },
  async pypi(id) {
    const doc = await get(`https://pypi.org/pypi/${id}/json`);
    return doc ? newestStable(Object.keys(doc.releases ?? {})) : null;
  },
  async pub(id) {
    const doc = await get(`https://pub.dev/api/packages/${id}`);
    return doc ? newestStable((doc.versions ?? []).map((v) => v.version)) : null;
  },
  async maven(id) {
    const [group, artifact] = id.split(':');
    const xml = await get(
      `https://repo1.maven.org/maven2/${group.replaceAll('.', '/')}/${artifact}/maven-metadata.xml`,
      { json: false },
    );
    if (!xml) return null;
    return newestStable([...xml.matchAll(/<version>([^<]+)<\/version>/g)].map((m) => m[1]));
  },
  async go(id) {
    const text = await get(`https://proxy.golang.org/${id.toLowerCase()}/@v/list`, { json: false });
    // v0.0.0 is the semantic-release baseline tag, not a usable version.
    return text ? newestStable(text.split('\n').filter((v) => v && v !== 'v0.0.0')) : null;
  },
  async 'github-release'(id) {
    const releases = await get(`https://api.github.com/repos/${id}/releases?per_page=100`);
    return releases
      ? newestStable(releases.filter((r) => !r.draft && !r.prerelease).map((r) => r.tag_name))
      : null;
  },
};

function row(pkg, version) {
  const repo = `[${pkg.repo}](https://github.com/norbix-code/${pkg.repo})`;
  if (!version) {
    return `| ${pkg.name} | ${repo} | not yet released | \`main\` branch :white_check_mark: |`;
  }
  const major = STABLE.exec(version)[1];
  return `| ${pkg.name} | ${repo} | [${pkg.registry}](${pkg.registryUrl}) | Latest \`${major}.x\` minor :white_check_mark: |`;
}

async function main() {
  const check = process.argv.includes('--check');
  const { packages } = JSON.parse(await readFile(MANIFEST, 'utf8'));

  const versions = await Promise.all(
    packages.map(async (pkg) => {
      const lookup = sources[pkg.source.type];
      if (!lookup) throw new Error(`${pkg.repo}: unknown source type ${pkg.source.type}`);
      const version = await lookup(pkg.source.id);
      console.log(`${pkg.repo.padEnd(12)} ${pkg.source.type.padEnd(15)} ${version ?? '(not released)'}`);
      return version;
    }),
  );

  const table = [
    START,
    '| Package | Repository | Registry | Supported |',
    '| ------- | ---------- | -------- | --------- |',
    ...packages.map((pkg, i) => row(pkg, versions[i])),
    '| Older minor versions | | | :x: |',
    END,
  ].join('\n');

  const policy = await readFile(POLICY, 'utf8');
  const start = policy.indexOf(START);
  const end = policy.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`SECURITY.md must contain ${START} ... ${END}`);
  }
  const updated = policy.slice(0, start) + table + policy.slice(end + END.length);

  if (updated === policy) {
    console.log('SECURITY.md is up to date.');
    return;
  }
  if (check) {
    console.log('SECURITY.md table is out of date.');
    process.exitCode = 1;
    return;
  }
  await writeFile(POLICY, updated);
  console.log('SECURITY.md table updated.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 2;
});
