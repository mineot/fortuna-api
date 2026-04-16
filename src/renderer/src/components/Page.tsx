import type { PropsWithChildren } from 'react';

type PageProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function Page({ title, description, children }: PageProps) {
  return (
    <section className="page">
      <h2 className="page-title">{title}</h2>
      {description ? <p className="page-description">{description}</p> : ''}
      <div>{children}</div>
    </section>
  );
}
