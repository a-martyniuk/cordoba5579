import os
from PIL import Image

def test():
    img = Image.new("RGB", (100, 100), "white")
    try:
        img.save("scratch/test.pdf", "PDF", resolution=300.0)
        print("Success resolution")
    except Exception as e:
        print("Failed resolution:", e)

    try:
        img.save("scratch/test2.pdf", "PDF", dpi=(300, 300))
        print("Success dpi")
    except Exception as e:
        print("Failed dpi:", e)

if __name__ == "__main__":
    test()
