# Test evidence index

Reports must be read with their source/version and environment.

## Current application evidence

| Report | Meaning |
| --- | --- |
| [Application verification](APPLICATION-VERIFICATION.md) | Build, 34/34 regression checks, 65/65 local workflows and persistence checks recorded before documentation reorganization. |
| [Campus workflows](CAMPUS-SMOKE.json) | Detailed results from the populated local application workflow run. |

The application at `a2c053d` was successfully deployed and its read-only public health check passed.
Shared starter administrator login was confirmed blocked after deployment.
These are recorded outcomes, not a claim that checks were rerun for documentation-only edits.

## Earlier evidence

| Report | Context |
| --- | --- |
| [Original baseline](BASELINE.md) | Original implementation results, including historical defects. |
| [Test cases](TEST-CASES.csv) | Earlier case inventory; review against current requirements. |
| [Packaged verification](PACKAGED-VERIFICATION.md) | Earlier portable-package validation. |
| [Hosting verification](HOSTING-VERIFICATION.md) | Earlier hosted release. |
| [Public smoke](PUBLIC-SMOKE.json) | Earlier public workflow run. |
| [Public campus](CAMPUS-PUBLIC.json) | Earlier populated hosted workflow run. |
| [Load smoke](load-smoke.json) | Limited earlier load experiment, not a capacity guarantee. |

The [original defect register](../DEFECTS.md) belongs to historical baseline evidence.
Reproduce findings on current code before reporting them as present defects.

Fresh generated HTML/results/traces are ignored by Git. See the [testing guide](../../../docs/testing/README.md).
