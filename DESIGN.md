# Black-and-gold visual specification

## Favicon and help enhancement

The browser title is now `Call Documentation`. The favicon uses a simplified filled gold handset on a near-black circular background with a restrained gold rim. Its SVG and ICO retain the header icon's visual identity; the ICO contains 16×16 and 32×32 versions, with matching PNG exports. Both native raster sizes were visually inspected. The original large header phone SVG is unchanged.

The upper-right header groups a subdued **? How to use** action with the existing, brighter outlined **New call** action. Small viewports wrap this action group into its own header row. The current documentation cards, guidance and preview styling remain unchanged.

The help guide is a labeled native modal dialog on a charcoal surface with a gold border, six gold numbered steps, muted descriptions, and a warm Quick tip callout. Its header/X and footer/Close controls remain fixed while the middle content region scrolls. The backdrop dims the page, and body scrolling is locked while it is open.

Native `showModal()` makes the rest of the document inert. Explicit focus wrapping supplements native focus containment, and focus returns to How to use on close. Escape invokes the cancel handler. Copy-shortcut events are contained while this modal is open so they cannot act on the underlying form; the existing shortcut handler and all workflow code remain unchanged. The guide uses a separate `help.js` module and does not read or write selections, notes or storage.

Primary reference: the supplied `image(20261001-162847).png` mockup, 1536 × 1024 pixels. This update restyles the existing application rather than rebuilding it. The earlier Figma composition is superseded by this visual reference.

## Visual treatment

The page uses near-black and charcoal surfaces with low-opacity warm ambient gradients. Individual field cards separate each documentation field. Gold appears on number badges, guidance headings and information icons, the completion ring, the Copy action, and the outlined New call action. Text stays predominantly white or neutral gray. Success indicators use a restrained green.

The desktop workspace has a maximum width of 1600px, 44px outer padding and a 16px panel gap. The form and preview use proportions of 2.34:1, approximating the mockup's wider documentation area and narrower right-hand preview. The documentation panel has 12px padding, with a 10px gap between field cards. Each field uses 10px vertical and 14px horizontal padding, a subtle border and a 12px radius.

The header contains a decorative circular phone mark, a 30px title, the existing workflow caption, and the outlined New call button. The form heading is 21px. The preview heading is 24px. Field labels are 15px; dropdown and guidance text are 14px. The guidance heading is 13px. The font stack uses locally available Inter/system sans serif and does not download fonts.

The circular progress display uses the existing validated completion count. A semantic progress element remains available to assistive technology. Number badges keep `01` through `11`; a small checkmark marks completed fields without relying on color alone.

## Guidance and controls

The field hierarchy remains numbered field label → native disposition selector → information icon and When to use heading → exact guidance text. The guidance heading and paragraph share a permanently visible warm-tinted callout. Initial text remains “Choose a response above to see when to use it.” Guidance never collapses, animates, clips or becomes a separate scrolling area.

Selected values wrap naturally. The native select remains the accessible keyboard control, overlaid on the existing wrapping visual value. The gold focus outline appears around the entire control. Actual responses, field names, option order and guidance are unchanged.

The desktop grid aligns field cards at the top of each row. Each card grows with its own content, and the next row starts below the taller card. No fixed height is imposed on field labels, dropdown values or guidance.

## Preview and actions

The right-side preview remains sticky on desktop. Its border, restrained top glow, live indicator, empty-note icon, note surface and gold Copy action follow the reference. Selected notes retain separate labels and responses; copied text remains the existing exact plain-text note. The native clipboard fallback textarea and reset dialog remain available.

Copy remains disabled until all fields are valid, including a nonblank Other explanation. Its disabled gold treatment is subdued; the brighter gold treatment indicates availability. The mockup's visually enabled Copy action at zero completion is not used to change validation.

Responsive layouts retain the same controls. At 1100px the documentation fields become one column beside the preview. At 820px the preview moves below the form and fields use two columns when space permits. At 620px fields use one column. The decorative phone mark is omitted at small widths to leave room for the title and New call action. Short desktop viewports reduce preview spacing, and the preview allows scrolling when needed.

## Colors

| Token | Value | Purpose |
| --- | --- | --- |
| `--bg` | `#0b0b0c` | Application background |
| `--surface` | `#111112` | Charcoal surfaces |
| `--secondary` | `#202123` | Control fallback fill |
| `--border` | `#303032` | Understated panel borders |
| `--control-border` | `#646466` | Dropdown and input boundaries |
| `--text` | `#f5f4f2` | Primary text |
| `--muted` | `#b9b9b7` | Secondary text |
| `--accent` | `#edc16b` | Gold icons and accents |
| `--accent-light` | `#f5d796` | Gold headings and focus |
| `--gold-border` | `#91703b` | Preview and dialog outline |
| `--success` | `#a9d8a5` | Completion and success |
| `--error` | `#ffadad` | Required explanation feedback |

Guidance uses a gradient from `#2a2517` to `#211e14`; controls use `#242527` to `#191a1c`; the enabled Copy action uses `#d8aa55` to `#f5cd79`.

## QA status

The mockup was inspected and the implementation source was compared with its hierarchy, proportions, palette, cards and spacing. Rendered side-by-side visual QA could not be completed: Cloud Browser blocked the local HTTP preview and rejected the shared-file URL protocol under its security policy. No workaround was attempted after that policy rejection. Pixel matching, browser font resolution, responsive rendering and native menu appearance remain unverified. See `VERIFICATION.md` for checks and the local review procedure.
