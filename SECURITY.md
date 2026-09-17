# Security Policy

This policy covers the official Norbix client libraries and tools published
from the [norbix-code](https://github.com/norbix-code) organization. A
repository with its own `SECURITY.md` follows that file instead.

## Supported Versions

Security fixes are released for the **latest minor version** of each package.
Releases are automated, so the newest version is always the one on the
package registry. Please upgrade to it before reporting, and include the
version you tested.

| Package | Repository | Registry | Supported |
| ------- | ---------- | -------- | --------- |
| `@norbix.ai/ts` | [sdk-ts](https://github.com/norbix-code/sdk-ts) | [npm](https://www.npmjs.com/package/@norbix.ai/ts) | Latest `1.x` minor :white_check_mark: |
| `@norbix.ai/cli` | [cli](https://github.com/norbix-code/cli) | [npm](https://www.npmjs.com/package/@norbix.ai/cli) | Latest `0.x` minor :white_check_mark: |
| `Norbix.Api`, `Norbix.Hub` | [sdk-net](https://github.com/norbix-code/sdk-net) | [NuGet](https://www.nuget.org/packages/Norbix.Api) | Latest `1.x` minor :white_check_mark: |
| `norbix` (Python) | [sdk-python](https://github.com/norbix-code/sdk-python) | [PyPI](https://pypi.org/project/norbix/) | Latest `1.x` minor :white_check_mark: |
| `norbix` (Dart) | [sdk-dart](https://github.com/norbix-code/sdk-dart) | [pub.dev](https://pub.dev/packages/norbix) | Latest `1.x` minor :white_check_mark: |
| `NorbixApi`, `NorbixHub` (Swift) | [sdk-swift](https://github.com/norbix-code/sdk-swift) | [GitHub releases](https://github.com/norbix-code/sdk-swift/releases) | Latest `0.x` minor :white_check_mark: |
| `ai.norbix:norbix-kotlin` | [sdk-kotlin](https://github.com/norbix-code/sdk-kotlin) | [Maven Central](https://central.sonatype.com/artifact/ai.norbix/norbix-kotlin) | Latest `0.x` minor :white_check_mark: |
| Go SDK (`github.com/norbix-code/sdk-go`) | [sdk-go](https://github.com/norbix-code/sdk-go) | [pkg.go.dev](https://pkg.go.dev/github.com/norbix-code/sdk-go) | Latest `0.x` minor :white_check_mark: |
| `@norbix.ai/react-redux` | [react-redux](https://github.com/norbix-code/react-redux) | [npm](https://www.npmjs.com/package/@norbix.ai/react-redux) | Latest `0.x` minor :white_check_mark: |
| Older minor versions | | | :x: |

Deprecated package versions on a registry (for example `Norbix.Api` and
`Norbix.Hub` before 1.4.0) are not supported.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
discussions or pull requests.**

Report privately in either of these ways:

- **GitHub:** open the affected repository's **Security** tab and choose
  **Report a vulnerability** (private vulnerability reporting).
- **Email:** [security@norbix.ai](mailto:security@norbix.ai).

Include as much of the following as you can:

- the package and version (and, for SDKs, the platform / runtime version);
- the type of issue (for example credential exposure, request forgery,
  insecure defaults, injection, dependency vulnerability);
- steps to reproduce, or a proof of concept;
- the impact: what an attacker could do.

Please do not include real API keys, tokens or customer data in a report.

## What to Expect

- **Acknowledgement** within **3 business days**.
- **Initial assessment** within **7 business days**: whether we accept the
  report, the severity we assign, and the next steps.
- **Updates** at least every **14 days** until the report is resolved.
- **Accepted:** we develop the fix privately, publish patched releases of
  every affected package, and publish a GitHub security advisory (with a CVE
  where appropriate). We will agree the disclosure date with you and credit
  you in the advisory unless you prefer to stay anonymous.
- **Declined:** we explain why, for example if the behaviour is expected or
  the issue is in a dependency or service outside these repositories.

Vulnerabilities in the Norbix platform itself (API, Hub, web app) rather than
in these libraries can be reported to the same address.

We ask that you give us reasonable time to release a fix before disclosing
the issue publicly, and that you only test against accounts and projects you
own.
