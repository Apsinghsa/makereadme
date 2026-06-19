import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function MarkdownPreview({ content }) {
  return (
    <div className="preview">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
