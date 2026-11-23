import { Link } from "react-router";
import { PageHeader } from "@wnp_code/design-system";
import { demoGroups, demos } from "./demos";

export function KomponenListPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Komponen"
        description="Demo setiap komponen design system di dalam portal ini. Tema mengikuti Pengaturan. Kontrol di halaman demo tidak mengubah data apa pun."
      />
      {demoGroups.map((group) => (
        <section key={group} className="space-y-3">
          <h2 className="text-base font-medium">{group}</h2>
          <ul className="divide-y divide-border border-y border-border">
            {demos
              .filter((d) => d.group === group)
              .map((d) => (
                <li key={d.slug}>
                  <Link
                    to={`/app/komponen/${d.slug}`}
                    className="min-h-11 gap-0.5 py-2 sm:flex-col sm:px-10 sm:items-baseline sm:gap-4 flex flex-col justify-center hover:bg-muted"
                  >
                    <span className="font-medium sm:w-40 sm:shrink-0">{d.title}</span>
                    <span className="text-sm text-muted-foreground">{d.summary}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
