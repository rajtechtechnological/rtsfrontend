# Institute photos

Drop your real photos into this folder using the paths below. They appear
automatically on the landing page — no code change needed. Until a file exists,
an elegant gradient placeholder shows in its place.

## Faded section backgrounds (single image each)

| File                 | Where it appears                                  | Suggested subject          |
| -------------------- | ------------------------------------------------- | -------------------------- |
| `hero/01.jpg`, `02`… | Faded backgrounds behind the hero, cross-fading   | Lively institute photos    |
| `about.jpg`          | Faded background in the About section             | Any representative photo   |

The hero cycles through the images listed in `heroImages` in `app/page.tsx`
(`hero/01.jpg`, `hero/02.jpg`, `hero/03.jpg` by default). Add more files and
list them there to extend the slideshow; a single image just stays put.

## Gallery albums (multiple images each)

Each gallery tile is an **album**. The tile shows `01.jpg` as its cover; clicking
it opens a lightbox with every photo in that album's folder. Add photos as
`01.jpg`, `02.jpg`, `03.jpg`, … inside the matching subfolder:

| Folder                  | Album              | Photos expected |
| ----------------------- | ------------------ | --------------- |
| `campus/`               | Our Campuses       | `01`–`05.jpg`   |
| `classrooms/`           | Classrooms & Labs  | `01`–`05.jpg`   |
| `faculty/`              | Faculty            | `01`–`04.jpg`   |
| `staff/`                | Staff              | `01`–`04.jpg`   |
| `convocation/`          | Convocation        | `01`–`06.jpg`   |
| `events/`               | Events             | `01`–`06.jpg`   |
| `student-life/`         | Student Life       | `01`–`04.jpg`   |

Example: `public/gallery/campus/01.jpg`, `public/gallery/campus/02.jpg`, …

To add/remove albums or change how many photos each holds, edit the
`galleryAlbums` array in `app/page.tsx` (the `shots` field is the photo count).

## Journey timeline (multiple images per year)

Each card in the "Our journey" timeline opens a dialog with that year's photos
and story. Add photos as `01.jpg`, `02.jpg`, … inside `journey/<year>/`:

| Folder          | Milestone       | Photos expected |
| --------------- | --------------- | --------------- |
| `journey/2015/` | Founded         | `01`–`04.jpg`   |
| `journey/2017/` | Expansion       | `01`–`04.jpg`   |
| `journey/2019/` | 5000+ Students  | `01`–`05.jpg`   |
| `journey/2021/` | Digital Growth  | `01`–`04.jpg`   |
| `journey/2023/` | 8000+ Students  | `01`–`05.jpg`   |
| `journey/2025/` | New Platform    | `01`–`04.jpg`   |

The years, stories, and photo counts live in the `milestones` array in
`app/page.tsx` (the `shots` field is the photo count).

## Tips

- **Format:** JPEG (`.jpg`). Keep each file under ~500 KB — export at ~1600px
  wide for gallery photos and ~2000px wide for `hero.jpg`.
- **Aspect:** tiles and lightbox crop to fill (`object-cover`), so exact ratios
  don't matter, but landscape shots read best.
