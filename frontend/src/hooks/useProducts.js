import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const normalizeResponse = useCallback((res, currentLimit) => {
    if (!res) return { items: [], totalPages: 1, total: 0 };
    const data = res.data;
    if (Array.isArray(data)) return { items: data, totalPages: 1, total: data.length };
    if (Array.isArray(data.items)) {
      const tp = data.totalPages || (data.total ? Math.ceil(data.total / (currentLimit || limit)) : 1);
      const total = data.total ?? data.totalCount ?? 0;
      return { items: data.items, totalPages: tp, total };
    }
    if (Array.isArray(data.data)) {
      const tp = data.totalPages || (data.total ? Math.ceil(data.total / (currentLimit || limit)) : 1);
      const total = data.total ?? data.totalCount ?? 0;
      return { items: data.data, totalPages: tp, total };
    }
    return { items: [], totalPages: 1, total: 0 };
  }, [limit]);

  const load = useCallback(async ({ page: p = 1, limit: l = limit, category, query } = {}) => {
    setLoading(true);
    try {
      let res;
      if (query) {
        res = await api.get("/products/search", { params: { name: query, page: p, limit: l } });
      } else {
        const params = { page: p, limit: l };
        if (category) params.category = category;
        res = await api.get("/products", { params });
      }

      const normalized = normalizeResponse(res, l);
      const total = normalized.total ?? (Array.isArray(res.data) ? res.data.length : 0);
      const totalPagesCalc = normalized.totalPages || (total ? Math.max(1, Math.ceil(total / l)) : 1);
      let itemsToSet = normalized.items || [];
      if (Array.isArray(res.data) && res.data.length > l) {
        const start = (p - 1) * l;
        itemsToSet = res.data.slice(start, start + l);
      } else if (normalized.items && normalized.items.length > l && normalized.totalPages <= 1) {
        const start = (p - 1) * l;
        itemsToSet = normalized.items.slice(start, start + l);
      }

      setProducts(itemsToSet);
      setTotalPages(totalPagesCalc);
      setTotalItems(total);
      setPage(p);
      setLimit(l);
      return res;
    } finally {
      setLoading(false);
    }
  }, [normalizeResponse]);

  const updateProduct = async (id, data) => {
    await api.put(`/products/${id}`, data);
    await load({ page, limit });
  };

  const importCSV = async (formData) => {
    return api.post("/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const exportCSV = async () => {
    try {
      const res = await api.get("/products/export", { responseType: "blob" });
      const blob = new Blob([res.data], { type: res.headers["content-type"] || "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const disposition = res.headers["content-disposition"] || "";
      let filename = "products.csv";
      const match = disposition.match(/filename\*=UTF-8''(.+)|filename="?([^;"\n]+)"?/);
      if (match) filename = decodeURIComponent(match[1] || match[2]);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const fetchHistory = (id) => api.get(`/products/${id}/history`);

  const getCategories = useCallback(async () => {
    if (!localStorage.getItem("token")) return [];
    try {
      const res = await api.get("/products/categories");
      if (res && Array.isArray(res.data)) {
        setCategories(res.data);
        return res.data;
      }
    } catch (err) {
    }
    const derived = Array.from(new Set((products || []).map(p => p.category).filter(Boolean)));
    setCategories(derived);
    return derived;
  }, [products]);
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    (async () => {
      try {
        const res = await api.get("/products", { params: { page: 1, limit } });
        const data = res.data;
        let items = [];
        let tp = 1;
        let total = 0;
        if (Array.isArray(data)) {
          items = data;
          total = data.length;
        } else if (Array.isArray(data.items)) {
          items = data.items;
          tp = data.totalPages || (data.total ? Math.ceil(data.total / limit) : 1);
          total = data.total ?? data.totalCount ?? 0;
        } else if (Array.isArray(data.data)) {
          items = data.data;
          tp = data.totalPages || (data.total ? Math.ceil(data.total / limit) : 1);
          total = data.total ?? data.totalCount ?? 0;
        }
        setProducts(items);
        setTotalPages(tp || 1);
        setTotalItems(total || (Array.isArray(data) ? data.length : 0));
        setPage(1);
      } catch (err) {
      }

      try {
        const res2 = await api.get("/products/categories");
        if (res2 && Array.isArray(res2.data)) {
          setCategories(res2.data);
        } else {
          const derived = Array.from(new Set((products || []).map(p => p.category).filter(Boolean)));
          setCategories(derived);
        }
      } catch (err) {
        const derived = Array.from(new Set((products || []).map(p => p.category).filter(Boolean)));
        setCategories(derived);
      }
    })();
  }, []);

  return {
    products,
    loading,
    load,
    updateProduct,
    importCSV,
    exportCSV,
    fetchHistory,
    categories,
    getCategories,
    page,
    limit,
    totalPages,
    totalItems,
  };
}
