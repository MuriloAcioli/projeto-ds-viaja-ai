import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Campo } from "@/components/c_auth/campo";

afterEach(() => {
  cleanup();
});

describe("Campo", () => {
  it("renderiza o label e o input", () => {
    render(
      <Campo
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("E-mail")).toBeDefined();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeDefined();
  });

  it("chama onChange quando o usuário digita", () => {
    const onChange = vi.fn();

    render(
      <Campo
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value=""
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "teste@email.com" },
    });

    expect(onChange).toHaveBeenCalledWith("teste@email.com");
  });
});