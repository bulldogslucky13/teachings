---
name: youtube-description
description: Write the YouTube title and description for one of Cameron's teachings, in his usual voice. Use whenever Cameron asks for a YouTube description, video description, video title, or "the blurb for YouTube" for a sermon, lesson, College Hour or series message, including right after a new teaching is added to the site.
---

# YouTube title and description

Cameron posts each teaching to YouTube with a dated title and a short description. Match his established format and tone so the channel reads as one body of work.

## Gather first

1. **The teaching itself.** The transcript (a Google Doc, usually titled `M/D/YY - <working title>`) is the source of truth for the big idea, key passage, outline and any memorable phrases. The final title can differ from the doc's title or the first slide (he sometimes pivots after writing), so confirm the title with Cameron or use the one in `lib/teachings/teachings.ts`.
2. **The site entry.** The teaching's `description` in `lib/teachings/teachings.ts` covers the same ground. Use it as a starting point, but the YouTube version is not a copy (see below).
3. **Two or three recent descriptions for tone**, ideally the previous message in the same series. Read them from the video page: open `https://www.youtube.com/watch?v=<id>` (the ids are in each teaching's `videoUrl`) and read `ytInitialPlayerResponse.videoDetails.shortDescription` with a page script. The page title gives the video's title.

## Title format

```
M-D-YY - <Title> (<Scripture>)
```

- Date is the date it was taught, with dashes and no leading zeros: `11-15-26`, `10-4-26`.
- Title uses the teaching's title as it appears on the site, keeping `&` if the title has one.
- Scripture is the featured passage(s) only, books abbreviated with a period when they're commonly abbreviated (`Matt.`, `2 Tim.`, `Eph.`), full names for short ones (`Isaiah`). Separate several passages with `; `.
- Examples: `11-8-26 - The Jewel & The Safe (2 Tim. 3:16-17; Eph. 2:8-10)`, `10-4-26 - Living Near the Holy God (Isaiah 6:8-9)`.

## Description: shape

Usually one paragraph of about 110–160 words. Occasionally a short second paragraph that lists the takeaways, but default to one.

1. **Hook.** Open with the question the teaching answers ("How should we view…?", "What must a person do in order to be saved?") or with the scene from the text ("Having seen the holiness of God…, Isaiah eagerly answers…").
2. **Place it.** Name where it sits: "In this second message of our “<Series>” series at Wildwood College," or "In the final session of <Series>,". Spell out ordinals ("first", "second", "final").
3. **The text and its big idea.** Name the passage with "From <passage>, we see…" and give the main point, using Cameron's own memorable phrases or metaphors from the transcript, set in quotation marks when they're his labels ("the safe", "the jewel").
4. **The balancing clause.** He often heads off a misreading with "That doesn't mean…; it means…" or "That doesn't make us…". Include one when the teaching has an obvious overcorrection to guard against.
5. **The rest of the ground covered.** For a two-part message, follow with "We then…" or "We also look at…" and name the specific things covered (creeds, councils, heresies, people), briefly.
6. **Close on application or the payoff** of the teaching, not a call to like or subscribe.

## Description: voice

- First person plural throughout: "we see", "we look at", "we gladly embrace". Never "I" or "you".
- Reverent, calm and confident. Plain theological vocabulary (justified, atonement, normed by Scripture) without explaining it to death.
- Doctrinal claims stated as conviction, not hedged.
- Typographic (curly) quotes and apostrophes: “ ” ’.
- No emoji, hashtags, links, timestamps, calls to action or "in this video".
- Scripture references written as `Book ch:vv`, full book names in the body (`2 Timothy 3:16-17`, `Matthew 15:1-6`).

## Site description vs YouTube description

They overlap but aren't identical. The YouTube one names the series and Wildwood College, adds the balancing clause, and can name more specifics. The site entry in `teachings.ts` skips the series/venue framing because the site already shows it. Don't overwrite one with the other.

## Deliver

Give Cameron the title and description in two separate fenced code blocks so each copies cleanly, with no commentary inside them.
