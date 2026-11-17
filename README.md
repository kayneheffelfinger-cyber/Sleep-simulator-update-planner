# 🌙 Sleep Simulator Update Planner

A development planner for **Sleep Simulator**, a Roblox game that already includes different beds, rebirths, a skill tree, and a Robux shop selling the premium currency **Zzz**.

This repository is the planning and workflow companion for the game. It is **not** the Roblox game's source-code project.

## Download the planner

**[Download the complete planner package](./Sleep_Simulator_GitHub_Repository.zip)**

1. Download the ZIP file above (or use **Code → Download ZIP**).
2. Extract the archive.
3. Open the `sleep-simulator-update-planner` folder.
4. Open `Sleep_Simulator_Update_Planner.xlsx` in Excel or another spreadsheet app.

## What's included

The Excel workbook has seven worksheets:

| Worksheet | What it is for |
| --- | --- |
| **Start Here** | Dashboard, recommended AI workflow, and Roblox project safety rules |
| **Roadmap** | Suggested feature and polish milestones |
| **Backlog** | Individual tasks, priorities, status, and acceptance checks |
| **Prompt Library** | Copy-ready prompts for Codex and Claude |
| **Claude Sessions** | A place to plan work across Claude's usage windows |
| **Test Checklist** | Checks to run in Roblox Studio after updates |
| **Economy Audit** | A worksheet for recording actual bed, rebirth, skill, and Zzz values |

The ZIP also contains preview images of the dashboard, roadmap, prompt library, and test checklist.

## Recommended development workflow

1. **Plan with Claude.** Ask it to turn one feature idea into a small implementation brief with acceptance criteria and edge cases.
2. **Implement with Codex.** Give Codex access to the actual Roblox project and ask it to inspect the relevant scripts before making a focused change.
3. **Test in Roblox Studio.** Verify the feature in a test session, including saving, multiplayer behavior, and mobile layout where relevant.
4. **Record the result.** Update the backlog and checklist, then save a known-good checkpoint before starting the next task.

## Important safeguards

- Keep one coding assistant as the active editor at a time.
- Back up the Roblox project before substantial edits.
- Do not casually rename data keys, reset player data, or replace existing systems.
- Keep purchase receipt validation and Zzz grants on the server.
- Never put passwords, API keys, or private credentials in prompts or this repository.
- Treat AI review as assistance, not a substitute for Roblox Studio playtesting.

## Existing game systems to preserve

The planner assumes these systems already exist and should be improved rather than rebuilt:

- Different types of beds
- Rebirth system
- Skill tree
- Robux shop for Zzz currency

## Updating this planner

When the roadmap or prompts change, update the workbook and replace the package in this repository with the latest tested version. Keep the ZIP and workbook version in sync.

---

*Made to help plan small, safe, testable updates to Sleep Simulator.*


## 🌐 Website version

A browser-based version of the planner is included in the repository:

- `index.html` — website entry page
- `styles.css` — responsive styling
- `app.js` — planner data and interactions

The website includes the roadmap, backlog, prompt library, Claude session tracker, test checklist, and economy audit. Editable changes are stored in the current browser using local storage. Use **Export backup** to download a JSON copy before clearing browser data or switching devices.

### Run it locally

Download `index.html`, `styles.css`, and `app.js` into the same folder, then open `index.html` in a modern browser. The Excel workbook remains available as a separate download.

### Publish with GitHub Pages

GitHub Pages supports publishing from the `main` branch and repository root. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.

**Plan visibility note:** GitHub Pages on GitHub Free for personal accounts requires a public repository. This repository is currently private. To publish it with GitHub Pages on the Free plan, you would need to change the repository visibility to public first. A published Pages site is publicly accessible, so do not publish private information. If you want to keep this repository private, use a hosting option that supports private repositories or run the downloaded files locally.
