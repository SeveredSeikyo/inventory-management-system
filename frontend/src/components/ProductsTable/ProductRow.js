import React, { useState } from "react";
import InlineEditor from "../InlineEditor/InlineEditor";


export default function ProductRow({ product, onEdit, onHistory }) {
    const [editing, setEditing] = useState(false);


    if (editing) return (
        <InlineEditor product={product} onSave={(data) => { onEdit(product.id, data); setEditing(false); }} onCancel={() => setEditing(false)} />
    );


    const status = product.stock === 0 ? "Out of Stock" : "In Stock";
    const statusClass = product.stock === 0 ? "status out" : "status in";


    return (
        <tr>
            <td>{product.name}</td>
            <td>{product.stock}</td>
            <td><span className={statusClass}>{status}</span></td>
            <td>{product.brand}</td>
            <td>{product.category}</td>
            <td>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => onHistory(product)}>History</button>
            </td>
        </tr>
    );
}