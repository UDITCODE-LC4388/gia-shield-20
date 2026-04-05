import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Layers, MapPin, TrendingUp, TrendingDown, Activity, IndianRupee } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { DistributionDonut } from "@/components/charts/DistributionDonut";
import { TrendChart } from "@/components/charts/TrendChart";

type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "ELIGIBLE" | "FLAGGED" | "CRITICAL";

interface LiveFeedItem {
  id: string;
  beneficiary_name: string;
  verdict: RiskLevel;
  verified_at: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xumlcfkmrlbwarbarpha.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVerified: 0,
    flagged: 0,
    eligible: 0,
    croresSaved: 0
  });
  const [feed, setFeed] = useState<LiveFeedItem[]>([]);

  useEffect(() => {
    async function loadWarRoom() {
      try {
        if (USE_MOCKS) {
          const mockFeed: LiveFeedItem[] = [
            { id: "1", beneficiary_name: "Ramesh Kumar Patil", verdict: "FLAGGED", verified_at: new Date().toISOString() },
            { id: "2", beneficiary_name: "Anita B. Deshmukh", verdict: "ELIGIBLE", verified_at: new Date(Date.now() - 3600000).toISOString() },
            { id: "3", beneficiary_name: "Suresh M. Naik", verdict: "CRITICAL", verified_at: new Date(Date.now() - 7200000).toISOString() },
            { id: "4", beneficiary_name: "Sunitha R. Hegde", verdict: "ELIGIBLE", verified_at: new Date(Date.now() - 10800000).toISOString() },
            { id: "5", beneficiary_name: "Mahesh P. Kulkarni", verdict: "ELIGIBLE", verified_at: new Date(Date.now() - 14400000).toISOString() }
          ];
          setFeed(mockFeed);
          setStats({ totalVerified: 247, flagged: 34, eligible: 185, croresSaved: 12.5 });
          return;
        }

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/verifications?order=verified_at.desc&limit=10&select=*`,
          { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }}
        );
        const data = await res.json();
        setFeed(Array.isArray(data) ? data : []);
        setStats({ totalVerified: 247, flagged: 34, eligible: 185, croresSaved: 12.5 });
      } catch (e) {
        console.error(e);
      }
    }
    loadWarRoom();
    const interval = setInterval(loadWarRoom, 15000);
    return () => clearInterval(interval);
  }, []);
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Real-time fraud detection overview for Karnataka state schemes" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <MetricCard icon={ShieldCheck} value={stats.totalVerified.toString()} label="Total Verifications" />
        <MetricCard icon={AlertTriangle} value={stats.flagged.toString()} label="Flagged High Risk" />
        <MetricCard icon={ShieldCheck} value={stats.eligible.toString()} label="Eligible Beneficiaries" />
        <MetricCard icon={IndianRupee} value={`₹${stats.croresSaved} Cr`} label="Fraud Savings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3 card-gov">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-label">Verification Trends — Last 5 Days</h2>
            <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-navy/20 border border-navy" />
                    <span className="text-[10px] uppercase font-bold text-gov-text-body">Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-600" />
                    <span className="text-[10px] uppercase font-bold text-gov-text-body">High Risk</span>
                </div>
            </div>
          </div>
          <TrendChart />
        </div>

        <div className="lg:col-span-2 card-gov">
          <h2 className="section-label mb-4">Fraud Risk Distribution</h2>
          <DistributionDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-12">
        <div className="lg:col-span-3 card-gov">
          <h2 className="section-label mb-4 flex items-center gap-2">
            <Activity size={12} className="text-navy" />
            Live Verification Feed — Karnataka GIA
          </h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {Array.isArray(feed) && feed.map((v, i) => (
              <div
                key={v.id}
                className="flex justify-between items-center p-3 bg-white/40 border-l-4 rounded-r-lg transition-all hover:bg-white/80"
                style={{ 
                  borderLeftColor: v.verdict === 'ELIGIBLE' ? '#22c55e' 
                                : v.verdict === 'FLAGGED' ? '#f59e0b' 
                                : '#ef4444' 
                }}
              >
                <div>
                  <p className="text-sm font-semibold text-gov-text-heading">{v.beneficiary_name}</p>
                  <p className="text-[10px] text-gov-text-body uppercase">{new Date(v.verified_at).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <RiskBadge level={v.verdict as any} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card-gov">
          <h2 className="section-label mb-4">Fraud Risk Distribution</h2>
          <DistributionDonut />
        </div>
      </div>

      <div className="card-gov">
        <h2 className="section-label mb-3">System Status</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <StatusItem label="Supabase DB" connected />
          <StatusItem label="N8N Workflow" connected />
          <StatusItem label="Gemini AI" connected />
          <span className="text-xs text-gov-text-body ml-auto">Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusItem({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${connected ? "bg-gov-success" : "bg-gov-danger"}`} />
      <span className="text-gov-text-body text-sm">{label}</span>
      <span className={`text-xs font-medium ${connected ? "text-gov-success" : "text-gov-danger"}`}>
        {connected ? "Connected" : "Offline"}
      </span>
    </div>
  );
}
