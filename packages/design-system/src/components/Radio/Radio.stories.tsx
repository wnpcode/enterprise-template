import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  tags: ["autodocs"],
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: `Tombol radio berbasis \`<input type="radio">\` native. Pakai untuk memilih tepat satu opsi dari daftar pendek yang semua pilihannya perlu terlihat.

**Import**
\`\`\`tsx
import { Radio } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<input type="radio">\` native: Tab masuk ke grup, Space memilih. Panah memindah pilihan di dalam grup yang sama (perilaku bawaan browser).
- Tidak ada komponen RadioGroup; kelompokkan radio dengan atribut \`name\` yang sama.
- Asosiasikan setiap Radio dengan Label lewat \`id\` dan \`htmlFor\`.
- Tidak ada prop \`invalid\`: validitas milik grup, jadi pasang \`aria-invalid\` pada \`<fieldset>\` atau elemen \`role="radiogroup"\`.
- Beri judul grup dengan \`<legend>\` atau \`aria-labelledby\`.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: bungkus grup dalam \`<fieldset>\` dengan \`<legend>\`, dan beri \`defaultChecked\` bila ada pilihan bawaan yang wajar.
- Do: beri semua radio dalam satu grup \`name\` yang sama.
- Don't: memakai Radio untuk lebih dari kira-kira lima opsi; pertimbangkan Select.
- Don't: memakai Radio untuk pilihan ganda; pakai Checkbox.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Radio>;

/** No RadioGroup component: group radios with the native `name` attribute. */
export const Group: Story = {
  render: () => (
    <fieldset className="gap-2 flex flex-col">
      <legend className="mb-2 text-sm font-medium">Paket langganan</legend>
      {["Gratis", "Pro", "Enterprise"].map((plan) => (
        <div key={plan} className="gap-2 flex items-center">
          <Radio id={`plan-${plan}`} name="plan" value={plan} defaultChecked={plan === "Pro"} />
          <label htmlFor={`plan-${plan}`} className="text-sm">
            {plan}
          </label>
        </div>
      ))}
    </fieldset>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="gap-2 flex items-center">
      <Radio id="radio-disabled" name="disabled" disabled />
      <label htmlFor="radio-disabled" className="text-sm">
        Tidak tersedia
      </label>
    </div>
  ),
};
