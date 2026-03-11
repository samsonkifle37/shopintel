type FilterBarProps = {
  filters: string[];
};

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="filters">
      {filters.map((filter) => (
        <span className="filter-pill" key={filter}>
          {filter}
        </span>
      ))}
    </div>
  );
}
