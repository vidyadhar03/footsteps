import { redirect } from 'next/navigation';

export default async function UserRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const userId = slug?.[0] || '';
  redirect(`/app-link-redirect?type=user&id=${encodeURIComponent(userId)}`);
}

