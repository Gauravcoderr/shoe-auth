import ctypes
import io
import platform
from typing import Optional

# On Apple Silicon macOS, ctypes.util.find_library('zbar') doesn't search
# /opt/homebrew/lib. Pre-load the dylib from the known Homebrew path so
# pyzbar can find it at import time. Safe to call multiple times.
def _preload_zbar_macos() -> None:
    if platform.system() != "Darwin":
        return
    for candidate in (
        "/opt/homebrew/lib/libzbar.dylib",
        "/opt/homebrew/lib/libzbar.0.dylib",
        "/usr/local/lib/libzbar.dylib",
    ):
        try:
            ctypes.cdll.LoadLibrary(candidate)
            return
        except OSError:
            continue


def decode_barcode(image_bytes: bytes) -> Optional[str]:
    """
    Attempt to decode the first barcode or QR code found in the given image.

    Returns the decoded string (e.g. UPC-A digits), or None if no barcode found
    or if pyzbar / Pillow are not installed.

    Usage: pass the raw bytes of the box-label photo.
    The decoded value is forwarded to the AI prompt so it can validate the
    barcode against the brand's expected serial_format.
    """
    _preload_zbar_macos()

    try:
        from pyzbar.pyzbar import decode as zbar_decode  # pip install pyzbar
        from PIL import Image  # pip install pillow
    except (ImportError, OSError):
        return None

    try:
        img = Image.open(io.BytesIO(image_bytes))
        results = zbar_decode(img)
        if results:
            return results[0].data.decode("utf-8", errors="replace").strip()
    except Exception:
        pass

    return None
