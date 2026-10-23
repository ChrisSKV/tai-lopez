# Usage: pip install "rembg[cpu]" pillow ; python tools/cutout.py birefnet-portrait <srcDir> <outDir>
# Cuts out every .png in srcDir (transparent background) with the BiRefNet portrait model.
import sys, os
from rembg import remove, new_session
from PIL import Image
model=sys.argv[1]; src=sys.argv[2]; out=sys.argv[3]
os.makedirs(out,exist_ok=True)
sess=new_session(model)
for f in sorted(os.listdir(src)):
    if not f.endswith('.png'): continue
    im=Image.open(os.path.join(src,f)).convert('RGB')
    res=remove(im,session=sess,alpha_matting=False)
    res.save(os.path.join(out,f))
    print(model,f,res.size)
