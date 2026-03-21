"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthCheck } from "@/types";
import AnalysisLoader from "@/components/check/AnalysisLoader";
import ResultsCard from "@/components/check/ResultsCard";

export default function ResultsPage() {
  const { checkId } = useParams();

  const { data: check, error } = useQuery<AuthCheck>({
    queryKey: ["check", checkId],
    queryFn: () => api.getCheck(checkId as string),
    refetchInterval: (query) => {
      const status = (query.state.data as AuthCheck)?.processing_status;
      return status === "pending" || status === "processing" ? 3000 : false;
    },
    retry: 2,
  });

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Could not load results</h2>
        <p className="text-gray-500 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  if (!check || check.processing_status === "pending" || check.processing_status === "processing") {
    return <AnalysisLoader />;
  }

  if (check.processing_status === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Analysis failed</h2>
        <p className="text-gray-500 text-sm">
          Our AI service is temporarily unavailable. Please try again in a few minutes.
        </p>
      </div>
    );
  }

  return <ResultsCard check={check} />;
}
