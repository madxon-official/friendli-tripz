import { redirect } from 'next/navigation';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  if (q) {
    redirect(`/packages?searchQuery=${encodeURIComponent(q)}`);
  } else {
    redirect('/packages');
  }
}
