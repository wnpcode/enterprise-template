// Popover Tour berada di luar pohon Dialog/Sheet; tanpa ini klik "Berikutnya" dianggap klik di luar dan menutupnya
export function ignoreTourPointer(event: CustomEvent<{ originalEvent: Event }>) {
  const target = event.detail.originalEvent.target;
  if (target instanceof Element && target.closest("[data-ds-tour]")) event.preventDefault();
}
