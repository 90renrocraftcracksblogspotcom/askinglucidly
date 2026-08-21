import ClientPage from "./client-page";

export function generateStaticParams() {
  return [{ slug: "dummy" }];
}

export default function Page() {
  return <ClientPage />;
}
