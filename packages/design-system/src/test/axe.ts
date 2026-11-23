import { axe } from "vitest-axe";

// color-contrast butuh canvas yang tidak ada di jsdom; kontras dicek terpisah (lihat assessment)
export async function expectNoA11yViolations(container: Element): Promise<void> {
  expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
}
