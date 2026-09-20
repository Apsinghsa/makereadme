const SENTINEL = '\u001e';

/**
 * Parses the generation stream, which interleaves README text with sentinel-prefixed
 * JSON lines. Content is accumulated and handed to onContent; status events go to
 * onStatus; failure events go to onError. Safe across arbitrary chunk boundaries.
 */
export function createStreamParser({ onStatus, onContent, onError }) {
  let accumulated = '';
  let buffer = '';

  const handleLine = (raw) => {
    if (raw[0] === SENTINEL) {
      try {
        const event = JSON.parse(raw.slice(1));
        if (event.type === 'status') onStatus(event);
        else if (event.type === 'error') onError?.(event);
      } catch {
        // ignore malformed status lines
      }
    } else {
      accumulated += raw + '\n';
      onContent(accumulated);
    }
  };

  return {
    push(chunk) {
      buffer += chunk;
      let nl;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        handleLine(buffer.slice(0, nl));
        buffer = buffer.slice(nl + 1);
      }
      // Flush partial content, but keep an unfinished sentinel line buffered.
      if (buffer && buffer[0] !== SENTINEL) {
        accumulated += buffer;
        buffer = '';
        onContent(accumulated);
      }
    },
    flush() {
      if (buffer) {
        handleLine(buffer);
        buffer = '';
      }
      onContent(accumulated);
    },
  };
}
