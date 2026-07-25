# Test fixtures

`sample.png` is an 8×8 solid-color image generated in-repo with Pillow (no third-party
image, no personal data). It carries no third-party copyright and is safe to ship in
this open-source repo. It is used purely as a small, real binary file to exercise the
File-mode encode→decode round trip (base64 of arbitrary binary data, not text).
Regenerate with:

```python
from PIL import Image
Image.new("RGB", (8, 8), (255, 128, 0)).save("sample.png", "PNG")
```
