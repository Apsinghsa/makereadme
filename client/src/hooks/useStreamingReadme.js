import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL, GENERATION_STEPS } from '../lib/constants';
import { createStreamParser } from '../lib/streamParser';

const initialSteps = () =>
  GENERATION_STEPS.map((s) => ({ ...s, state: 'pending' }));

export function useStreamingReadme() {
  const [markdown, setMarkdown] = useState('');
  const [steps, setSteps] = useState(initialSteps);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const markStep = useCallback((id, state) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      return prev.map((s, i) => {
        if (i < idx) return { ...s, state: 'done' };
        if (i === idx) return { ...s, state };
        return { ...s, state: 'pending' };
      });
    });
  }, []);

  const markError = useCallback(() => {
    setSteps((prev) => {
      if (prev.some((s) => s.state === 'error')) return prev;
      const hasActive = prev.some((s) => s.state === 'active');
      return prev.map((s, i) =>
        (hasActive ? s.state === 'active' : i === 0)
          ? { ...s, state: 'error' }
          : s
      );
    });
  }, []);

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
    setSteps(initialSteps());

    try {
      const sectionsParam = sections.join(',');
      const response = await fetch(
        `${API_BASE_URL}/api/generate?url=${encodeURIComponent(url)}&size=${encodeURIComponent(size)}&sections=${encodeURIComponent(sectionsParam)}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        let message = `Server error: ${response.status}`;
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          // non-JSON error body, keep the generic message
        }
        throw new Error(message);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamError = null;

      const parser = createStreamParser({
        onStatus: (event) => {
          markStep(event.step, 'active');
          if (event.message) {
            setSteps((prev) =>
              prev.map((s) =>
                s.id === event.step ? { ...s, label: event.message } : s
              )
            );
          }
        },
        onContent: setMarkdown,
        onError: (event) => {
          streamError = event.message || 'Something went wrong.';
          setError(streamError);
          markError();
        },
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.push(decoder.decode(value, { stream: true }));
      }

      parser.push(decoder.decode());
      parser.flush();

      if (streamError) {
        markError();
        return;
      }

      setIsGenerated(true);
      setSteps((prev) => prev.map((s) => ({ ...s, state: 'done' })));
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to generate README. Check the URL and try again.');
      markError();
    } finally {
      setIsGenerating(false);
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, [markStep, markError]);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setMarkdown('');
    setSteps(initialSteps());
    setIsGenerating(false);
    setIsGenerated(false);
    setError(null);
  }, []);

  return { markdown, setMarkdown, steps, isGenerating, isGenerated, error, startGeneration, reset };
}
