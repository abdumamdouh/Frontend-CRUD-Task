import type { ServiceTag } from "../types/service";
import { tagBadgeClass } from "../utils/serviceBadgeStyles";

interface TagChipsProps {
  allTags: ServiceTag[];
  selectedTags: ServiceTag[];
  onToggleTag: (tag: ServiceTag) => void;
  label: string;
}

export function TagChips({
  allTags,
  selectedTags,
  onToggleTag,
  label,
}: TagChipsProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-700">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const selected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                selected
                  ? "border-primary-600 bg-primary-600 text-whitely-50"
                  : `aegov-badge badge-base ${tagBadgeClass[tag]} hover:brightness-95`
              }`}
              aria-pressed={selected}
              onClick={() => onToggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
