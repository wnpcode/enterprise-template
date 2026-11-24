import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "../../locale/LocaleProvider";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { XIcon } from "../icons";
import { Popover, PopoverAnchor, PopoverContent } from "../Popover";

export type TourStep = {
  /** CSS selector elemen yang disorot, mis. `[data-tour="siswa-tambah"]`. */
  target: string;
  title: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Nama fitur yang dijelaskan step ini. Step berurutan dengan `group` yang sama dianggap satu fitur: label tampil di
   * atas judul, nomor langkah dihitung di dalam fitur, dan "Lewati fitur ini" melompati seluruh fiturnya.
   */
  group?: string;
  /**
   * Dipanggil setiap step ini akan tampil, untuk menyiapkan tampilan (mis. membuka Sheet yang memuat target).
   * Tour menunggu sampai target muncul. Harus idempoten; fungsi yang dipakai adalah yang ada saat tour mulai.
   */
  before?: () => void;
};

export type TourProps = {
  steps: TourStep[];
  open: boolean;
  /** Dipanggil dengan `false` saat tour selesai, dilewati, atau ditutup (Esc / klik di luar). */
  onOpenChange: (open: boolean) => void;
};

const HIGHLIGHT_PADDING = 4;
// target yang belum muncul sampai batas ini dianggap tidak ada dan step-nya dilewati
const TARGET_TIMEOUT = 2000;

// elemen yang tersembunyi (display:none, kolom yang disembunyikan di mobile) berukuran 0
const isVisible = (el: Element | null): el is Element => {
  if (!el) return false;
  const { width, height } = el.getBoundingClientRect();
  return width > 0 && height > 0;
};

// posisi disetel langsung ke DOM tiap frame: mengikuti scroll, resize, dan animasi Sheet tanpa render ulang
function place(node: HTMLElement | null, el: Element) {
  if (!node) return;
  const r = el.getBoundingClientRect();
  node.style.top = `${r.top - HIGHLIGHT_PADDING}px`;
  node.style.left = `${r.left - HIGHLIGHT_PADDING}px`;
  node.style.width = `${r.width + HIGHLIGHT_PADDING * 2}px`;
  node.style.height = `${r.height + HIGHLIGHT_PADDING * 2}px`;
}

// rentang index step per fitur; step berurutan dengan `group` sama (atau sama-sama tanpa group) satu rentang
function groupRanges(steps: TourStep[]) {
  const ranges: { start: number; end: number }[] = [];
  steps.forEach((s, i) => {
    const prev = ranges[ranges.length - 1];
    if (prev && steps[prev.start].group === s.group) prev.end = i;
    else ranges.push({ start: i, end: i });
  });
  return ranges;
}

function TourRun({ steps, onOpenChange }: Pick<TourProps, "steps" | "onOpenChange">) {
  const { tour: t, close: closeLabel } = useLocale();
  const titleId = useId();
  // step tanpa `before` yang elemennya tidak ada atau tersembunyi dilewati; dihitung sekali saat tour mulai, setelah DOM terpasang
  const [usable, setUsable] = useState<TourStep[] | null>(null);
  const [index, setIndex] = useState(0);
  // elemen step yang terakhir ditemukan; tetap dipakai untuk sorotan selagi step berikutnya dicari
  const [found, setFound] = useState<{ step: TourStep; el: Element } | null>(null);
  const direction = useRef(1);
  const highlight = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const change = useRef(onOpenChange);
  useLayoutEffect(() => {
    change.current = onOpenChange;
  });

  useLayoutEffect(() => {
    // pengukuran DOM saat mount, sekali per tour; elemen target belum ada saat render pertama
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsable(steps.filter((s) => s.before || isVisible(document.querySelector(s.target))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = usable?.[index];
  useEffect(() => {
    if (!usable) return;
    // tidak ada step yang bisa tampil, atau sudah melewati ujung saat melompati step yang targetnya tidak muncul
    if (!step) {
      change.current(false);
      return;
    }
    step.before?.();
    const deadline = performance.now() + TARGET_TIMEOUT;
    let target: Element | null = null;
    let frame = 0;
    const tick = () => {
      if (!target) {
        const candidate = document.querySelector(step.target);
        if (isVisible(candidate)) {
          target = candidate;
          candidate.scrollIntoView({ block: "center", inline: "nearest" });
          setFound({ step, el: candidate });
        } else if (performance.now() > deadline) {
          setIndex(index + direction.current);
          return;
        }
      }
      if (target) place(highlight.current, target);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [usable, index, step]);

  if (!usable || !found) return null;
  const close = () => onOpenChange(false);
  const go = (next: number) => {
    direction.current = next > index ? 1 : -1;
    setIndex(next);
  };
  const last = index === usable.length - 1;
  const ranges = groupRanges(usable);
  const range = ranges.find((r) => index >= r.start && index <= r.end) ?? ranges[0];
  // beberapa fitur dalam satu tur: tampilkan batas fitur (titik), "Lewati fitur ini", dan tombol tutup
  const multi = ranges.length > 1;
  const groupSize = range.end - range.start + 1;
  const showSkip = multi ? index < range.end : !last;
  const skip = multi ? () => (range.end + 1 >= usable.length ? close() : go(range.end + 1)) : close;

  return (
    <>
      {createPortal(
        <div
          ref={highlight}
          aria-hidden="true"
          data-tour-highlight=""
          className="pointer-events-none fixed z-[60] rounded-md shadow-[0_0_0_9999px_var(--color-overlay)]"
        />,
        document.body,
      )}
      {/* dipasang ulang tiap step agar selalu berada di atas Sheet/Dialog yang baru dibuka oleh `before` */}
      {step && found.step === step && (
        <Popover key={index} open onOpenChange={(next) => !next && close()}>
          <PopoverAnchor virtualRef={{ current: found.el }} />
          <PopoverContent
            data-ds-tour=""
            side={step.side ?? "bottom"}
            sideOffset={HIGHLIGHT_PADDING + 8}
            collisionPadding={16}
            updatePositionStrategy="always"
            aria-labelledby={titleId}
            // fokus ke tombol utama agar Enter berulang kali memajukan tour
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              primary.current?.focus();
            }}
            // `before` bisa memindahkan fokus (mis. Sheet menutup dan fokus kembali ke pemicunya); itu bukan alasan menutup tour
            onFocusOutside={(e) => e.preventDefault()}
            className="relative z-[70] w-[26rem] max-w-[calc(100vw-2rem)]"
          >
            {multi && (
              <button
                type="button"
                onClick={close}
                className="right-3 top-3 absolute rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <XIcon />
                <span className="sr-only">{closeLabel}</span>
              </button>
            )}
            {(step.group || groupSize > 1) && (
              <div className={cn("gap-3 text-xs mb-1 flex items-baseline text-muted-foreground", multi && "pr-6")}>
                {step.group && <span>{step.group}</span>}
                {groupSize > 1 && <span className="ml-auto shrink-0">{t.progress(index - range.start + 1, groupSize)}</span>}
              </div>
            )}
            <p id={titleId} className="font-semibold">
              {step.title}
            </p>
            <div className="mt-1 text-sm text-muted-foreground">{step.content}</div>
            {multi && (
              <div aria-hidden="true" data-tour-dots="" className="mt-3 gap-3 flex items-center">
                {ranges.map((r) => (
                  <div key={r.start} className="gap-1 flex items-center">
                    {Array.from({ length: r.end - r.start + 1 }, (_, i) => (
                      <span key={i} className={cn("h-1.5 rounded-full", r.start + i === index ? "w-4 bg-primary" : "w-1.5 bg-border")} />
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 gap-2 flex flex-wrap justify-end">
              {showSkip && (
                <Button variant="ghost" onClick={skip}>
                  {multi ? t.skipGroup : t.skip}
                </Button>
              )}
              {index > 0 && (
                <Button variant="outline" onClick={() => go(index - 1)}>
                  {t.previous}
                </Button>
              )}
              <Button ref={primary} onClick={() => (last ? close() : go(index + 1))}>
                {last ? t.done : t.next}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}

/**
 * Tur produk: menyorot elemen satu per satu di halaman yang sama dengan penjelasan singkat.
 * Dikendalikan lewat `open`; menyimpan status "sudah dilihat" adalah urusan pemakai.
 */
export function Tour({ steps, open, onOpenChange }: TourProps) {
  // dipasang hanya saat terbuka agar posisi step selalu mulai dari awal
  return open ? <TourRun steps={steps} onOpenChange={onOpenChange} /> : null;
}
