import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../lib/constants';

export function useStreamingReadme() {
  const [markdown, setMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const startGeneration = useCallback(async (url, size, sections) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setIsGenerated(false);
    setError(null);
    setMarkdown('');

    try {
      const sectionsParam = sections.join(',');
      const response = await fetch(
        `${API_BASE_URL}/api/generate?url=${encodeURIComponent(url)}&size=${encodeURIComponent(size)}&sections=${encodeURIComponent(sectionsParam)}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMarkdown(accumulated);
      }

      setIsGenerated(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to generate README. Check the URL and try again.');
    } finally {
      setIsGenerating(false);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setMarkdown('');
    setIsGenerating(false);
    setIsGenerated(false);
    setError(null);
  }, []);

  return { markdown, setMarkdown, isGenerating, isGenerated, error, startGeneration, reset };
}
