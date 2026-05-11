import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../../../i18n";
import { ServiceForm } from "../../components";

describe("ServiceForm", () => {
  it("shows validation error for a short title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ServiceForm onSubmit={onSubmit} onCancel={() => {}} isSaving={false} />,
    );

    await user.type(screen.getByLabelText("Title"), "AB");
    await user.type(
      screen.getByLabelText("Description"),
      "Valid service description",
    );
    await user.selectOptions(screen.getByLabelText("Category"), "Transport");
    await user.type(screen.getByLabelText("Processing time"), "5");
    await user.type(screen.getByLabelText("Fee"), "0");
    await user.click(screen.getByRole("button", { name: "Online" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Title must be at least 3 characters."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
