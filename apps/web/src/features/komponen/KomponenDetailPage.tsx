import { Link, useParams } from "react-router";
import { PageHeader } from "@enterprise/design-system";
import { NotFoundPage } from "../../shared/NotFoundPage";
import { demos } from "./demos";

const linkClass = "text-primary underline-offset-4 hover:underline";

export function KomponenDetailPage() {
  const { slug } = useParams();
  const index = demos.findIndex((d) => d.slug === slug);
  if (index === -1) return <NotFoundPage />;
  const { title, summary, Demo } = demos[index];
  const prev = demos[index - 1];
  const next = demos[index + 1];

  return (
    <div className="space-y-8">
      <PageHeader title={title} description={summary} />
      <Demo key={slug} />
      <nav aria-label="Komponen lain" className="gap-x-6 gap-y-2 pt-6 text-sm flex flex-wrap border-t border-border">
        <Link to="/app/komponen" className={linkClass}>
          Semua komponen
        </Link>
        {prev && (
          <Link to={`/app/komponen/${prev.slug}`} className={linkClass}>
            Sebelumnya: {prev.title}
          </Link>
        )}
        {next && (
          <Link to={`/app/komponen/${next.slug}`} className={linkClass}>
            Berikutnya: {next.title}
          </Link>
        )}
      </nav>
    </div>
  );
}
