import React, { useState, useEffect } from "react";
import debounce from "../../utils/debounce";

export default function HeaderBar({ exportCSV, openImport, onRefresh, onSearch, categories = [], selectedCategory, onCategoryChange, loading = false }) {
    const [query, setQuery] = useState("");

    const debounced = debounce((value) => {
        if (onSearch) onSearch(value);
    }, 300);

    useEffect(() => {
        return () => debounced.cancel && debounced.cancel();
    }, [debounced]);

    return (
        <header className="header">
            <div className="left">
                <input className="search"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); debounced(e.target.value); }}
                />
                <select value={selectedCategory || ""} onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={onRefresh} title="Refresh">⟳</button>
            </div>

            <div className="right">
                {loading ? <div className="header-spinner" aria-hidden="true"></div> : null}
                <button onClick={openImport} disabled={loading}>Import</button>
                <button onClick={exportCSV} disabled={loading}>Export</button>
            </div>
        </header>
    );
}