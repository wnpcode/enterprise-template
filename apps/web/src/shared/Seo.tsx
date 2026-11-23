import { env } from "../app/env";

type Props = {
  title: string;
  description?: string;
  /** true untuk halaman yang tidak boleh diindeks (area aplikasi). */
  noindex?: boolean;
};

// React 19 memindahkan <title> dan <meta> ke <head>; tidak perlu react-helmet
export function Seo({ title, description, noindex }: Props) {
  const fullTitle = title.includes(env.VITE_APP_NAME) ? title : `${title} | ${env.VITE_APP_NAME}`;
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/pwa-512.png" />
    </>
  );
}
