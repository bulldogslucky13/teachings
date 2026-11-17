"""Build the raster assets the deck needs. Everything else on the slides is a
native PowerPoint shape or text box.

  python3 scripts/make_assets.py

Writes:
  assets/parchment.jpg  procedural parchment texture (slide background)
  assets/cathedral.png  cathedral photo cut out of the original cover art
  assets/manuscript-*.png  ink lifted off the P46 leaf (real Greek, transparent bg)
  assets/aged-*.{png,jpg}, assets/red-grunge.png  paper and red-block textures
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
COVER_ART = ASSETS / "reference" / "cover-art.webp"


def smooth_noise(rng, w, h, cells_x, cells_y):
    small = rng.random((cells_y, cells_x)).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img).astype(np.float32) / 255 - 0.5


def make_parchment(w=2400, h=1350, seed=7):
    rng = np.random.default_rng(seed)
    base = np.array([232, 220, 200], np.float32)
    edge = np.array([214, 193, 160], np.float32)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # light falls on the left-centre (behind the title), edges age to a darker tan
    d = np.sqrt(((xx - w * 0.32) / (w * 0.75)) ** 2 + ((yy - h * 0.55) / (h * 0.85)) ** 2)
    vignette = np.clip(d, 0, 1) ** 1.6
    img = base[None, None, :] * (1 - vignette[..., None]) + edge[None, None, :] * vignette[..., None]

    mottling = (
        smooth_noise(rng, w, h, 10, 6) * 1.0
        + smooth_noise(rng, w, h, 28, 16) * 0.6
        + smooth_noise(rng, w, h, 90, 50) * 0.35
    )
    img += mottling[..., None] * np.array([13, 13, 14], np.float32)

    # a few soft stains
    stains = np.zeros((h, w), np.float32)
    for _ in range(14):
        cx, cy = rng.random() * w, rng.random() * h
        r = rng.uniform(40, 220)
        stains += np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * r * r))) * rng.uniform(0.2, 0.7)
    img -= np.clip(stains, 0, 1)[..., None] * np.array([6, 10, 17], np.float32)

    # fibres: faint, mostly horizontal streaks
    fib = rng.normal(0, 1, (h // 2, w // 16)).astype(np.float32)
    fib = np.asarray(
        Image.fromarray(((fib - fib.min()) / (np.ptp(fib)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    ).astype(np.float32) / 255 - 0.5
    img += fib[..., None] * 7

    grain = rng.normal(0, 3.5, (h, w)).astype(np.float32)
    img += grain[..., None]

    # fine dark specks
    specks = rng.random((h, w)) > 0.9993
    specks = ndimage.binary_dilation(specks, iterations=1)
    img[specks] -= 38

    img = np.clip(img, 0, 255).astype(np.uint8)
    Image.fromarray(img).filter(ImageFilter.GaussianBlur(0.4)).save(
        ASSETS / "parchment.jpg", quality=88, optimize=True
    )


def make_cathedral():
    """Cut the cathedral out of the flattened cover art. Background = parchment or
    red-block pixels connected to the area outside the cathedral."""
    im = Image.open(COVER_ART).convert("RGB")
    W, H = im.size
    a = np.asarray(im).astype(np.int32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    L = 0.299 * R + 0.587 * G + 0.114 * B

    red = (R > 55) & (R > 2.0 * G) & (R > 2.0 * B)
    parch = ((L > 168) & ((R - B) > 12)) | (L > 200)
    bg_color = red | parch

    # region the cathedral may occupy (cover-art pixel coordinates)
    poly = [(806, H), (806, 655), (1000, 610), (1150, 520), (1205, 470), (1218, 250),
            (1330, 40), (1395, 0), (W, 0), (W, H)]
    region = Image.new("L", (W, H), 0)
    ImageDraw.Draw(region).polygon(poly, fill=255)
    inside = np.asarray(region) > 0

    # the small parchment card in the bottom-right corner sits on top of the
    # cathedral in the original; it is rebuilt as native shapes, so cut it out
    card = np.zeros((H, W), bool)
    card[648:, 1548:] = True

    bg = (~inside) | (bg_color & inside)
    lab, _ = ndimage.label(bg)
    outside_labels = set(np.unique(lab[~inside])) - {0}
    for x, y in [(1600, 150), (1560, 400), (1300, 60), (1450, 40), (1650, 600),
                 (1235, 330), (1100, 600), (900, 640)]:
        if lab[y, x]:
            outside_labels.add(lab[y, x])
    fg = ~np.isin(lab, list(outside_labels))
    fg = ndimage.binary_opening(fg, iterations=1)
    fg = ndimage.binary_fill_holes(fg)
    fg &= ~card
    fg &= inside
    lab2, n2 = ndimage.label(fg)
    sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
    fg = np.isin(lab2, np.where(sizes >= 1500)[0] + 1)

    alpha = np.asarray(
        Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    ).astype(np.float32) / 255

    # de-fringe: pull edge pixels and any red spill toward a neutral stone tone
    edge = (alpha > 0.02) & (alpha < 0.98)
    grow = ndimage.binary_dilation(edge, iterations=2) & fg
    rgb = a.astype(np.float32)
    gray = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    stone = np.clip(np.stack([gray * 1.03, gray * 0.98, gray * 0.90], -1), 0, 255)
    reddish = fg & (R > 60) & (R > 1.45 * G)
    mix = np.maximum(grow * 0.7, reddish * 1.0)[..., None]
    rgb = rgb * (1 - mix) + stone * mix

    ys, xs = np.where(alpha > 0.01)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, H)
    rgba = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").crop(box).save(ASSETS / "cathedral.png", optimize=True)
    # crop origin, so the deck can place the cutout exactly where it sat in the art
    print(f"cathedral.png crop box in cover-art px: {box} of {W}x{H}")


P46 = ASSETS / "reference" / "p46-romans11-philippians4.webp"

# Crops of the P46 leaf, in pixels of the leaf photo scaled up 3x.
MANUSCRIPT_CROPS = {
    "manuscript-romans.png": (70, 150, 900, 1000),  # left page: Romans 11:24-33
    "manuscript-philippians.png": (1010, 110, 1840, 930),  # right page: Philippians 4:14-23
    "manuscript-colossians.png": (1020, 760, 1650, 1130),  # end of Philippians, title of Colossians
}


def worn(rng, h, w):
    """Multiplier in 0..1 that fades ink and paper unevenly, like centuries of wear."""
    patchy = smooth_noise(rng, w, h, max(2, w // 160), max(2, h // 160)) + smooth_noise(rng, w, h, max(3, w // 50), max(3, h // 50)) * 0.6
    fade = np.clip(0.85 + patchy * 0.9, 0.55, 1)
    pits = np.asarray(
        Image.fromarray((rng.random((h, w)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    ).astype(np.float32) / 255
    return fade * np.clip((pits - 0.3) * 5, 0, 1) ** 0.4


# Two inks: sepia for parchment, and a pale ink that reads as lighter than the red
# blocks (the way the original cover's script sits on red).
INKS = {"": (78, 56, 36), "-light": (240, 214, 198)}


def make_manuscript():
    """Lift the ink off the P46 photo onto a transparent background, so the real
    Greek can sit over parchment or the red blocks."""
    rng = np.random.default_rng(46)
    im = Image.open(P46).convert("L")
    up = im.resize((im.width * 3, im.height * 3), Image.LANCZOS).filter(ImageFilter.UnsharpMask(3, 160, 2))
    a = np.asarray(up).astype(np.float32)
    # ink = darker than the local papyrus tone; this evens out the uneven lighting
    bg = np.asarray(up.filter(ImageFilter.GaussianBlur(18))).astype(np.float32)
    ink = np.clip((bg - a - 14) / 34, 0, 1) ** 1.3  # thinner strokes than a plain threshold
    ink[bg < 70] = 0  # the black table the leaf was photographed on
    lab, n = ndimage.label(ink > 0.25)
    sizes = ndimage.sum(ink > 0.25, lab, range(1, n + 1))
    ink[np.isin(lab, np.where(sizes < 12)[0] + 1)] = 0  # papyrus fibre specks
    ink *= worn(rng, *ink.shape)

    for name, (x0, y0, x1, y1) in MANUSCRIPT_CROPS.items():
        alpha = ink[y0:y1, x0:x1]
        h, w = alpha.shape
        # soften the cut edges so the crop does not read as a hard rectangle
        feather = 24
        ramp_x = np.clip(np.minimum(np.arange(w), np.arange(w)[::-1]) / feather, 0, 1)
        ramp_y = np.clip(np.minimum(np.arange(h), np.arange(h)[::-1]) / feather, 0, 1)
        alpha = alpha * ramp_y[:, None] * ramp_x[None, :]
        for suffix, colour in INKS.items():
            rgba = np.zeros((h, w, 4), np.uint8)
            rgba[..., :3] = colour
            rgba[..., 3] = (alpha * 235).astype(np.uint8)
            Image.fromarray(rgba, "RGBA").save(ASSETS / name.replace(".png", f"{suffix}.png"), optimize=True)


def aged_paper(w, h, seed, fade=(), opaque=False):
    """Older, crinkled paper for behind the manuscript. `fade` lists the sides
    ("l", "r", "t", "b") that dissolve raggedly into the slide's parchment."""
    rng = np.random.default_rng(seed)
    light = np.array([216, 196, 160], np.float32)
    dark = np.array([150, 118, 80], np.float32)
    big = smooth_noise(rng, w, h, max(2, w // 260), max(2, h // 260))
    mid = smooth_noise(rng, w, h, max(3, w // 60), max(3, h // 60))
    fine = smooth_noise(rng, w, h, max(4, w // 12), max(4, h // 12))
    # creases: ridges where a noise field crosses zero, at two scales
    crease = (1 - np.clip(np.abs(smooth_noise(rng, w, h, max(3, w // 45), max(3, h // 45))) * 14, 0, 1)) * 0.5
    crease += (1 - np.clip(np.abs(smooth_noise(rng, w, h, max(5, w // 14), max(5, h // 14))) * 18, 0, 1)) * 0.3
    t = np.clip(0.32 + big * 0.5 + mid * 0.45 + fine * 0.35 + crease * 0.35, 0, 1)[..., None]
    img = light * (1 - t) + dark * t
    # fibres and grain
    fib = rng.normal(0, 1, (h, max(2, w // 8))).astype(np.float32)
    fib = np.asarray(Image.fromarray(((fib - fib.min()) / np.ptp(fib) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255 - 0.5
    img += (fib * 10 + rng.normal(0, 6, (h, w)))[..., None]
    specks = ndimage.binary_dilation(rng.random((h, w)) > 0.9993)
    img[specks] -= 45
    rgb = np.clip(img, 0, 255).astype(np.uint8)
    if opaque:
        return Image.fromarray(rgb)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    edge = np.ones((h, w), np.float32)
    ragged = smooth_noise(rng, w, h, max(4, w // 25), max(4, h // 25)) * 0.45 + fine * 0.25
    span = 0.28 * min(w, h)
    dist = {"l": xx, "r": w - 1 - xx, "t": yy, "b": h - 1 - yy}
    for side in fade:
        edge *= np.clip(dist[side] / span + ragged, 0, 1)
    alpha = np.clip(edge**1.3 * (0.9 + mid * 0.2), 0, 1)
    return Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]), "RGBA")


def red_grunge(w=640, h=640, seed=3):
    """Translucent mottling laid over the red blocks: darker blotches, paler wear."""
    rng = np.random.default_rng(seed)
    m = (
        smooth_noise(rng, w, h, 4, 4) * 1.0
        + smooth_noise(rng, w, h, 12, 12) * 0.6
        + smooth_noise(rng, w, h, 45, 45) * 0.3
    )
    m += rng.normal(0, 0.06, (h, w))
    darkp = np.clip(-m * 1.6, 0, 1)
    lightp = np.clip(m * 1.4 - 0.15, 0, 1)
    rgba = np.zeros((h, w, 4), np.float32)
    rgba[..., :3] = np.where((darkp > lightp)[..., None], [[[48, 4, 4]]], [[[176, 70, 60]]])
    rgba[..., 3] = np.maximum(darkp * 0.55, lightp * 0.35) * 255
    return Image.fromarray(rgba.astype(np.uint8), "RGBA")


def make_textures():
    aged_paper(700, 650, seed=11, fade=("l", "b", "r")).save(ASSETS / "aged-patch.png", optimize=True)
    aged_paper(240, 1500, seed=12, fade=("r", "t")).save(ASSETS / "aged-strip.png", optimize=True)
    aged_paper(500, 1250, seed=13, opaque=True).save(ASSETS / "aged-card.jpg", quality=85)
    red_grunge().save(ASSETS / "red-grunge.png", optimize=True)


if __name__ == "__main__":
    make_parchment()
    make_cathedral()
    make_manuscript()
    make_textures()
