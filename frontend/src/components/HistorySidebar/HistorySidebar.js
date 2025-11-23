import React from "react";

export default function HistorySidebar({ product, history = [], onClose }) {
  return (
    <aside className="sidebar" aria-labelledby="history-title">
      <div className="sidebar-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 id="history-title" style={{ margin: 0 }}>{product?.name || "Product"} — History</h3>
        <div>
          <button onClick={onClose} aria-label="Close history">Close</button>
        </div>
      </div>

      <div className="timeline" style={{ marginTop: 12 }}>
        {(!history || history.length === 0) && (
          <div className="empty">No history available</div>
        )}

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {history.map((item) => (
            <li key={item.id || `${item.product_id}-${item.change_date}`} className="timeline-item" style={{ padding: 12, borderBottom: "1px dashed #eee" }}>
              <div style={{ fontWeight: 700 }}>
                {item.old_quantity} → {item.new_quantity}
                {item.old_quantity !== undefined && item.new_quantity !== undefined && (
                  <span style={{ marginLeft: 8, color: item.new_quantity > item.old_quantity ? "green" : (item.new_quantity < item.old_quantity ? "red" : "#666") }}>
                    ({item.new_quantity - item.old_quantity >= 0 ? `+${item.new_quantity - item.old_quantity}` : item.new_quantity - item.old_quantity})
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                {new Date(item.change_date).toLocaleString()} {item.user_info ? ` • ${item.user_info}` : ""}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
