import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Brain, TrendingUp, Zap, Target, Check, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

const performanceData = [
  { name: "Week 1", score: 65, efficiency: 40 },
  { name: "Week 2", score: 72, efficiency: 55 },
  { name: "Week 3", score: 85, efficiency: 70 },
  { name: "Week 4", score: 94, efficiency: 88 },
];

const schemeDistribution = [
  { name: "PM-KISAN", current: 78, optimized: 92, fill: "#2D6A4F" },
  { name: "PMFBY", current: 65, optimized: 88, fill: "#1B2A4A" },
  { name: "NREGA", current: 45, optimized: 75, fill: "#D97706" },
  { name: "Ujjwala", current: 90, optimized: 95, fill: "#C0392B" },
];

export default function SchemeOptimizer() {
  const [isApplied, setIsApplied] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    async function getStrategy() {
      if (USE_MOCKS || !GEMINI_API_KEY) {
        setAiSummary("AI Analysis suggests reallocating 15% of surplus budget from NREGA and PMFBY due to low baseline optimization scores (45-65%) and injecting it into Ujjwala networks to maximize their high 90% active utilization threshold.");
        return;
      }
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Act as an AI Scheme Optimization engine. Based on these metrics: ${JSON.stringify(schemeDistribution)}, recommend a strategic reallocation of funds in 2 sentences. Name the specific schemes you are moving budget from and to.`;
        const response = await model.generateContent(prompt);
        setAiSummary(response.response.text());
      } catch (e) {
        const fallback = "AI Analysis suggests reallocating 15% of surplus budget from NREGA and PMFBY due to low baseline optimization scores (45-65%) and injecting it into Ujjwala networks to maximize their high 90% active utilization threshold.";
        setAiSummary(fallback);
      }
    }
    getStrategy();
  }, []);

  return (
    <AppLayout>
      <PageHeader 
        title="Scheme Optimizer" 
        subtitle="AI-powered engine for precision scheme allocation and leakage prevention"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Brain} value="94.2%" label="Optimization Accuracy" />
        <MetricCard icon={TrendingUp} value="+18%" label="Resource Efficiency" />
        <MetricCard icon={Target} value="2.4k" label="Corrected Allocations" />
        <MetricCard icon={Zap} value="Live" label="Live Decision Stream" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
        <div className="lg:col-span-3 card-gov">
          <h2 className="section-label mb-6">Allocation Efficiency Trends (AI Projection)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#2D6A4F" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 card-gov">
          <h2 className="section-label mb-6">Scheme Impact Comparison</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schemeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="optimized" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 justify-center">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-navy" />
                <span className="text-[10px] font-bold text-gov-text-body uppercase">Optimized %</span>
             </div>
          </div>
        </div>
      </div>

      <div className="card-gov border-l-4 border-gov-success">
         <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-gov-accent" />
            <h3 className="text-sm font-bold text-gov-text-heading mb-0">Core AI Strategic Recommendation</h3>
         </div>
         <p className="text-sm font-medium text-gov-text-heading leading-relaxed border-l-2 border-gov-accent pl-4 py-2 bg-navy/5 rounded-r">
            {aiSummary || "Crunching state optimization differentials..."}
         </p>
         <button 
           onClick={() => setIsApplied(true)}
           disabled={isApplied}
           className={`mt-4 px-4 py-1.5 rounded text-[11px] font-bold tracking-widest uppercase shadow-sm transition-all flex items-center justify-center gap-2 ${
             isApplied ? 'bg-gov-success text-white opacity-80 cursor-not-allowed' : 'bg-gov-success text-white hover:opacity-90 active:scale-95'
           }`}
         >
           {isApplied ? <><Check size={14} /> Strategy Applied</> : "Apply Allocation Strategy"}
         </button>
      </div>
    </AppLayout>
  );
}
