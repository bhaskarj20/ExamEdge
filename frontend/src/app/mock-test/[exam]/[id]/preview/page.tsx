"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function PreviewPage() {
  const { exam, id } = useParams();
  const [mock, setMock] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/mockexam/load/${exam}/${id}`)
      .then((r) => r.json())
      .then((d) => d.success && setMock(d.mock));
  }, [exam, id]);

  if (!mock) return <div className="text-white text-center mt-40 text-2xl">Loading preview...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Preview: {mock.name}
      </h1>
      <div className="max-w-4xl mx-auto space-y-5">
        {mock.questions.map((q: any, i: number) => (
          <Card key={q.id} className="p-6 bg-white/5 border border-white/10">
            <p className="font-medium text-lg">
              <span className="text-blue-400 font-bold">{i + 1}.</span>{" "}
              <span dangerouslySetInnerHTML={{ __html: q.question }} />
            </p>
            {q.type === "integer" && (
              <p className="mt-3 text-yellow-400 font-medium">→ Numerical Answer Type</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}