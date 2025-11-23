import React, { useState } from "react";


export default function InlineEditor({ product, onSave, onCancel }) {
    const [form, setForm] = useState({ ...product });
    const [saving, setSaving] = useState(false);

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const save = async () => {
    setSaving(true);
    try {
        if (isNaN(Number(form.stock))) throw new Error('Stock must be a number');
        await onSave({ ...form, stock: Number(form.stock) });
    } catch (err) {
        alert(err.message || 'Save failed');
    } finally {
        setSaving(false);
    }
    };


    return (
        <tr className="editing">
            <td><input name="name" value={form.name} onChange={change} /></td>
            <td><input name="stock" value={form.stock} onChange={change} /></td>
            <td colSpan={2}></td>
            <td className="actions">
                <button disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={onCancel}>Cancel</button>
            </td>
        </tr>
    );
}