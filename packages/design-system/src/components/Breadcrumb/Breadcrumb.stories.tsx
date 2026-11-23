import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Jejak lokasi halaman di dalam hierarki. Komposisi: \`Breadcrumb > BreadcrumbList > BreadcrumbItem > BreadcrumbLink | BreadcrumbPage\`, dengan \`BreadcrumbSeparator\` di antara item.

**Import**
\`\`\`tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@enterprise/design-system";

<BreadcrumbLink asChild><Link to="/app">Dashboard</Link></BreadcrumbLink>
\`\`\`

**Keyboard dan aksesibilitas**
- \`<nav aria-label="Breadcrumb">\` berisi \`<ol>\`; tautan berpindah dengan Tab.
- Halaman saat ini memakai \`BreadcrumbPage\` (\`aria-current="page"\`), bukan tautan.
- Pemisah \`aria-hidden\`; jangan menaruh teks bermakna di dalamnya.
- \`asChild\` untuk \`<Link>\` react-router: kelas digabung ke tautan router tanpa \`<a>\` ganda.

**Do / Don't**
- Do: maksimal 3–4 tingkat; letakkan di atas judul lewat prop \`breadcrumb\` di PageHeader.
- Don't: memakai breadcrumb sebagai navigasi utama atau mengulang judul halaman persis.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Siswa</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Aisyah Putri</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
