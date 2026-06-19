import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import "../../../i18n";
import { Header } from "../Header";

describe("Header", () => {
  it("switches visible UI text and scopes direction to the client extension root", async () => {
    const user = userEvent.setup();
    render(
      createElement(
        "uae-services-directory",
        {},
        <div className="uae-services-directory-root">
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </div>,
      ),
    );

    await user.selectOptions(screen.getByLabelText("Language"), "ar");

    expect(await screen.findByText("دليل خدمات الإمارات")).toBeInTheDocument();
    expect(
      document.querySelector(".uae-services-directory-root"),
    ).toHaveAttribute("dir", "rtl");
    expect(document.documentElement.dir).not.toBe("rtl");
  });
});
