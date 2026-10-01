# Call documentation tool — Black-and-gold update

The latest enhancement adds the gold-phone browser favicon, the page title **Call Documentation**, and a secondary **? How to use** header button. The six-step guide opens in a native modal, with Close/Escape handling, contained keyboard focus, and a scrolling content area. Opening or closing it preserves your documentation and draft.

A visual update to the existing standalone HTML app, based on the supplied black-and-gold mockup. Charcoal field cards, gold number badges, warm guidance callouts, circular progress, and a sticky Live Preview panel preserve the current documentation workflow. “When to use” stays visible below every selector and updates immediately with the exact selected response's guidance. All 11 fields and 63 responses remain unchanged.

Data and workflow checks pass. The source was compared with the mockup's design hierarchy and proportions. Rendered visual QA is pending because Cloud Browser's security policy blocked local preview URLs. Open `index.html` to review the finished appearance before rollout; a pixel-level match has not been verified.

## Run locally

Extract the ZIP and open `index.html` in a modern browser. No installation, server, Google account, or build step is needed. Draft recovery uses sessionStorage when the browser permits it. If clipboard access is blocked, the app attempts browser copy and then selects the note for manual copying.

## Update your existing GitHub repository

1. Sign in to the GitHub account that owns your existing repository.
2. Upload the extracted files to the repository root, replacing the existing files. `index.html` must be at the root, not inside an extra folder. Commit the files.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose **main** and **/(root)**, then save.
6. Open the site URL shown by GitHub Pages after deployment finishes.

Your existing GitHub Pages settings can remain unchanged.

A static GitHub Pages deployment does not provide application login. Choose repository/site visibility appropriate for your team's data. No call notes are transmitted. Drafts are saved locally for the current browser tab, including Other explanations, and clear when you start a new call. The deployed Guide is a static snapshot and does not automatically synchronize with Google Sheets.

GitHub reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Daily workflow

- Use **? How to use** for the step-by-step guide. Close it with the X, **Close guide**, or Escape to continue where you left off.
- Select every field. No response is selected automatically.
- Read “When to use” directly below the selector. Before selection it shows “Choose a response above to see when to use it.” No extra click is needed.
- `Other:` under `If Not Achieved, What Stopped It?` requires a nonempty explanation. Leading/trailing whitespace is removed, as in the original tool.
- Review the note and click **Copy completed note**, or press **Ctrl+Enter** / **Command+Enter**.
- Click **New call**. Uncopied selections require confirmation. After copying an unchanged note, reset is immediate.
- Use Tab to move between controls and arrow keys to choose native dropdown options.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic app layout |
| `styles.css` | Desktop and mobile styling |
| `app.js` | Rendering, validation, note creation, copy and reset |
| `help.js` | How to use modal focus, close and keyboard handling |
| `favicon.svg` | Scalable gold-phone favicon |
| `favicon.ico` | Browser favicon with native 16×16 and 32×32 sizes |
| `favicon-16.png`, `favicon-32.png` | Raster copies at native favicon sizes |
| `guide.js` | Editable disposition data |
| `guide-source.json` | Original extracted Guide rows for comparison |
| `verify.cjs` | Dependency-free Node.js data regression check |
| `VERIFICATION.md` | Checks performed and remaining browser checks |
| `DESIGN.md` | Mockup reference, visual tokens and layout specification |
| `workflow-tests.cjs` | Dependency-free application logic checks |
| `help-tests.cjs` | Help handlers and draft/shortcut preservation checks |

## Maintaining the Guide

Edit `guide.js` to update fields, responses and guidance. Preserve the array order to preserve note order. All options render dynamically. `app.js` contains only the existing exact-name `Other:` special case, not new business rules.

The snapshot in `guide-source.json` is independent of the app dataset. Keep it unchanged when checking against the original workbook. For an approved Guide revision, replace the snapshot with the authoritative new rows and review the change.

Run `node verify.cjs` to compare the app data with the original snapshot and `node workflow-tests.cjs` to check application logic. Node.js is only needed for this optional developer check, not to run the app.

Run `node help-tests.cjs` for help open/close/cancel handlers, focus wrapping/return, unchanged draft state, and normal copy shortcuts after closing. Browser-native dialog accessibility and rendering still need local browser review; the harness is not a browser.

## Implementation assumptions

All Guide fields remain mandatory even if a previous answer seems to make a later field irrelevant. No conditional business rules, suggested dispositions or automatic substitutions were added. Fields are grouped by first appearance, options retain row order, blank guidance remains blank in the dataset, and extraction trims strings exactly as the original Apps Script does. Drafts survive reloads in the same tab when sessionStorage is available. A Guide change invalidates the saved draft to avoid incorrectly mapping old selections. No cross-tab or server storage is introduced.
