import React, { useState } from "react";

export default function ImportModal({ importCSV, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    if (!file) return alert("Please choose a CSV file.");
    const fd = new FormData();
    fd.append("csvFile", file);

    setLoading(true);
    try {
      const res = await importCSV(fd);
      const data = res.data || {};
      // standardize
      const normalized = {
        added: data.added ?? data.addedCount ?? data.added_rows ?? 0,
        skipped: data.skipped ?? data.skippedCount ?? data.skipped_rows ?? 0,
        duplicates: data.duplicates ?? data.duplicateList ?? [],
      };
      setResult(normalized);
      if (onSuccess) onSuccess(normalized);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-body card">
        <h3>Import Products (CSV)</h3>

        {!result ? (
          <>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={submit} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 12 }}>
            <p>Added: {result.added}</p>
            <p>Skipped: {result.skipped}</p>
            {result.duplicates && result.duplicates.length > 0 && (
              <details>
                <summary>View duplicates ({result.duplicates.length})</summary>
                <ul>
                  {result.duplicates.map((d, i) => (
                    <li key={i}>{JSON.stringify(d)}</li>
                  ))}
                </ul>
              </details>
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
