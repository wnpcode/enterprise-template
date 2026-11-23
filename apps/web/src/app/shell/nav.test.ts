import { flattenNav, navItems, pruneNav, visibleNavItems, type NavNode } from "./nav";

const user = (roles: string[]) => ({ id: 1, name: "U", email: "u@x.id", roles });

const tree: NavNode[] = [
  { to: "/a", label: "a" },
  {
    to: "/b",
    label: "b",
    children: [
      { to: "/b/rahasia", label: "b-rahasia", roles: ["superadmin"] },
      { to: "/b/dalam", label: "b-dalam", children: [{ to: "/b/dalam/x", label: "x", roles: ["superadmin"] }] },
    ],
  },
  { to: "/c", label: "c", children: [{ to: "/c/1", label: "c1", roles: ["admin"] }] },
];

describe("pruneNav", () => {
  it("memangkas rekursif per role dan membuang grup yang kosong", () => {
    const guru = pruneNav(tree, user(["guru"]));
    expect(guru.map((n) => n.to)).toEqual(["/a"]);
    const superadmin = pruneNav(tree, user(["superadmin"]));
    expect(flattenNav(superadmin).map((n) => n.to)).toEqual(["/a", "/b", "/b/rahasia", "/b/dalam", "/b/dalam/x"]);
  });

  it("tidak mengubah pohon asli", () => {
    pruneNav(tree, user(["guru"]));
    expect(flattenNav(tree)).toHaveLength(7);
  });
});

describe("flattenNav", () => {
  it("meratakan semua tingkat dengan induk sebelum anak", () => {
    expect(flattenNav(tree).map((n) => n.to)).toEqual(["/a", "/b", "/b/rahasia", "/b/dalam", "/b/dalam/x", "/c", "/c/1"]);
  });
});

describe("navItems", () => {
  it("awalan `to` grup mencakup semua turunannya", () => {
    for (const item of navItems) for (const n of flattenNav(item.children ?? [])) expect(n.to.startsWith(`${item.to}/`)).toBe(true);
  });

  it("guru tidak melihat Konfigurasi, superadmin melihatnya", () => {
    expect(visibleNavItems(user(["guru"])).map((i) => i.to)).not.toContain("/app/konfigurasi-company");
    expect(visibleNavItems(user(["superadmin"])).map((i) => i.to)).toContain("/app/konfigurasi-company");
  });
});
