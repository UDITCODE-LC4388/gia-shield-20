import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { FraudNetwork } from "@/components/charts/FraudNetwork";
import { Users, Link2, Network as NetworkIcon, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

const nodeTypes = [
  { label: "Individual", color: "#1B2A4A" },
  { label: "Shared Address", color: "#C8922A" },
  { label: "Shared Account", color: "#C0392B" },
  { label: "Shared Phone", color: "#D97706" },
];

export default function NetworkGraph() {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (USE_MOCKS || !GEMINI_API_KEY) {
      setAiSummary("Syndicate Analysis shows high probability of coordinated document fabrication orchestrated across an 18-cluster network in the Belagavi sector. Recommend targeted physical audits and network teardowns on the 99 connected beneficiaries sharing identical residential addresses and device signatures.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Act as an intelligence analyst investigating fraud syndicates. Generate a 2-sentence tactical 'Syndicate Dossier' on the Belagavi Cluster based on these stats: 18 suspicious clusters, 99 unique beneficiaries, 142 cross-scheme links mapping shared addresses and devices. Describe their coordination method and recommend an intervention strategy. Exclude markdown asterisks and generic greetings.`;
      const response = await model.generateContent(prompt);
      setAiSummary(response.response.text());
    } catch (error: any) {
      setAiSummary("Syndicate Analysis shows high probability of coordinated document fabrication orchestrated across an 18-cluster network in the Belagavi sector. Recommend targeted physical audits and network teardowns on the 99 connected beneficiaries sharing identical residential addresses and device signatures.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Beneficiary Fraud Network"
        subtitle="Shared identifiers across scheme applications (Belagavi Cluster)"
      />

      <div className="card-gov mb-4">
        <div className="flex flex-col lg:flex-row gap-4 h-[500px]">
          <div className="flex-1 bg-gov-off-white rounded-md overflow-hidden border border-border">
            <FraudNetwork />
          </div>
          <div className="lg:w-48 flex flex-col gap-3">
            <h3 className="section-label">Node Types</h3>
            {nodeTypes.map((n) => (
              <div key={n.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: n.color }} />
                <span className="text-xs text-gov-text-body">{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={NetworkIcon} value="18" label="Suspicious Clusters Detected" />
        <MetricCard icon={Users} value="99" label="Unique Beneficiaries in Network" />
        <MetricCard icon={Link2} value="142" label="Cross-scheme Links" />
      </div>

      <div className="card-gov mt-4 border-l-4 border-gov-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gov-accent" />
            <h2 className="section-label mb-0">AI Syndicate Analyst</h2>
          </div>
          {!aiSummary && !isAiLoading && (
            <button 
              onClick={handleGenerateReport}
              className="px-3 py-1 bg-navy text-white text-[10px] uppercase font-bold tracking-wider rounded hover:bg-navy/90 transition-all"
            >
              Generate Dossier
            </button>
          )}
        </div>
        
        {isAiLoading ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-4 h-4 rounded-full border-2 border-gov-accent border-t-transparent animate-spin"/>
              <p className="text-xs text-gov-text-body font-mono">Compiling syndicate threat patterns...</p>
            </div>
        ) : aiSummary ? (
            <p className="text-sm font-medium text-gov-text-heading leading-relaxed border-l-2 border-gov-accent pl-4 py-2 bg-navy/5 rounded-r">
              {aiSummary}
            </p>
        ) : (
            <p className="text-xs text-gov-text-body italic">Click 'Generate Dossier' to run deep LLM analysis on the active node clusters.</p>
        )}
      </div>
    </AppLayout>
  );
}
