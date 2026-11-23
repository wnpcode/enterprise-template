import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@wnp_code/design-system";
import { Link } from "react-router";
import { DemoSection } from "../DemoSection";

const jejak = (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/app">Dashboard</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/app/siswa">Siswa</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Aisyah Putri</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

export function BreadcrumbDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Dengan Link react-router">{jejak}</DemoSection>
      <DemoSection title="Di atas judul halaman (prop breadcrumb di PageHeader)">
        <div className="space-y-1 pb-6 border-b border-border">
          <div className="mb-2">{jejak}</div>
          <p className="text-2xl font-semibold tracking-tight">Aisyah Putri</p>
          <p className="text-sm text-muted-foreground">X IPA 1, terdaftar 1 Jul 2026.</p>
        </div>
      </DemoSection>
    </div>
  );
}
