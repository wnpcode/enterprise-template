import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  tags: ["autodocs"],
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `Wadah berbingkai untuk mengelompokkan konten terkait. Diekspor bersama bagiannya: \`Card\`, \`CardHeader\`, \`CardTitle\`, \`CardDescription\`, \`CardContent\`, dan \`CardFooter\`.

**Import**
\`\`\`tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- \`Card\`, \`CardHeader\`, \`CardContent\`, dan \`CardFooter\` adalah \`<div>\` tanpa role dan tidak dapat difokus; Card bukan elemen interaktif.
- \`CardTitle\` adalah \`<h3>\` dan \`CardDescription\` adalah \`<p>\`. Level heading tetap \`h3\`, jadi pastikan urutan heading halaman masuk akal.
- Taruh aksi (Button atau tautan) di \`CardFooter\` atau \`CardContent\` supaya urutan Tab mengikuti urutan baca.
- Semua bagian menerima \`className\` dan props \`div\`/\`h3\`/\`p\` biasa.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: susun Header (Title + Description), lalu Content, lalu Footer sesuai kebutuhan; bagian yang tidak dipakai boleh dihilangkan.
- Do: kelompokkan satu topik per Card.
- Don't: menumpuk Card di dalam Card.
- Don't: membuat seluruh Card menjadi satu area klik; beri tombol atau tautan yang jelas.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Tagihan November</CardTitle>
        <CardDescription>Jatuh tempo 15 November 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">Rp 2.450.000</p>
        <p className="mt-1 text-sm text-muted-foreground">Termasuk biaya layanan dan pajak.</p>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-muted-foreground">Diperbarui hari ini, 09.12</span>
      </CardFooter>
    </Card>
  ),
};
