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
        return <div key={index}>{node.content?.map(renderNode)}</div>; // Wrap with div for semantic meaning
      case "paragraph":
        return <p key={index}>{node.content?.map(renderNode)}</p>;
      case "text":
        return node.marks ? (
          renderTextWithMarks(node.text, node.marks)
        ) : (
          <span key={index}>{node.text}</span>
        );
      case "image":
        return (
          <Image
            key={index}
            src={node.attrs?.src}
            alt={node.attrs?.alt || ""}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );
      case "heading":
        const HeadingTag =
          `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index}>{node.content?.map(renderNode)}</HeadingTag>
        );
      case "blockquote":
        return (
          <blockquote key={index}>{node.content?.map(renderNode)}</blockquote>
        );
      case "youtube":
        const videoUrl = node.attrs?.src;
        const videoIdMatch = videoUrl.match(
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        );
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
          return (
            <iframe
              key={index}
              width={node.attrs?.width || "560"}
              height={node.attrs?.height || "315"}
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          );
        } else {
          return <p key={index}>Invalid YouTube URL</p>;
        }
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
