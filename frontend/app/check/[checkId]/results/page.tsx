"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthCheck } from "@/types";
import AnalysisLoader from "@/components/check/AnalysisLoader";
import ResultsCard from "@/components/check/ResultsCard";
import Link from "next/link";

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
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-extrabold text-[#111] mb-2 font-syne">Could not load results</h2>
        <p className="text-[#888] text-sm mb-6">{(error as Error).message}</p>
        <Link href="/check" className="text-sm text-[#aaa] hover:text-[#111] transition-colors">← Try again</Link>
      </div>
    );
  }

  if (!check || check.processing_status === "pending" || check.processing_status === "processing") {
    return <AnalysisLoader />;
  }

  if (check.processing_status === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 bg-[#fef2f2] border border-[#fecaca] rounded-full flex items-center justify-center mx-auto mb-5 text-xl text-[#dc2626]">
          ✗
        </div>
        <h2 className="text-xl font-extrabold text-[#111] mb-2 font-syne">Analysis failed</h2>
        <p className="text-[#888] text-sm mb-6">Our AI service is temporarily unavailable. Please try again in a few minutes.</p>
        <Link href="/check" className="btn-primary inline-block px-8 py-3 text-sm">Try again →</Link>
      </div>
    );
  }

  return <ResultsCard check={check} />;
}
