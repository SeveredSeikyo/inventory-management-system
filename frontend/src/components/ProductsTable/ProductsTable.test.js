import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ProductsTable from "./ProductsTable";

test("renders product rows and calls onHistory when History clicked", () => {
  const products = [
    { id: 1, name: "Apple", stock: 5, brand: "ACME", category: "Fruit" }
  ];
  const onEdit = jest.fn();
  const onHistory = jest.fn();

  render(<ProductsTable products={products} onEdit={onEdit} onHistory={onHistory} />);

  expect(screen.getByText("Apple")).toBeInTheDocument();

  const historyButtons = screen.getAllByText("History");
  fireEvent.click(historyButtons[0]);
  expect(onHistory).toHaveBeenCalledWith(products[0]);
});
