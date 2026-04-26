"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  editable?: boolean;
  inputClassName?: string;
};

export function EditableText({
  value,
  onChange,
  multiline = false,
  className = "",
  placeholder = "Cliquer pour éditer...",
  editable = true,
  inputClassName = "",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editable) return <span className={className}>{value || placeholder}</span>;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              commit();
            }
          }}
          rows={Math.max(2, draft.split("\n").length + 1)}
          className={`w-full resize-y rounded border border-flex-gold/40 bg-background px-2 py-1 outline-none ring-2 ring-flex-gold/20 ${className} ${inputClassName}`}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className={`w-full rounded border border-flex-gold/40 bg-background px-2 py-1 outline-none ring-2 ring-flex-gold/20 ${className} ${inputClassName}`}
      />
    );
  }

  return (
    <span
      className={`group/edit relative inline-block cursor-text rounded transition-colors hover:bg-flex-gold/5 ${className}`}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setEditing(true);
        }
      }}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <Pencil className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover/edit:opacity-50" />
    </span>
  );
}
