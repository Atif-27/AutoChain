// components/MdPage.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MdPageProps {
  markdown: string;
}

export default function MdPage({ markdown }: MdPageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-lg leading-relaxed mb-4">{children}</p>
        ),
        li: ({ children }) => (
          <li className="list-disc ml-6 text-base">{children}</li>
        ),
        h4: ({ children }) => (
          <h4 className="text-2xl font-bold text-red-500 mt-6 mb-2">
            {children}
          </h4>
        ),
        hr: () => (
          <hr className="w-1/3 h-1 my-8 mx-auto bg-gray-300 border-0 rounded" />
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={a11yDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-800 text-pink-300 px-2 py-1 rounded text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
