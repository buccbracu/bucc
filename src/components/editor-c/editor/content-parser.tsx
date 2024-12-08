import Image from "next/image";
import React from "react";

export default function ContentParser({ content }: { content: any }) {
  // Debugging Content
  console.log("Content to Render:", content);

  if (!content || !Array.isArray(content)) {
    return <div>No content available</div>;
  }

  const renderNode = (node: any, index?: number): React.ReactNode => {
    if (!node || !node.type) return null;

    switch (node.type) {
      case "doc":
        return (
          <div key={index} className="text-justify">
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </div>
        );
      case "paragraph":
        return (
          <p key={index} className="text-justify">
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </p>
        );
      case "text":
        return node.marks
          ? renderTextWithMarks(node.text, node.marks)
          : node.text;
      case "image":
        return (
          <div
            key={index}
            className="relative mx-auto mb-4 h-auto w-full max-w-[600px]"
          >
            <Image
              src={node.attrs?.src}
              alt={node.attrs?.alt || "Image"}
              width={600}
              height={400}
              className="rounded-md object-contain"
            />
          </div>
        );
      case "heading":
        const HeadingTag =
          `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            className={`mb-2 mt-4 text-justify font-bold ${
              node.attrs?.level === 1
                ? "text-2xl"
                : node.attrs?.level === 2
                  ? "text-xl"
                  : "text-lg"
            }`}
          >
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </HeadingTag>
        );
      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-400 pl-4 text-justify italic"
          >
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </blockquote>
        );
      case "bulletList":
        return (
          <ul key={index} className="list-disc pl-5">
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </ul>
        );
      case "orderedList":
        return (
          <ol key={index} className="list-decimal pl-5">
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </ol>
        );
      case "listItem":
        return (
          <li key={index}>
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </li>
        );
      case "codeBlock":
        return (
          <pre
            key={index}
            className="overflow-x-auto rounded bg-gray-100 p-2 text-gray-800"
          >
            <code>
              {node.content?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </code>
          </pre>
        );
      case "youtube":
        const videoIdMatch = node.attrs?.src.match(
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        );
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
          return (
            <iframe
              key={index}
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mx-auto my-4"
            ></iframe>
          );
        } else {
          return <p key={index}>Invalid YouTube URL</p>;
        }
      case "taskList":
        return (
          <ul key={index} className="list-none pl-0">
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </ul>
        );
      case "taskItem":
        return (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={node.attrs?.checked}
              readOnly
              className="mr-2"
            />
            {node.content?.map((child: any, childIndex: number) =>
              renderNode(child, childIndex),
            )}
          </li>
        );
      default:
        console.warn("Unknown node type:", node.type);
        return null;
    }
  };

  const renderTextWithMarks = (text: string, marks: any[]): React.ReactNode => {
    return marks.reduce((acc: React.ReactNode, mark: any) => {
      if (mark.type === "bold") {
        return <strong key={mark.attrs?.id}>{acc}</strong>;
      } else if (mark.type === "italic") {
        return <em key={mark.attrs?.id}>{acc}</em>;
      } else if (mark.type === "link") {
        return (
          <a
            key={mark.attrs?.id}
            href={mark.attrs.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {acc}
          </a>
        );
      }
      return acc;
    }, text);
  };

  return (
    <div>
      {content.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
}
