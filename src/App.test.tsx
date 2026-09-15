import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
beforeEach(() => {
  window.location.hash = "/";
  localStorage.clear();
});
async function start(count = "2") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Your name"), "Ana");
  await user.type(screen.getByLabelText(/Number of questions/), count);
  await user.click(screen.getByRole("button", { name: "Start Quiz" }));
  return user;
}
it("skips the first question, preserves later selections and supports retry", async () => {
  render(<App />);
  const user = await start();
  await user.click(screen.getByRole("button", { name: "Next" }));
  const input =
    screen.queryAllByRole("radio")[0] ?? screen.getAllByRole("checkbox")[0];
  await user.click(input);
  const selectedId = input.id;
  await user.click(screen.getByRole("button", { name: "Back" }));
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(document.getElementById(selectedId)).toBeChecked();
  await user.click(screen.getByRole("button", { name: "Finish" }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "your score is",
  );
  expect(screen.getByText("Not answered")).toBeInTheDocument();
  const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  await user.click(screen.getByRole("button", { name: "Try again" }));
  await start("1");
  expect(screen.getByText("Time: 02:00")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Question 1 of 1" }),
  ).toBeInTheDocument();
});
it("redirects a direct quiz URL without a session", () => {
  window.location.hash = "/quiz";
  render(<App />);
  expect(
    screen.getByRole("button", { name: "Start Quiz" }),
  ).toBeInTheDocument();
});
it("toggles theme using keyboard and persists it", async () => {
  render(<App />);
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByRole("switch", { name: "Dark mode" })).toHaveFocus();
  await user.keyboard(" ");
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  expect(localStorage.getItem("theme-mode")).toBe("light");
});
it("tolerates invalid or unavailable local storage", () => {
  localStorage.setItem("theme-mode", "invalid");
  const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  try {
    render(<App />);
    fireEvent.click(screen.getByRole("switch"));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  } finally {
    get.mockRestore();
    set.mockRestore();
  }
});
