"""Compose a concave "wall of screens" scene image from flat screenshots.

Usage: python tools/compose_wall.py <panelsDir> <out.jpg> [--w 2400 --h 960 --cols 7 --rows 3]
Panels (PNG/JPG, ideally 16:10) are placed row by row on the inside of a cylinder around the
camera, projected with true perspective, then the result is darkened, vignetted and faded to
black at the bottom so a cutout of a person can stand in front of it.
Requires: pip install opencv-python-headless numpy pillow
"""
import sys, os, math, argparse
import numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('panels'); ap.add_argument('out')
ap.add_argument('--w', type=int, default=2400); ap.add_argument('--h', type=int, default=960)
ap.add_argument('--cols', type=int, default=9); ap.add_argument('--rows', type=int, default=3)
ap.add_argument('--fov', type=float, default=165, help='horizontal span of the wall in degrees')
ap.add_argument('--gap', type=float, default=0.035, help='gap between panels, fraction of a panel')
ap.add_argument('--dim', type=float, default=0.62); ap.add_argument('--seed', type=int, default=0)
a = ap.parse_args()

files = sorted(f for f in os.listdir(a.panels) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')))
assert files, 'no panels found'
W, H = a.w, a.h
canvas = np.zeros((H, W, 3), np.float32); canvas[:] = (13, 11, 11)
f = W * 0.42                      # focal length in px
cx, cy = W / 2, H * 0.36           # horizon a bit above center
Rr = 1.0                           # cylinder radius
span = math.radians(a.fov)
dphi = span / a.cols
pw = 2 * Rr * math.sin(dphi / 2)   # chord width of one panel
ph = pw / 1.6                      # 16:10 panels
row_pitch = ph * (1 + a.gap * 1.6)
y_rows = [(r - (a.rows - 1) / 2) * row_pitch - 0.10 for r in range(a.rows)]
k = 0
for r, yc in enumerate(y_rows):
    offset = (dphi / 2) if r % 2 else 0   # brick offset on alternate rows
    for c in range(-1, a.cols + 1):
        phi0 = -span / 2 + c * dphi + offset + dphi * a.gap / 2
        phi1 = phi0 + dphi * (1 - a.gap)
        if phi1 < -math.radians(88) or phi0 > math.radians(88):
            continue
        y0, y1 = yc - ph / 2, yc + ph / 2
        pts3 = [(phi0, y0), (phi1, y0), (phi1, y1), (phi0, y1)]
        quad = []
        for phi, y in pts3:
            X, Z = Rr * math.sin(phi), Rr * math.cos(phi)
            Z = max(Z, 0.12)
            quad.append((cx + f * X / Z, cy + f * y / Z))
        quad = np.float32(quad)
        img = cv2.imread(os.path.join(a.panels, files[k % len(files)]), cv2.IMREAD_COLOR).astype(np.float32)
        k += 1
        hh, ww = img.shape[:2]
        src = np.float32([[0, 0], [ww, 0], [ww, hh], [0, hh]])
        M = cv2.getPerspectiveTransform(src, quad)
        warped = cv2.warpPerspective(img, M, (W, H), flags=cv2.INTER_AREA)
        mask = cv2.warpPerspective(np.ones((hh, ww), np.float32), M, (W, H), flags=cv2.INTER_LINEAR)
        # panels further to the sides are darker
        side = abs((phi0 + phi1) / 2) / (span / 2)
        shade = 1.0 - 0.45 * min(side, 1) ** 1.6
        canvas = canvas * (1 - mask[..., None]) + warped * mask[..., None] * shade

# grade: dim, slight desaturation, vignette, fade to black at the bottom
img = canvas * a.dim
gray = img.mean(axis=2, keepdims=True)
img = gray * 0.18 + img * 0.82
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vx = (xx - W / 2) / (W / 2)
vig = np.clip(1 - 0.55 * np.abs(vx) ** 2.2, 0, 1)
bottom = np.clip(1 - ((yy / H) - 0.58) / 0.42, 0, 1) ** 1.4
top = np.clip((yy / H) / 0.10, 0, 1) ** 0.8
img = img * (vig * bottom * top)[..., None]
# soft blur toward the far left/right edges
blur = cv2.GaussianBlur(img, (0, 0), 3.2)
wb = np.clip((np.abs(vx) - 0.55) / 0.4, 0, 1)[..., None]
img = img * (1 - wb) + blur * wb
cv2.imwrite(a.out, np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 86, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
print('wrote', a.out, W, H, 'panels used', k)
