import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description?: string;
};

export function PageMeta({ title, description }: PageMetaProps) {
  const full = title.includes("Emmanuel") ? title : `${title} | Emmanuel Ocheme`;
  return (
    <Helmet>
      <title>{full}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Helmet>
  );
}
