import React from "react";
import { render } from "@testing-library/react";
import useProducts from "./useProducts";

jest.mock("../api/axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

const api = require("../api/axios");

function TestComp({ onReady }) {
  const hook = useProducts();
  React.useEffect(() => { if (onReady) onReady(hook); }, [hook, onReady]);
  return null;
}

test("load calls products endpoint and exposes pagination info", async () => {
  localStorage.setItem("token", "test-token");
  api.get.mockResolvedValueOnce({ data: { items: [{ id: 1, name: "A" }], total: 1, totalPages: 1 } });

  let hookRef;
  render(<TestComp onReady={(h) => { hookRef = h; }} />);

  await Promise.resolve();

  expect(api.get).toHaveBeenCalled();
  expect(hookRef).toBeDefined();
  expect(Array.isArray(hookRef.products)).toBe(true);
  localStorage.removeItem("token");
});
