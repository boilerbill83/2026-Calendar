# 2026 Family PTO Planner

A standalone HTML/CSS/JavaScript calendar for planning November–December 2026 PTO around HSE school breaks, company holidays, and family availability.

## GitHub Pages

1. Upload/overwrite the files in this repository.
2. In GitHub: **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Save.

No build step, Node.js, npm, or framework is required.

## Updating the app

For future versions, replace these same three files:

- `index.html`
- `styles.css`
- `app.js`

`README.md` can remain unchanged.

The calendar data and proposed PTO are all in `app.js`, so future changes can be made there without changing the app structure.

## Current assumptions

- PTO balance: 112 hours.
- PTO day: 8 hours.
- HSE Thanksgiving break: November 25–27, 2026.
- HSE Winter Break: December 21, 2026–January 1, 2027.
- Company holidays in this view: November 26, November 27, December 25.
- Confirmed PTO: November 23–25, December 28–31.
- Mandatory work training: November 30–December 1.
- PI Planning: December 7–10.

## Important

December PTO is confirmed for December 28–31 because Robertson is off that week.
