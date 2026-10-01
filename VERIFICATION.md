# Favicon and How to use enhancement

The existing black-and-gold design and large header phone mark are preserved. `app.js`, `guide.js` and `guide-source.json` are byte-for-byte unchanged from the preceding package. Help interaction lives in `help.js`; it never changes selections, note output or storage.

| Latest check | Result |
| --- | --- |
| Page title exactly `Call Documentation` | Passed |
| SVG/ICO asset links and required files | Passed |
| ICO contains both 16×16 and 32×32 sizes | Passed |
| Native-size PNG dimensions and SVG XML | Passed |
| Handset readability at 16×16 and 32×32 | Visually reviewed |
| Original large header phone SVG | Passed: unchanged |
| Six instructional steps and labeled modal markup | Passed |
| Help open, X/Close and cancel handlers | Passed in harness |
| Focus wrap at both ends and return to trigger | Passed in harness |
| Selections, Other details, note, progress and saved draft unchanged by guide | Passed in harness |
| Copy shortcut contained during help; Ctrl/Command+Enter work after closing | Passed in harness |
| Existing workflow and Guide regressions | Passed |
| New help JavaScript syntax | Passed |
| Native Escape behavior, background inertness, focus traversal and modal scrolling | Pending real-browser QA |
| Browser tab favicon appearance and responsive help rendering | Pending real-browser QA |

Cloud Browser previously rejected this project's local preview URLs under its security policy. No retry or workaround was attempted for this enhancement. Native browser accessibility is implemented with `dialog.showModal()` plus explicit focus handlers; harness results do not prove browser behavior.

Additional check commands:

```bash
node help-tests.cjs
node --check help.js
```

Before rollout, open the extracted `index.html` locally. Confirm the favicon and exact tab title; open How to use with keyboard and mouse; check Tab/Shift+Tab wrapping, the Close/X controls and Escape, focus return, internal content scrolling on a short viewport, and inability to interact with the underlying form. Verify the draft remains unchanged and normal copy/New call work after closing.

---

# Black-and-gold update verification

## Scope and source integrity

This is a visual update to the existing application using the attached black-and-gold mockup. The existing Guide has 11 fields and 63 responses. Both `guide.js` and `guide-source.json` are byte-for-byte unchanged from the previously delivered package.

- `guide.js` SHA-256: `ca2d60887f450a86ddcfb29dc211833a3809926c6a8387275a7c8777aa7b495b`
- `guide-source.json` SHA-256: `e605d2de6c93dbb5b5fa384bdabfb229069ec6136e0c8dc5b27aac02d73b5029`

The JavaScript diff contains only presentation changes: padded number badges, completion-count wording, and an SVG ring using the existing validated count. Selection, note output, persistence, clipboard handling, shortcuts, Other validation, reset protection and draft recovery logic are unchanged. HTML/CSS provide the visual restyling.

## Checks performed

| Check | Result |
| --- | --- |
| Guide data, ordering and guidance compared with the independent source snapshot | Passed: 11 fields, 63 responses |
| Guide files compared with the previous ZIP | Passed: byte-for-byte unchanged |
| Every option label and exact response guidance | Passed in DOM harness |
| Static guidance below every selector, neutral state and reset | Passed in harness |
| Normal selection retains selector focus | Passed in harness |
| All fields mandatory; whitespace-only Other rejected | Passed in harness |
| Other details, clearing and exact note output | Passed in harness |
| Ring count for empty, complete and incomplete Other states | Passed in harness |
| Draft recovery, stale/corrupt draft rejection | Passed in harness |
| Clipboard success, legacy copy and manual fallback handlers | Passed in harness |
| Ctrl+Enter handler, protected reset and cancel | Passed in harness |
| JavaScript syntax | Passed |
| HTML asset references, required IDs and duplicate-ID check | Passed |
| Text contrast for measured token pairs | Passed; listed below |
| Source comparison with mockup hierarchy, colors and dimensions | Reviewed |
| Rendered comparison with the mockup | Blocked by Cloud Browser security policy |
| Browser keyboard behavior, clipboard permissions, responsive screenshots and native menu appearance | Pending |

The workflow checks execute the real app in a lightweight DOM harness. They are not browser rendering or native-control tests. Cloud Browser could not open the local HTTP preview and subsequently rejected the documented shared-file URL protocol. No browser screenshots or pixel-level fidelity pass are claimed.

## Run automated checks

```bash
node verify.cjs
node workflow-tests.cjs
node --check app.js
```

Node.js is only required for these optional developer checks. The application runs by opening `index.html`.

## Local visual and browser review

1. Extract the package and open `index.html` in a modern browser. Compare it with the supplied mockup at 1536 × 1024. Check charcoal surfaces, gold badges, individual field cards, warm guidance callouts, circular progress and the right-side preview.
2. Confirm all 11 guidance callouts are visible before selection. Select a response and confirm exact guidance appears immediately, with no extra click or focus move for normal choices.
3. Choose long responses and substantially different guidance lengths in adjacent cards. Check natural wrapping and absence of clipping or overlap. Review desktop, narrow desktop and mobile widths, including 1280px, 1100px, 820px, 390px and 320px.
4. Complete every field. Check the progress count/ring and Copy availability. Select Other in the final field and test blank, whitespace and actual details; compare the copied note with the selected values.
5. Test copying and Ctrl+Enter/Command+Enter, including manual fallback when clipboard access is blocked. Confirm copy feedback and that the action remains reachable in short viewports.
6. Reload the same tab to test draft recovery. Test New call cancellation, confirmation, and immediate reset after copying an unchanged note. Confirm guidance remains visible after reset.
7. Navigate with Tab and arrows, inspect focus outlines and native dropdowns, and use Escape to close the reset dialog. Check browser console errors before rollout.

## Measured text contrast

Measurements use the lighter surface stop or darker enabled gold stop as appropriate. They do not constitute a complete accessibility audit or rendered gradient sampling.

| Text / background | Ratio |
| --- | --- |
| Main text / lightest panel | 16.75:1 |
| Muted text / lightest panel | 9.37:1 |
| Guidance text / lightest guidance stop | 8.39:1 |
| Guidance label / lightest guidance stop | 10.94:1 |
| Dropdown placeholder / lightest control stop | 7.46:1 |
| Copy label / darkest enabled gold stop | 8.75:1 |
| Success text / lightest panel | 11.44:1 |
