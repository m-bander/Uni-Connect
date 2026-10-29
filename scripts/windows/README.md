# Optional Windows helpers

Use root `npm run dev` to start the normal website on any supported operating system.
These PowerShell helpers are grouped here for Windows teammates:

| Script | Purpose |
| --- | --- |
| `Start-App.ps1` | Start the frontend and persistent backend together. |
| `Start-Backend.ps1` | Start only the persistent backend. |
| `Start-Frontend.ps1` | Start only the frontend with the normal API proxy. |
| `Run-Tests.ps1` | Run isolated regression checks; stop normal servers first. |

Run installation from the repository root first: `npm install`, then `npm run setup`.
Browser tests additionally need `npm run setup:testing`.
