import { afterEach, expect, it, vi, describe, beforeAll } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../app/page";
import { MantineProvider } from "@mantine/core";

import { AppRouterContextProviderMock } from "./app-router-context-provider-mock";

vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
      get: vi.fn(),
    })),
    usePathname: vi.fn(),
  };
});

describe("Homepage", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => cleanup());

  it("Create button points to correct location", async () => {
    // Arrange
    const push = vi.fn();
    render(
      <AppRouterContextProviderMock router={{ push }}>
        <MantineProvider>
          <Home />
        </MantineProvider>
      </AppRouterContextProviderMock>,
    );

    // Act
    await userEvent.click(screen.getByRole("link", { name: "Create survey" }));

    // Assert
    expect(push).toHaveBeenCalledWith("/create", { scroll: true });
  });

  it("Should show error when searchbar query is not equal to 6 characters", async () => {
    // Arrange
    render(
      <MantineProvider>
        <Home />
      </MantineProvider>,
    );

    // Act
    await userEvent.click(screen.getByPlaceholderText("Enter survey ID"));
    await userEvent.type(
      screen.getByPlaceholderText("Enter survey ID"),
      "wayyyyytoolong",
    );
    await userEvent.click(screen.getByRole("button", { name: "" }));

    // Assert
    expect(
      screen.getByText("Survey ID must be exactly 6 characters."),
    ).toBeTruthy();
  });
});
