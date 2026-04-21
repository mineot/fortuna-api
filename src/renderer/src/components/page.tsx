import type { PropsWithChildren } from 'react';

type PageProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export function Page(params: PageProps) {
  const { title, description, children } = params;

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">{title}</h1>
        <p className="description">{description}</p>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
