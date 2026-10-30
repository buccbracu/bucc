import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = (size = 21) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < size; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return id;
};

/**
 * Safely extracts human-readable text from comments, whether stored as:
 * - Plain text string
 * - Stringified JSON
 * - BlockNote block array ([ { id, type, content: [ { type: "text", text: "..." } ] } ])
 * - An object containing text or content properties
 */
export function formatCommentText(val: any): string {
  if (val === undefined || val === null) return "(empty)";

  // If string, check if it's a JSON string
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed || trimmed === "[]" || trimmed === "{}") return "(empty)";
    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return formatCommentText(parsed);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }

  // If array (BlockNote blocks, or array of strings, or array of objects)
  if (Array.isArray(val)) {
    if (val.length === 0) return "(empty)";

    const lines: string[] = [];
    for (const item of val) {
      if (!item) continue;
      if (typeof item === "string") {
        if (item.trim()) lines.push(item.trim());
        continue;
      }
      if (typeof item === "object") {
        // BlockNote block
        if (item.content !== undefined) {
          if (Array.isArray(item.content)) {
            const inlineParts: string[] = [];
            for (const inline of item.content) {
              if (typeof inline === "string") {
                inlineParts.push(inline);
              } else if (inline && typeof inline === "object") {
                if (inline.text) {
                  inlineParts.push(inline.text);
                } else if (inline.content) {
                  const nested = formatCommentText(inline.content);
                  if (nested && nested !== "(empty)") inlineParts.push(nested);
                }
              }
            }
            let lineText = inlineParts.join("").trim();
            if (lineText) {
              if (item.type === "bulletListItem") lineText = `• ${lineText}`;
              else if (item.type === "checkListItem") lineText = item.props?.checked ? `[x] ${lineText}` : `[ ] ${lineText}`;
              lines.push(lineText);
            }
          } else if (typeof item.content === "string" && item.content.trim()) {
            lines.push(item.content.trim());
          }
        } else if (item.text && typeof item.text === "string" && item.text.trim()) {
          lines.push(item.text.trim());
        } else if (item.comment && typeof item.comment === "string" && item.comment.trim()) {
          lines.push(item.comment.trim());
        }
      }
    }

    return lines.length > 0 ? lines.join("\n") : "(empty)";
  }

  // If single object
  if (typeof val === "object") {
    if (val.text && typeof val.text === "string" && val.text.trim()) return val.text.trim();
    if (val.comment && typeof val.comment === "string" && val.comment.trim()) return val.comment.trim();
    if (val.content) return formatCommentText(val.content);
    try {
      const str = JSON.stringify(val);
      return str === "{}" ? "(empty)" : str;
    } catch {
      return "(empty)";
    }
  }

  return String(val);
}

