import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { FileText, Download, Printer, Search, Filter } from "lucide-react";
import { RiskBadge } from "@/components/ui/RiskBadge";

interface AuditRecord {
  id: string;
  aadhaar_hash: string;
  beneficiary_name: string;
  verdict: string;
  verified_at: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xumlcfkmrlbwarbarpha.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export default function AuditCertificates() {
  const [certs, setCerts] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCerts() {
      try {
        setLoading(true);
        if (USE_MOCKS) {
          setCerts([
            { id: "1", beneficiary_name: "Ramesh Kumar Patil", aadhaar_hash: "AADH201", verdict: "FLAGGED", verified_at: new Date().toISOString() },
            { id: "2", beneficiary_name: "Anita B. Deshmukh", aadhaar_hash: "AADH202", verdict: "ELIGIBLE", verified_at: new Date(Date.now() - 3600000).toISOString() },
            { id: "3", beneficiary_name: "Suresh M. Naik", aadhaar_hash: "AADH203", verdict: "CRITICAL", verified_at: new Date(Date.now() - 7200000).toISOString() }
          ]);
          return;
        }

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/verifications?order=verified_at.desc&select=id,aadhaar_hash,beneficiary_name,verdict,verified_at`,
          { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }}
        );
        const data = await res.json();
        setCerts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  return (
    <AppLayout>
      <PageHeader 
        title="Audit Certificate Repository" 
        subtitle="Cryptographically signed verification certificates and compliance trails"
      />

      <div className="flex justify-between flex-wrap gap-4 mb-6">
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gov-text-body opacity-50 group-focus-within:text-gov-accent transition-all" size={16} />
          <input 
            type="text" 
            placeholder="Search by GIA-ID, Name or Aadhaar..." 
            className="w-full bg-white border border-border rounded-md px-10 py-2.5 text-xs text-gov-text-heading focus:outline-none focus:ring-1 focus:ring-gov-accent transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 text-xs font-bold px-4 py-2 border-border shadow-sm active:scale-95 transition-all">
                <Filter size={14} />
                Filters
            </button>
            <button className="btn-primary-gov flex items-center gap-2 text-xs font-bold px-4 py-2 bg-navy text-white shadow-sm active:scale-95 transition-all">
                <Printer size={14} />
                Bulk Print
            </button>
        </div>
      </div>

      <div className="card-gov overflow-hidden border-border p-0">
         <table className="w-full text-xs font-medium text-gov-text-body">
            <thead>
               <tr className="bg-gov-off-white/80 border-b border-border shadow-sm">
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Certificate GIA-ID</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Beneficiary Name</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Aadhaar Ref</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Status Verdict</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Audit Date</th>
                  <th className="py-4 px-6 text-center text-[10px] font-black uppercase text-gov-text-heading tracking-widest">Action</th>
               </tr>
            </thead>
            <tbody>
               {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center animate-pulse tracking-widest text-[10px] font-black text-gov-text-body uppercase opacity-50">
                       Fetching Blockchain Verified Certificates...
                    </td>
                  </tr>
               ) : certs.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-navy/5 bg-white transition-all group">
                     <td className="py-4 px-6 font-mono text-[10px] text-gov-accent font-bold group-hover:scale-105 transition-transform origin-left">GIA-{c.id.slice(0, 8)}</td>
                     <td className="py-4 px-6 text-gov-text-heading font-bold text-[13px]">{c.beneficiary_name}</td>
                     <td className="py-4 px-6 text-gov-text-body font-mono text-[11px] opacity-70">XXXX-XXXX-{c.aadhaar_hash.slice(-4)}</td>
                     <td className="py-4 px-6"><RiskBadge level={c.verdict as any} /></td>
                     <td className="py-4 px-6 opacity-60 text-[11px]">{new Date(c.verified_at).toLocaleDateString()}</td>
                     <td className="py-4 px-6">
                        <div className="flex gap-2 justify-center">
                           <button title="View Details" className="p-2 hover:bg-white bg-gov-off-white transition-all rounded-md shadow-sm active:scale-90">
                              <FileText size={14} className="text-gov-text-heading" />
                           </button>
                           <button title="Download PDF" className="p-2 hover:bg-gov-success bg-gov-off-white hover:text-white transition-all rounded-md shadow-sm active:scale-90">
                              <Download size={14} className="text-gov-text-heading" />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-gov bg-navy/5 border-dashed border-2 flex flex-col justify-center items-center py-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-navy/40">Repository Capacity</p>
              <h4 className="text-3xl font-black text-navy/80 mt-1">98%</h4>
          </div>
          <div className="card-gov bg-navy/5 border-dashed border-2 flex flex-col justify-center items-center py-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-navy/40">Monthly Exports</p>
              <h4 className="text-3xl font-black text-navy/80 mt-1">1,402</h4>
          </div>
          <div className="card-gov bg-navy/5 border-dashed border-2 flex flex-col justify-center items-center py-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-navy/40">Cert Signature Key</p>
              <h4 className="text-[10px] font-mono text-gov-success mt-2 break-all px-4 text-center">0xDF82...A29C (Valid)</h4>
          </div>
      </div>
    </AppLayout>
  );
}
