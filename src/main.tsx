import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "./App";
import "./i18n";
import "./index.css";

const ELEMENT_NAME = "uae-services-directory";
const LIFERAY_STYLE_PATH = "/o/uae-services-directory/style.css";

function removeLiferayStylesAfterNavigation() {
  window.setTimeout(() => {
    if (document.querySelector(ELEMENT_NAME)) {
      return;
    }

    document
      .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      .forEach((link) => {
        if (link.href.includes(LIFERAY_STYLE_PATH)) {
          link.remove();
        }
      });
  }, 0);
}

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
    removeLiferayStylesAfterNavigation();
  }
}

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, UAEServicesDirectoryElement);
}

const rootElement = import.meta.env.DEV ? document.getElementById("root") : null;

if (rootElement && !rootElement.querySelector(ELEMENT_NAME)) {
  rootElement.appendChild(document.createElement(ELEMENT_NAME));
}
