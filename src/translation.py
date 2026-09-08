"""
translation.py
Detects Myanmar (Burmese) script in text and translates it to English.

Primary:  MyMemoryTranslator via deep-translator (5s thread timeout)
Fallback: GoogleTranslator via deep-translator (5s thread timeout)

Myanmar Unicode range: U+1000-U+109F
"""

import re
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

from deep_translator import GoogleTranslator, MyMemoryTranslator  # noqa: E402

logger = logging.getLogger(__name__)

# Myanmar Unicode block: U+1000 – U+109F
_MYANMAR_RE = re.compile(r"[\u1000-\u109F]")

# Minimum fraction of Myanmar characters to trigger translation
_MYANMAR_THRESHOLD = 0.15

# Hard wall-clock timeout (seconds) per translator attempt
_TRANSLATE_TIMEOUT = 5

# In-memory translation cache — avoids repeated network calls for the same text
_cache: dict[str, str] = {}


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


def _google_translate(text: str) -> str | None:
    """
    Translate Myanmar text to English via GoogleTranslator (deep-translator).
    Capped at _TRANSLATE_TIMEOUT seconds via a thread.
    Returns translated string or None on any failure.
    """
    try:
        translated = _call_with_timeout(
            lambda: GoogleTranslator(source="my", target="en").translate(text),
            timeout=_TRANSLATE_TIMEOUT,
        )
        if translated and translated.strip():
            return translated.strip()
        logger.warning("GoogleTranslator returned empty result.")
    except FuturesTimeoutError:
        logger.warning("GoogleTranslator timed out after %ss.", _TRANSLATE_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        logger.warning("GoogleTranslator failed: %s", exc)
    return None


def _mymemory_translate(text: str) -> str | None:
    """
    Translate Myanmar text to English via MyMemoryTranslator (deep-translator).
    Capped at _TRANSLATE_TIMEOUT seconds via a thread.
    Returns translated string or None on any failure.
    """
    try:
        translated = _call_with_timeout(
            lambda: MyMemoryTranslator(source="my-MM", target="en-US").translate(text),
            timeout=_TRANSLATE_TIMEOUT,
        )
        if translated and translated.strip() and not translated.startswith("'"):
            return translated.strip()
        logger.warning("MyMemory returned empty or invalid result.")
    except FuturesTimeoutError:
        logger.warning("MyMemoryTranslator timed out after %ss.", _TRANSLATE_TIMEOUT)
    except Exception as exc:  # noqa: BLE001
        logger.warning("MyMemory failed: %s", exc)
    return None


def translate_to_english(text: str) -> tuple[str, bool]:
    """
    Translate *text* to English if it is detected as Myanmar.

    Cache hit  → returns immediately, no network call.
    Primary:    MyMemoryTranslator via deep-translator (5s thread timeout)
    Fallback:   GoogleTranslator via deep-translator (5s thread timeout)

    Returns:
        (translated_text, was_translated)

    If the text is not Myanmar, or if all translators fail, the
    original text is returned unchanged and was_translated=False.
    """
    if not is_myanmar(text):
        return text, False

    # ── Cache check ───────────────────────────────────────────────
    if text in _cache:
        logger.debug("Translation cache hit.")
        return _cache[text], True

    # ── Primary: MyMemory ─────────────────────────────────────────
    translated = _mymemory_translate(text)
    if translated:
        logger.info("Myanmar→English (MyMemory): %r → %r", text[:80], translated[:80])
        _cache[text] = translated
        return translated, True

    logger.warning("MyMemory failed. Trying Google fallback.")

    # ── Fallback: GoogleTranslator ────────────────────────────────
    translated = _google_translate(text)
    if translated:
        logger.info("Myanmar→English (Google): %r → %r", text[:80], translated[:80])
        _cache[text] = translated
        return translated, True

    logger.error("All translators failed. Using original text.")
    return text, False

