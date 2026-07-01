"""
Извлекает 100 JPEG-кадров из hero.mp4 в images/hero/frames/
10 fps, JPEG quality 65, resize до ширины 1280px (оригинал)
"""
import cv2, pathlib, shutil, tempfile

SRC        = r'C:\Users\USERR\Desktop\Маникюр\images\hero\hero.mp4'
DEST       = pathlib.Path(r'C:\Users\USERR\Desktop\Маникюр\images\hero\frames')
TARGET_FPS = 10
QUALITY    = 65

tmp_dir = pathlib.Path(tempfile.mkdtemp())
tmp_vid = tmp_dir / 'hero.mp4'
shutil.copy2(SRC, tmp_vid)

cap     = cv2.VideoCapture(str(tmp_vid))
src_fps = cap.get(cv2.CAP_PROP_FPS)
total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f'Video: fps={src_fps}  frames={total_f}  duration={total_f/src_fps:.1f}s')

out_tmp = tmp_dir / 'frames'
out_tmp.mkdir()

step   = src_fps / TARGET_FPS
wanted = []
t = 0.0
while t < total_f:
    wanted.append(round(t))
    t += step

idx = 0
for fi in wanted:
    cap.set(cv2.CAP_PROP_POS_FRAMES, fi)
    ok, frame = cap.read()
    if not ok:
        continue
    path = out_tmp / f'{idx:04d}.jpg'
    cv2.imwrite(str(path), frame, [cv2.IMWRITE_JPEG_QUALITY, QUALITY])
    idx += 1

cap.release()
print(f'Extracted {idx} frames')

DEST.mkdir(parents=True, exist_ok=True)
# Удаляем старые кадры
for old in DEST.glob('*.jpg'):
    old.unlink()

for f in sorted(out_tmp.glob('*.jpg')):
    shutil.copy2(f, DEST / f.name)

count    = len(list(DEST.glob('*.jpg')))
total_kb = sum(f.stat().st_size for f in DEST.glob('*.jpg')) // 1024
print(f'Done: {count} frames, {total_kb} KB total (~{total_kb/1024:.1f} MB)')

shutil.rmtree(tmp_dir)
