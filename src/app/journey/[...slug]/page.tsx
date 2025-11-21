import { redirect } from 'next/navigation';

export default async function JourneyRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const journeyId = slug?.[0] || '';
  redirect(`/app-link-redirect?type=journey&id=${encodeURIComponent(journeyId)}`);
}

