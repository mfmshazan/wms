import { CATEGORIES } from "../../data/constants";

const ALL_CATEGORIES = ["All Categories", ...CATEGORIES];

/**
 * SearchBar — text search + category filter side by side.
 */
export function SearchBar({ search, onSearch, filterCat, onFilterCat }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search input */}
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-wms-muted text-sm pointer-events-none">
          ⌕
        </span>
        <input
          id="search-products"
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, SKU or category…"
          className="bg-wms-bg border border-wms-border rounded-lg pl-8 pr-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors"
        />
      </div>

      {/* Category filter */}
      <div className="w-full sm:w-52">
        <select
          id="filter-category"
          value={filterCat}
          onChange={(e) => onFilterCat(e.target.value)}
          className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors appearance-none cursor-pointer"
        >
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-wms-surface">
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
