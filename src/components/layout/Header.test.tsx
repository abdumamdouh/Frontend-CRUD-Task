import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import "../../i18n";
import { Header } from "./Header";

describe("Header", () => {
  it("switches visible UI text and document direction for Arabic", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    await user.selectOptions(screen.getByLabelText("Language"), "ar");

    expect(await screen.findByText("دليل خدمات الإمارات")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");
  });
});
