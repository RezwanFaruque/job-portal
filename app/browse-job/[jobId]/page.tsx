import JobDetailsContent from "@/components/features/JobDetailsContent";
import JobSearchBannar from "@/components/features/JobSearchBannar";

interface JobDetailsPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = await params;

  return (
    <div className="layout-body browse-page-modern">
      <JobSearchBannar />
      <JobDetailsContent jobId={jobId} />
    </div>
  );
}
