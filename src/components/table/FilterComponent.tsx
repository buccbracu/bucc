"use client";

type FilterOption = {
  type: string;
  name: string;
  placeholder?: string;
  options?: string[];
};

export default function FilterComponent({
  filters,
  onFilterChange,
  onResetFilters,
}: {
  filters: FilterOption[];
  onFilterChange: (filter: Record<string, string>) => void;
  onResetFilters: () => void;
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onReset={onResetFilters}
      className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:flex-wrap md:items-center"
    >
      {filters.map((filter) =>
        filter.type === "select" ? (
          <select
            key={filter.name}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            defaultValue=""
            onChange={(event) => onFilterChange({ [filter.name]: event.target.value })}
          >
            <option value="">{filter.placeholder ?? "Filter"}</option>
            {filter.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            key={filter.name}
            className="h-10 min-w-64 rounded-md border border-input bg-background px-3 text-sm"
            placeholder={filter.placeholder}
            onChange={(event) => onFilterChange({ [filter.name]: event.target.value })}
          />
        ),
      )}
      <button className="h-10 rounded-md border border-border px-4 text-sm hover:bg-muted" type="reset">
        Reset
      </button>
    </form>
  );
}
