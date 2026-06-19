import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./index.css";

const ELEMENT_NAME = "uae-services-directory";

class UAEServicesDirectoryElement extends HTMLElement {
  #root: Root | null = null;
  #mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    if (this.#root) return;

    this.#mountPoint = document.createElement("div");
    this.#mountPoint.className = "uae-services-directory-root";
    this.appendChild(this.#mountPoint);

    this.#root = createRoot(this.#mountPoint);
    this.#root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }

  disconnectedCallback() {
    this.#root?.unmount();
    this.#root = null;
    this.#mountPoint?.remove();
    this.#mountPoint = null;
  }
}

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, UAEServicesDirectoryElement);
}

const rootElement = import.meta.env.DEV ? document.getElementById("root") : null;

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
