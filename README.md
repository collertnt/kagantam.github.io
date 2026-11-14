# kagantam.github.io

Personal portfolio site. Plain HTML, CSS and JavaScript: no build step.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Homepage: all the text for every section |
| `projects/*.html` | One page per project |
| `projects/template.html` | Blank project page to copy |
| `js/projects.js` | **The project list.** Edit this to add a project card |
| `js/art.js` | Line drawings used on cards that have no photo |
| `js/site.js` | Animations and widgets (rarely needs editing) |
| `js/minime.js` | The little animated Kagans |
| `css/site.css` | All styling. Colours and fonts are at the top |

## Add a project

1. Copy `projects/template.html` and rename it, e.g. `projects/line-follower.html`.
2. In `js/projects.js`, add an entry with `slug: "line-follower"` (same as the file name).
3. In the new page, set `data-project="line-follower"` on `<body>`, delete the `noindex` line, and fill in the text.

The card, the page colour and the "next project" links update on their own.

## Change the look

Open `css/site.css` and edit the colours under `:root` at the top.
