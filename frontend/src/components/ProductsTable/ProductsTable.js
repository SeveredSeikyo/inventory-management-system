import React from "react";
import ProductRow from "./ProductRow";

export default function ProductsTable({ products = [], onEdit, onHistory }) {
    return (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.length === 0 && (
                    <tr><td colSpan={6} className="empty">No products found</td></tr>
                )}
                {
                    products.map(p => (
                    <ProductRow key={p.id} product={p} onEdit={onEdit} onHistory={onHistory} />
                ))}
            </tbody>
        </table>
    );
}