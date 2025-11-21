import { redirect } from 'next/navigation';

export default async function StoryRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const storyId = slug?.[0] || '';
  redirect(`/app-link-redirect?type=story&id=${encodeURIComponent(storyId)}`);
}

