"""
translation.py
Detects Myanmar (Burmese) script in text and translates it to English.

Primary:  Google Translate gtx endpoint (unofficial, ~0.2s, no key needed,
          explicit requests timeout so it never hangs)
Fallback: MyMemoryTranslator via deep-translator (5s thread timeout)

Myanmar Unicode range: U+1000–U+109F
"""

import re
import logging
import requests
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

from deep_translator import MyMemoryTranslator  # noqa: E402

logger = logging.getLogger(__name__)

# Myanmar Unicode block: U+1000 – U+109F
_MYANMAR_RE = re.compile(r"[\u1000-\u109F]")

# Minimum fraction of Myanmar characters to trigger translation
_MYANMAR_THRESHOLD = 0.15

# Hard wall-clock timeout (seconds) per translator attempt
_TRANSLATE_TIMEOUT = 5

# Google Translate gtx endpoint — fast, no API key required
_GOOGLE_GTX_URL = "https://translate.googleapis.com/translate_a/single"
_GOOGLE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def _call_with_timeout(fn, timeout: float):
    """
    Run *fn()* in a thread and return its result within *timeout* seconds.
    Raises FuturesTimeoutError if it takes too long.
    """
    with ThreadPoolExecutor(max_workers=1) as ex:
        future = ex.submit(fn)
        return future.result(timeout=timeout)


def is_myanmar(text: str) -> bool:
    """
    Return True if the text contains a significant proportion of
    Myanmar Unicode characters (above _MYANMAR_THRESHOLD).

    Uses character-count ratio so short mixed strings are handled
    gracefully.
    """
    if not text or not text.strip():
        return False

    total_chars = sum(1 for c in text if not c.isspace())
    if total_chars == 0:
        return False

    myanmar_count = len(_MYANMAR_RE.findall(text))
    return (myanmar_count / total_chars) >= _MYANMAR_THRESHOLD


def _google_gtx_translate(text: str) -> str | None:
    """
    Translate Myanmar text to English via the Google gtx endpoint.
    Uses an explicit requests timeout — never hangs.
    Returns translated string or None on any failure.
    """
    try:
        params = {"client": "gtx", "sl": "my", "tl": "en", "dt": "t", "q": text}
        r = requests.get(
            _GOOGLE_GTX_URL,
            params=params,
            headers=_GOOGLE_HEADERS,
            timeout=_TRANSLATE_TIMEOUT,
        )
        if r.status_code == 200:
            data = r.json()
            translated = "".join(seg[0] for seg in data[0] if seg and seg[0])
            return translated.strip() or None
        logger.warning("Google GTX returned status %s", r.status_code)
    except requests.exceptions.Timeout:
        logger.warning("Google GTX timed out after %ss.", _TRANSLATE_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Google GTX failed: %s", exc)
    return None


def translate_to_english(text: str) -> tuple[str, bool]:
    """
    Translate *text* to English if it is detected as Myanmar.

    Primary:  Google GTX endpoint (~0.2s, explicit requests timeout)
    Fallback: MyMemoryTranslator via deep-translator (5s thread timeout)

    Returns:
        (translated_text, was_translated)

    If the text is not Myanmar, or if all translators fail, the
    original text is returned unchanged and was_translated=False.
    """
    if not is_myanmar(text):
        return text, False

    # ── Primary: Google GTX (fast, explicit timeout) ─────────────
    translated = _google_gtx_translate(text)
    if translated:
        logger.info("Myanmar→English (Google GTX): %r → %r", text[:80], translated[:80])
        return translated, True

    logger.warning("Google GTX failed. Trying MyMemory fallback.")

    # ── Fallback: MyMemory (thread-capped at 5s) ─────────────────
    try:
        translated = _call_with_timeout(
            lambda: MyMemoryTranslator(source="my-MM", target="en-US").translate(text),
            timeout=_TRANSLATE_TIMEOUT,
        )
        if translated and translated.strip() and not translated.startswith("'"):
            logger.info("Myanmar→English (MyMemory): %r → %r", text[:80], translated[:80])
            return translated, True

    except FuturesTimeoutError:
        logger.warning("MyMemoryTranslator timed out after %ss. Using original text.", _TRANSLATE_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        logger.error("All translators failed (%s). Using original text.", exc)

    return text, False
