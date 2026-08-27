# KeyMan Chicago commercial case-study design QA

## Evidence

- Source visual truth: `/var/folders/5_/qpbsct595hxc8zl2vxzgnl200000gn/T/codex-clipboard-259d9b97-157e-48a7-b4f4-4e17aa293198.jpg`
- Browser-rendered desktop top: `work/design-qa/keyman-commercial-en-1024-top.jpg`
- Browser-rendered desktop bottom: `work/design-qa/keyman-commercial-en-1024-bottom.jpg`
- Browser-rendered mobile top: `work/design-qa/keyman-commercial-ru-390-top.jpg`
- Combined desktop top comparison: `work/design-qa/keyman-commercial-top-comparison.png`
- Combined closing-section comparison: `work/design-qa/keyman-commercial-closing-comparison.png`
- Source pixels: 1024 × 1536 at 1×.
- Desktop implementation capture: 1009 × 887 pixels from a requested 1024 × 900 CSS viewport at devicePixelRatio 1. The 15px/13px difference is the browser scrollbar area.
- Mobile implementation capture: 375 × 844 pixels from a requested 390 × 844 CSS viewport at devicePixelRatio 1. The 15px width difference is the browser scrollbar area.
- Comparison normalization: the source top was cropped to 1024 × 900 and scaled to 1009 × 887 before horizontal stacking with the implementation. The closing comparison uses 1009 × 400 normalized crops from both artifacts.
- State: dark theme, English desktop route and Russian mobile route, no modal or menu open.

## Full-view comparison

The implementation follows the selected reference’s commercial storytelling order: cinematic hero, challenge/approach, deliverables, reach, project gallery, project statement, CTA and full PRODUP footer. The supplied owner-and-van hero image, black-to-transparent left gradient, white/lime headline, thin borders and compact content rails preserve the reference’s hierarchy while using the existing PRODUP header, typography, button and footer system.

The implementation is intentionally taller than the 1024 × 1536 presentation board because the final brief requests larger photography, readable neutral copy, a real footer and responsive cards rather than a compressed single-board mock. This is an accepted structural translation, not an unresolved mismatch.

## Focused-region comparison

- Hero: `work/design-qa/keyman-commercial-top-comparison.png` shows the same subject placement, left-to-right tonal balance, three-line headline, lime emphasis, service chips and primary action hierarchy. A fake video control from the reference is intentionally omitted because no real video URL was supplied.
- Closing: `work/design-qa/keyman-commercial-closing-comparison.png` shows the reference testimonial slot replaced with the requested neutral project-overview card; the adjacent purple production CTA preserves the reference’s proportions and visual emphasis without invented endorsement copy.

## Required fidelity surfaces

- Fonts and typography: existing PRODUP sans/mono families are retained. Display weight, tight leading and negative tracking match the site system; the desktop hero stays at three lines, and localized headings wrap without clipping.
- Spacing and layout rhythm: sections use one shared shell width, 9–10px editorial gaps, thin borders and compact vertical spacing. No oversized empty region remains below the process timeline.
- Colors and tokens: black/graphite/off-white/lime map directly to existing PRODUP tokens. KeyMan blue and orange appear only inside supplied photography.
- Image quality and asset fidelity: the approved 1916 × 821 hero is used at full width. Supporting crops come from the supplied 1536px reference boards; their numbered board labels were losslessly removed. No repeated gallery image, placeholder, emoji or approximate illustration is rendered.
- Copy and content: all visible report, evidence, date, source, draft, validation and publication-status terminology is removed in EN/RU/UK. Current figures are shown without plus signs, percentages or attribution claims.
- Interaction and accessibility: header navigation, locale links, website/Instagram/YouTube actions, discovery CTA and footer links are semantic and keyboard reachable. The mobile menu was opened and closed successfully; focus styles and reduced-motion rules are inherited from PRODUP.

## Responsive verification

- Tested widths: 1440, 1280, 1024, 768, 430, 390 and 360 CSS pixels.
- No horizontal document overflow at any tested width.
- Card columns: 6 / 3 / 3 / 2 / 1 / 1 / 1.
- Metric columns: 4 / 4 / 4 / 2 / 2 / 2 / 1.
- Process: horizontal on desktop, wrapped at tablet widths, vertical below 600px.
- Mobile hero: image is placed above the copy, so text does not cover the owner’s face.

## Findings

No actionable P0, P1 or P2 findings remain.

## Comparison history

1. [P2] The first Russian 1440px capture used a long translated hero line that extended across the owner. Fix: localized hero lines were shortened while preserving the required three-line white/lime hierarchy. Post-fix evidence: responsive measurements show no overflow at all seven widths and the mobile capture keeps media separate from copy.
2. [P2] The first 1440px Russian timeline capture allowed long stage names to collide. Fix: stage labels received constrained wrapping and locale-aware hyphenation; the mobile process was changed to a vertical sequence. Post-fix evidence: desktop has ten distinct stages, tablet wraps to five columns and mobile renders one stage per row.
3. [P2] The rejected page contained report-oriented source notes, publication status, a metric disclaimer and a fake trusted row. Fix: the KeyMan DOM was rebuilt into the eight requested commercial case-study sections and the real shared `Footer` was restored. Post-fix evidence: browser text checks across EN/RU/UK return no rejected phrases.

## Primary interactions tested

- Open/close mobile navigation.
- Locale-specific route rendering for EN, RU and UK.
- Website, Instagram and YouTube action hrefs.
- Discovery CTA and shared footer presence.
- Browser console errors checked: none.

## Follow-up polish

- [P3] If approved original standalone photography becomes available, it can replace the supporting board-derived crops without changing the current layout.
- [P3] A real testimonial can replace the neutral project statement later, if the client approves one.

final result: passed
