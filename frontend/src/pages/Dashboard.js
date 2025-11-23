import React, { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar/HeaderBar";
import ProductsTable from "../components/ProductsTable/ProductsTable";
import HistorySidebar from "../components/HistorySidebar/HistorySidebar";
import ImportModal from "../components/ImportModal/ImportModal";
import useProducts from "../hooks/useProducts";


export default function Dashboard() {
    const { products, updateProduct, exportCSV, importCSV, fetchHistory, load, categories, page, totalPages, totalItems, loading, limit } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showImport, setShowImport] = useState(false);
    const [history, setHistory] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(page || 1);
    const [jumpPage, setJumpPage] = useState(null);

    useEffect(() => {
        setCurrentPage(page || 1);
    }, [page]);

    const openHistory = async (product) => {
        const res = await fetchHistory(product.id);
        setHistory(res.data);
        setSelectedProduct(product);
    };

    const handleSearch = (q) => {
        setQuery(q);
        setCurrentPage(1);
        load({ page: 1, limit, category, query: q });
    };

    const handleCategoryChange = (c) => {
        setCategory(c);
        setCurrentPage(1);
        load({ page: 1, limit, category: c, query });
    };

    const goToPage = (p) => {
        const next = Math.max(1, Math.min(p, totalPages || 1));
        setCurrentPage(next);
        load({ page: next, limit, category, query });
    };

    const renderPageButtons = (current, total, onClick, disabled) => {
        if (!total || total <= 1) return null;
        const buttons = [];
        const maxButtons = 7;
        if (total <= maxButtons) {
            for (let i = 1; i <= total; i++) {
                buttons.push(
                    <button key={i} className={i === current ? 'active' : ''} onClick={() => onClick(i)} disabled={disabled || i === current}>{i}</button>
                );
            }
            return buttons;
        }

        const left = Math.max(1, current - 2);
        const right = Math.min(total, current + 2);

        if (left > 1) {
            buttons.push(<button key={1} onClick={() => onClick(1)} disabled={disabled}>1</button>);
            if (left > 2) buttons.push(<span key="l-ellipsis" className="ellipsis">…</span>);
        }

        for (let i = left; i <= right; i++) {
            buttons.push(<button key={i} className={i === current ? 'active' : ''} onClick={() => onClick(i)} disabled={disabled || i === current}>{i}</button>);
        }

        if (right < total) {
            if (right < total - 1) buttons.push(<span key="r-ellipsis" className="ellipsis">…</span>);
            buttons.push(<button key={total} onClick={() => onClick(total)} disabled={disabled}>{total}</button>);
        }

        return buttons;
    };

    

    return (
        <div className="page container">
            <HeaderBar exportCSV={exportCSV} openImport={() => setShowImport(true)} onRefresh={() => load({ page: currentPage, limit: 20, category, query })} onSearch={handleSearch} categories={categories} selectedCategory={category} onCategoryChange={handleCategoryChange} loading={loading} />

            <main className="main">
                <ProductsTable products={products} onEdit={updateProduct} onHistory={openHistory} />
            </main>

            <div className="pagination">
                <div className="pagination-left">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={loading || currentPage <= 1}>Previous</button>
                </div>

                <div className="pagination-center">
                    <div className="page-list">
                        {renderPageButtons(currentPage, totalPages, (p) => goToPage(p), loading)}
                    </div>
                    <div className="pagination-info">{totalItems} items</div>
                </div>

                <div className="pagination-right">
                    <button onClick={() => goToPage(currentPage + 1)} disabled={loading || currentPage >= (totalPages || 1)}>Next</button>
                    <label>
                        Jump to
                        <input type="number" min="1" max={totalPages || 1} value={jumpPage} onChange={(e) => setJumpPage(Number(e.target.value))} />
                    </label>
                    <button onClick={() => { goToPage(jumpPage || 1); setJumpPage(null); }} disabled={loading}>Go</button>
                </div>
            </div>

            {
                showImport && (
                <ImportModal
                onClose={() => setShowImport(false)}
                importCSV={importCSV}
                onSuccess={() => { setShowImport(false); load({ page: currentPage, limit: 20, category, query }); }}
                />
            )}

            {
                selectedProduct && (
                <HistorySidebar
                product={selectedProduct}
                history={history}
                onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}