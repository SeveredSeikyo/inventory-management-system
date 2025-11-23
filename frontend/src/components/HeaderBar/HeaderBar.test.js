import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import HeaderBar from "./HeaderBar";

jest.useFakeTimers();

test("calls onSearch after debounce and handles category and buttons", async () => {
  const onSearch = jest.fn();
  const onCategoryChange = jest.fn();
  const onRefresh = jest.fn();
  const exportCSV = jest.fn();
  const openImport = jest.fn();

  render(
    <HeaderBar
      exportCSV={exportCSV}
      openImport={openImport}
      onRefresh={onRefresh}
      onSearch={onSearch}
      categories={["Fruit", "Dairy"]}
      selectedCategory={""}
      onCategoryChange={onCategoryChange}
    />
  );

  const input = screen.getByPlaceholderText("Search products...");
  fireEvent.change(input, { target: { value: "apple" } });

  jest.advanceTimersByTime(350);
  expect(onSearch).toHaveBeenCalledWith("apple");

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "Dairy" } });
  expect(onCategoryChange).toHaveBeenCalledWith("Dairy");

  const refresh = screen.getByTitle("Refresh");
  fireEvent.click(refresh);
  expect(onRefresh).toHaveBeenCalled();

  fireEvent.click(screen.getByText("Import"));
  expect(openImport).toHaveBeenCalled();

  fireEvent.click(screen.getByText("Export"));
  expect(exportCSV).toHaveBeenCalled();
});
