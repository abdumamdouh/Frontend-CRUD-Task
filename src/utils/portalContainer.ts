export function getClientExtensionPortalContainer() {
  if (typeof document === "undefined") {
    return undefined;
  }

  return (
    document.querySelector<HTMLElement>(
      "uae-services-directory .uae-services-directory-root",
    ) ?? undefined
  );
}
