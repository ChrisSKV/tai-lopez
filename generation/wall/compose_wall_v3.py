"""Concave "wall of screens" composer (v3, derived from tools/compose_wall.py).

Differences from the original:
- camera sits BEHIND the cylinder axis (--back) with a slight downward pitch (--pitch), so panels keep
  an even size across the curve (like the reference) instead of ballooning at the sides;
- columns are aligned (no brick offset unless --brick 1), center column at 0 deg;
- explicit placement via --layout (lines "row col name"), remaining slots auto-filled far from repeats;
- supersampled rendering + per-panel area pre-resize, so on-screen text stays crisp;
- grade tuned to the reference: bright center, darker sides, soft top, long fade to the page black.
"""
import os, math, argparse
import numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('panels'); ap.add_argument('out')
ap.add_argument('--w', type=int, default=2400); ap.add_argument('--h', type=int, default=960)
ap.add_argument('--pw', type=float, default=0.18, help='center panel width, fraction of W')
ap.add_argument('--dphi', type=float, default=20, help='degrees per column')
ap.add_argument('--back', type=float, default=1.5, help='camera distance behind the cylinder axis (radii)')
ap.add_argument('--pitch', type=float, default=5, help='camera pitch down, degrees')
ap.add_argument('--eye', type=float, default=1.0, help='camera height, in row index units')
ap.add_argument('--rows', type=str, default='-1,0,1,2,3', help='row indices to build')
ap.add_argument('--top', type=float, default=0.02, help='y (fraction of H) of the top edge of row 0 at the center')
ap.add_argument('--cx', type=float, default=0.5)
ap.add_argument('--gap', type=float, default=0.03, help='gap, fraction of panel width')
ap.add_argument('--brick', type=int, default=0)
ap.add_argument('--radius', type=float, default=0.012, help='corner radius, fraction of panel width')
ap.add_argument('--layout', type=str, default='')
ap.add_argument('--ss', type=int, default=2)
ap.add_argument('--dim', type=float, default=0.9); ap.add_argument('--desat', type=float, default=0.08)
ap.add_argument('--side', type=float, default=0.75); ap.add_argument('--sidepow', type=float, default=1.6)
ap.add_argument('--fade0', type=float, default=0.47); ap.add_argument('--fade1', type=float, default=0.8)
ap.add_argument('--fadepow', type=float, default=1.6)
ap.add_argument('--topfade', type=float, default=0.07); ap.add_argument('--topdark', type=float, default=0.35)
ap.add_argument('--edge', type=float, default=0.03)
ap.add_argument('--blur', type=float, default=2.5); ap.add_argument('--blurstart', type=float, default=0.6)
ap.add_argument('--bg', type=str, default='10,10,11', help='page background RGB')
ap.add_argument('--gapcol', type=str, default='16,16,18')
ap.add_argument('--quality', type=int, default=84)
ap.add_argument('--debug', action='store_true')
a = ap.parse_args()

files = sorted(f for f in os.listdir(a.panels) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')))
names = [os.path.splitext(f)[0] for f in files]
assert files, 'no panels found'
src_cache = {}
def src(name):
    if name not in src_cache:
        src_cache[name] = cv2.imread(os.path.join(a.panels, files[names.index(name)]), cv2.IMREAD_COLOR)
    return src_cache[name]

SS = a.ss
W, H = a.w * SS, a.h * SS
rgb = lambda s: tuple(int(v) for v in s.split(','))
bg = np.array(rgb(a.bg)[::-1], np.float32); gapc = np.array(rgb(a.gapcol)[::-1], np.float32)
canvas = np.zeros((H, W, 3), np.float32); canvas[:] = gapc

# ---- geometry (world: x right, y down, z forward; cylinder radius 1 around the y axis)
dphi = math.radians(a.dphi)
pw_w = 2 * math.sin(dphi * (1 - a.gap) / 2)          # panel chord width
ph_w = pw_w / 1.6
gap_w = 2 * math.sin(dphi / 2) - pw_w
pitch_w = ph_w + gap_w                                 # row pitch
p = math.radians(a.pitch)
fwd = np.array([0, math.sin(p), math.cos(p)]); down = np.array([0, math.cos(p), -math.sin(p)])
cam = np.array([0.0, a.eye * pitch_w, -a.back])

def proj(P, F=1.0):
    v = np.asarray(P, float) - cam
    zc = v @ fwd
    return np.array([F * v[0] / zc, F * (v @ down) / zc]), zc

def corners(r, c):
    off = (dphi / 2) if (a.brick and r % 2) else 0
    ph0 = c * dphi + off - dphi * (1 - a.gap) / 2
    ph1 = ph0 + dphi * (1 - a.gap)
    y0 = r * pitch_w - ph_w / 2; y1 = y0 + ph_w
    return [(math.sin(ph0), y0, math.cos(ph0)), (math.sin(ph1), y0, math.cos(ph1)),
            (math.sin(ph1), y1, math.cos(ph1)), (math.sin(ph0), y1, math.cos(ph0))], (ph0 + ph1) / 2

# focal so that the eye-row center panel has width pw*W
eye_r = round(a.eye)
cs, _ = corners(eye_r, 0)
wid = proj(cs[1])[0][0] - proj(cs[0])[0][0]
F = a.pw * W / wid
cs0, _ = corners(0, 0)
top_y = proj(cs0[0], F)[0][1]
X0 = a.cx * W
Y0 = a.top * H - top_y

rows = [int(v) for v in a.rows.split(',')]
slots = {}
for r in rows:
    for c in range(-8, 9):
        cs, mid = corners(r, c)
        if abs(mid) > math.radians(100):
            continue
        q, ok = [], True
        for P in cs:
            uv, zc = proj(P, F)
            if zc < 0.05: ok = False; break
            q.append((X0 + uv[0], Y0 + uv[1]))
        if not ok: continue
        q = np.float32(q)
        if q[:, 0].max() < 0 or q[:, 0].min() > W or q[:, 1].max() < 0 or q[:, 1].min() > a.fade1 * H:
            continue
        slots[(r, c)] = (q, mid)

# ---- placement
assign = {}
if a.layout:
    for line in open(a.layout):
        line = line.split('#')[0].strip()
        if not line: continue
        r, c, n = line.split()
        if (int(r), int(c)) in slots:
            assert n in names, n
            assign[(int(r), int(c))] = n
eye_row = a.eye
def prio(s):
    r, c = s
    return abs(c) * 1.0 + abs(r - eye_row + 0.4) * 1.3
for s in sorted(slots, key=prio):
    if s in assign: continue
    best = None
    for n in names:
        used = [k for k, v in assign.items() if v == n]
        dmin = min([math.hypot((k[0] - s[0]) * 1.2, k[1] - s[1]) for k in used], default=99)
        neigh = any(assign.get((s[0] + dr, s[1] + dc)) == n for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)))
        score = (0 if neigh else 1, -len(used), dmin)
        if best is None or score > best[0]: best = (score, n)
    assign[s] = best[1]

# ---- render panels
def rounded_mask(w, h, rad):
    m = np.zeros((h, w), np.uint8)
    rad = max(1, int(rad))
    cv2.rectangle(m, (rad, 0), (w - 1 - rad, h - 1), 255, -1); cv2.rectangle(m, (0, rad), (w - 1, h - 1 - rad), 255, -1)
    for cx_, cy_ in ((rad, rad), (w - 1 - rad, rad), (rad, h - 1 - rad), (w - 1 - rad, h - 1 - rad)):
        cv2.circle(m, (cx_, cy_), rad, 255, -1, lineType=cv2.LINE_AA)
    return m.astype(np.float32) / 255

for (r, c), (q, mid) in sorted(slots.items(), key=lambda kv: -abs(kv[1][1])):
    img = src(assign[(r, c)])
    tw = int(max(np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3])) * 1.15)
    th = int(max(np.linalg.norm(q[3] - q[0]), np.linalg.norm(q[2] - q[1])) * 1.15)
    if tw < img.shape[1]:
        img = cv2.resize(img, (max(tw, 8), max(int(tw / 1.6), 5)), interpolation=cv2.INTER_AREA)
    hh, ww = img.shape[:2]
    x0, y0 = max(int(math.floor(q[:, 0].min())) - 2, 0), max(int(math.floor(q[:, 1].min())) - 2, 0)
    x1, y1 = min(int(math.ceil(q[:, 0].max())) + 2, W), min(int(math.ceil(q[:, 1].max())) + 2, H)
    if x1 <= x0 or y1 <= y0: continue
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [ww, 0], [ww, hh], [0, hh]]), q - np.float32([x0, y0]))
    warped = cv2.warpPerspective(img.astype(np.float32), M, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    m = cv2.warpPerspective(rounded_mask(ww, hh, a.radius * ww), M, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR)[..., None]
    shade = 1.0 - 0.18 * min(abs(mid) / math.radians(70), 1) ** 1.5      # panels turned away get a bit less light
    reg = canvas[y0:y1, x0:x1]
    canvas[y0:y1, x0:x1] = reg * (1 - m) + warped * shade * m

img = cv2.resize(canvas, (a.w, a.h), interpolation=cv2.INTER_AREA) if SS > 1 else canvas
W, H = a.w, a.h

# ---- grade
gray = img.mean(axis=2, keepdims=True)
img = (gray * a.desat + img * (1 - a.desat)) * a.dim
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vx = (xx - a.cx * W) / (W / 2)
sm = lambda e0, e1, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - e0) / (e1 - e0), 0, 1))
vig = np.clip(1 - a.side * np.abs(vx) ** a.sidepow, 0, 1)
bottom = sm(a.fade1, a.fade0, yy / H) ** a.fadepow
top = 1 - a.topdark * (1 - sm(0, a.topfade, yy / H))
edge = sm(0, a.edge, np.minimum(xx, W - 1 - xx) / W) if a.edge > 0 else 1
mask = (vig * bottom * top * edge)[..., None]
# soft focus toward the far sides
if a.blur > 0:
    blur = cv2.GaussianBlur(img, (0, 0), a.blur)
    wb = np.clip((np.abs(vx) - a.blurstart) / 0.35, 0, 1)[..., None]
    img = img * (1 - wb) + blur * wb
img = img * mask + bg * (1 - mask)
out = np.clip(img + np.random.default_rng(0).normal(0, 0.6, img.shape), 0, 255).astype(np.uint8)   # tiny grain vs banding
cv2.imwrite(a.out, out, [cv2.IMWRITE_JPEG_QUALITY, a.quality, cv2.IMWRITE_JPEG_PROGRESSIVE, 1, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
print('wrote', a.out, W, H, 'slots', len(slots), os.path.getsize(a.out) // 1024, 'KB')
if a.debug:
    for (r, c) in sorted(slots): print(r, c, assign[(r, c)])
