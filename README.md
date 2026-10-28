# 热風 · Hotwind Youth Club

[Open the website](https://jiangkun-xiong.github.io/hotwind-youth-club/) · [Jiangkun’s portfolio](https://jiangkun-xiong.github.io/index.html)

A bilingual, multi-page portfolio of a student-led community founded by Jiangkun Xiong in January 2024. It follows Hotwind’s development from a reading salon into a community for reading, peer learning, public dialogue and creative health communication.

The website contains 14 content pages and a custom 404 page. Each entry has its own URL and identifies whether it is supported by activity photographs, event materials or exploratory planning. Explanations and captions are available in English and Chinese.

## Explore

| Page | File |
| --- | --- |
| Home | `index.html` |
| Development story | `story.html` |
| All initiatives | `initiatives.html` |
| Reading and Changliu programme | `project-reading.html` |
| Tuberculosis role-play | `project-tb-roleplay.html` |
| Pregnancy and women’s-health discussion | `project-womens-health.html` |
| Peer Voices | `project-peer-voices.html` |
| Summer gatherings | `project-summer-gatherings.html` |
| Family and education dialogue | `project-family-dialogue.html` |
| Listening to students | `project-listening.html` |
| Founder’s contribution | `role.html` |
| Impact and evidence | `impact.html` |
| Visual archive | `gallery.html` |
| Source, historical-notice and privacy notes | `record-notes.html` |

## Edit the website

Read [EDITING_GUIDE.md](EDITING_GUIDE.md) for step-by-step Chinese instructions.

- **Replace/add photographs:** `assets/js/media.js` and `assets/images/`. No build is needed.
- **Change colours and spacing:** variables at the beginning of `assets/css/styles.css`.
- **Change an individual page:** edit that HTML file directly. English and Chinese appear in `data-en` and `data-zh`.
- **Change all shared layouts or regenerate text:** update `scripts/build.mjs` and `content/*.json`, then run `node scripts/build.mjs`.
- **Original-to-web filename mapping:** [ASSET_MAP.md](ASSET_MAP.md).

The site uses HTML, CSS and plain JavaScript. GitHub Pages serves the committed files without dependency installation or a custom build workflow. Enable Pages from **main / (root)**.

## Evidence and attribution

Photographs, event posters and selected project materials were supplied by the founder. Headline programme totals (30+ activities, around 20 weeks of shared reading across programme cycles, nine core team members) are founder-reported. The archive documents selected events. Planning documents are identified as planning, not completed research; unverified statistics in draft literature summaries are not presented as original findings.

The overall project overview includes illustrative case artwork. It is labelled separately from original event posters and photographs. Original source documents and the full source ZIP are not published in this repository.

This is a historical project portfolio, not an active event-registration service. Photographs, posters and third-party marks are not licensed for unrestricted reuse.

Read [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for the source register, translation corrections and limits of the review. The website’s [record notes](https://jiangkun-xiong.github.io/hotwind-youth-club/record-notes.html) explain the historical notices and privacy boundaries to visitors.
