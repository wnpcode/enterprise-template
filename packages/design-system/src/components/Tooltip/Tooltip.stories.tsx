import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./index";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Keterangan singkat saat hover atau fokus. Sub-komponen: \`Tooltip\`, \`TooltipTrigger\`, \`TooltipContent\`, dan \`TooltipProvider\` yang wajib membungkus pohon (default \`delayDuration\` 300 ms).

**Import**
\`\`\`tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan fokus**
- Tooltip muncul saat trigger di-hover atau menerima fokus keyboard; Escape menutupnya.
- Fokus tetap di trigger (tooltip tidak menerima fokus); Radix mengaitkannya ke trigger lewat \`aria-describedby\`.
- Tanpa \`TooltipProvider\` di atas pohon, Tooltip tidak berfungsi; pasang sekali di root aplikasi.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: pakai untuk label tambahan tombol ikon atau penjelasan satu kalimat.
- Do: Pasang \`TooltipTrigger asChild\` pada elemen interaktif (button, link) agar terjangkau keyboard.
- Don't: jangan memasang Tooltip pada elemen non-interaktif; keyboard tidak bisa mencapainya.
- Don't: jangan menaruh informasi penting atau elemen interaktif di dalam tooltip; tooltip tidak tampil di layar sentuh.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Simpan draf</Button>
      </TooltipTrigger>
      <TooltipContent>Simpan sebagai draf tanpa mempublikasikan</TooltipContent>
    </Tooltip>
  ),
};

export const Bawah: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Ekspor</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Ekspor data siswa ke CSV</TooltipContent>
    </Tooltip>
  ),
};
