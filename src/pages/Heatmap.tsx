import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DistrictGridMap } from "@/components/charts/DistrictGridMap";
import { Map, AlertCircle, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

<<<<<<< HEAD
=======
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

>>>>>>> 36e2a4b442043003667da50e1773e0f7cecf923d
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xumlcfkmrlbwarbarpha.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

interface DistrictStats {
  district: string;
  rate: number;
  fraud: number;
  total: number;
}

const topDistricts = [
  { name: "Belagavi", score: 87 },
  { name: "Raichur", score: 76 },
  { name: "Kalaburagi", score: 71 },
  { name: "Ballari", score: 64 },
  { name: "Yadgir", score: 58 },
];

export default function Heatmap() {
  const [districtStats, setDistrictStats] = useState<DistrictStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    async function loadHeatmapData() {
      try {
        setLoading(true);
        if (USE_MOCKS) {
          const mockStats = [
            { district: "Belagavi", rate: 87, fraud: 15, total: 17 },
            { district: "Raichur", rate: 76, fraud: 11, total: 14 },
            { district: "Kalaburagi", rate: 71, fraud: 18, total: 25 },
            { district: "Ballari", rate: 64, fraud: 9, total: 14 },
            { district: "Yadgir", rate: 58, fraud: 7, total: 12 }
          ];
          setDistrictStats(mockStats);
          setLoading(false);
          return;
        }

        const [vRes, bRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/verifications?select=aadhaar_hash,verdict`, { 
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } 
          }),
          fetch(`${SUPABASE_URL}/rest/v1/beneficiaries?select=aadhaar_hash,district`, { 
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } 
          })
        ]);

        const verifications = await vRes.json();
        const beneficiaries = await bRes.json();

        // Build mapping
        const districtMap: Record<string, string> = {};
        beneficiaries.forEach((b: any) => { districtMap[b.aadhaar_hash] = b.district; });

        // Seed with provided mock data for demo
        const fraudByDistrict: Record<string, { total: number; fraud: number }> = {
            'Kalaburagi': { total: 12, fraud: 8 },
            'Bidar': { total: 9, fraud: 6 },
            'Raichur': { total: 11, fraud: 7 },
            'Vijayapura': { total: 8, fraud: 4 },
            'Belagavi': { total: 15, fraud: 6 },
            'Dharwad': { total: 10, fraud: 3 },
            'Mysuru': { total: 14, fraud: 4 },
            'Bengaluru': { total: 20, fraud: 5 },
            'Hassan': { total: 7, fraud: 2 }
        };

        // Overlay real data
        verifications.forEach((v: any) => {
          const district = districtMap[v.aadhaar_hash];
          if (district) {
            if (!fraudByDistrict[district]) fraudByDistrict[district] = { total: 0, fraud: 0 };
            fraudByDistrict[district].total++;
            if (v.verdict !== 'ELIGIBLE') fraudByDistrict[district].fraud++;
          }
        });

        const sorted = Object.entries(fraudByDistrict)
          .map(([district, data]) => ({
            district,
            rate: Math.round((data.fraud / data.total) * 100),
            fraud: data.fraud,
            total: data.total
          }))
          .sort((a, b) => b.rate - a.rate);

        setDistrictStats(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadHeatmapData();

    // AI Predictive Geo-Analyst
    setTimeout(async () => {
      if (USE_MOCKS || !GEMINI_API_KEY) {
        setAiAnalysis("Spatio-temporal analysis indicates high-risk saturation in the Northern Corridor. Recommend immediate cross-district task force mobilization for Belagavi and Kalaburagi segments.");
        return;
      }
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Act as a geospatial fraud expert. Analyze these district fraud rates for Karnataka GIA: Kalaburagi (67%), Bidar (67%), Raichur (64%), Belagavi (40%). Provide a 1-sentence predictive warning and 1-sentence tactical recommendation for field deployment.`;
        const response = await model.generateContent(prompt);
        setAiAnalysis(response.response.text());
      } catch (e) {
        setAiAnalysis("Spatio-temporal analysis indicates high-risk saturation in the Northern Corridor. Recommend immediate cross-district task force mobilization for Belagavi and Kalaburagi segments.");
      }
    }, 2000);
  }, []);

  return (
    <AppLayout>
      <PageHeader
        title="Fraud Density Heatmap"
        subtitle="Spatio-temporal analysis of scheme exploitation across Karnataka"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="card-gov flex flex-col">
          <h2 className="section-label mb-6">Geographic Distribution (Interactive)</h2>
          <div className="flex-1 min-h-[400px]">
             <DistrictGridMap />
          </div>
        </div>

        <div className="card-gov flex flex-col">
          <h2 className="section-label mb-6">Fraud Intensity by District</h2>
          <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
                <div className="flex items-center justify-center h-full text-gov-text-body text-xs animate-pulse">
                    Synchronizing District Geo-Data...
                </div>
            ) : districtStats.map((item) => {
              const color = item.rate > 60 ? '#ef4444' : item.rate > 40 ? '#f59e0b' : item.rate > 20 ? '#eab308' : '#22c55e';
              return (
                <div key={item.district} className="space-y-1 group">
                  <div className="flex justify-between text-[11px] font-bold text-gov-text-body uppercase tracking-tight">
                    <span>{item.district}</span>
                    <span className="text-gov-text-heading">{item.fraud}/{item.total} cases</span>
                  </div>
                  <div className="h-6 bg-navy/5 rounded overflow-hidden flex items-center relative">
                    <div 
                        className="h-full transition-all duration-1000 ease-out flex items-center px-3"
                        style={{ width: `${item.rate}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}44` }}
                    >
                        <span className="text-[10px] text-white font-black">{item.rate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-gov border-l-4 border-gov-accent bg-navy/5">
        <div className="flex gap-4 items-start">
          <div className="bg-gov-accent p-2 rounded shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-gov-text-heading mb-1 uppercase tracking-widest">AI Predictive Geo-Analyst</h3>
            <p className="text-sm font-medium text-gov-text-heading leading-relaxed border-l-2 border-gov-accent pl-4 py-1 italic">
              {aiAnalysis || "Synthesizing regional fraud density models..."}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
