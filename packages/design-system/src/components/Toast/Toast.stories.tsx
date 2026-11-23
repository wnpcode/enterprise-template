import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { ToastProvider, useToast } from "./index";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Toast",
  tags: ["autodocs"],
  component: ToastProvider,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Notifikasi sementara yang tidak memblokir. Diekspor \`ToastProvider\` (wajib membungkus aplikasi) dan hook \`useToast()\` yang mengembalikan \`{ toast, dismiss }\`.

**Import**
\`\`\`tsx
import { ToastProvider, useToast } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan fokus**
- \`toast({ title, description?, variant?, duration? })\` menampilkan toast dan mengembalikan id; \`dismiss(id)\` menutupnya. \`variant\`: \`default\`, \`success\`, \`danger\`.
- \`useToast()\` di luar \`ToastProvider\` melempar error.
- Toast diumumkan pembaca layar tanpa mencuri fokus; tombol tutup bawaan memakai teks sr-only "Tutup". Menurut perilaku bawaan Radix, F8 memfokuskan viewport dan Escape menutup toast yang terfokus (tidak dicakup test komponen ini).
- \`duration\` default dari \`ToastProvider\` (bawaan Radix 5000 ms) bisa ditimpa per toast.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: panggil \`useToast()\` di dalam \`ToastProvider\`, lalu \`toast(...)\` dari event handler.
- Do: Pakai \`success\` untuk hasil berhasil dan \`danger\` untuk gagal, dengan \`title\` singkat dan \`description\` berisi tindakan lanjut.
- Don't: jangan taruh informasi kritis atau tindakan wajib di toast; toast hilang otomatis.
- Don't: jangan memanggil \`toast()\` saat render atau di effect tanpa pengaman, agar tidak terkirim berulang.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const { toast } = useToast();
  return (
    <div className="gap-3 flex flex-wrap">
      <Button variant="outline" onClick={() => toast({ title: "Draf disimpan", description: "Perubahan dapat dilanjutkan nanti." })}>
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Kelas berhasil dibuat", description: "X IPA 2 sudah muncul di daftar kelas.", variant: "success" })}
      >
        Sukses
      </Button>
      <Button
        variant="danger"
        onClick={() => toast({ title: "Gagal menyimpan", description: "Periksa koneksi lalu coba lagi.", variant: "danger" })}
      >
        Gagal
      </Button>
    </div>
  );
}

export const Varian: Story = { render: () => <Demo /> };
