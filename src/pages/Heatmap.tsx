import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DistrictGridMap } from "@/components/charts/DistrictGridMap";
import { Map, AlertCircle } from "lucide-react";

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

      <div className="card-gov border-l-4 border-gov-accent">
        <div className="flex gap-4 items-start">
          <AlertCircle className="text-gov-accent flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-gov-text-heading mb-1">Audit Advisory</h3>
            <p className="text-xs text-gov-text-body leading-relaxed">
              High-intensity clusters detected in **Northern Karnataka** (Kalaburagi, Bidar). Recommended action: 
              Deploy additional field verification units for PM-KISAN scheme audits in these zones.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
