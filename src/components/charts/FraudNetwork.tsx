import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AlertCircle, Terminal } from "lucide-react";

interface Beneficiary {
  aadhaar_hash: string;
  full_name: string;
  district: string;
  phone: string;
  bank_account: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  district: string;
  phone: string;
  bank: string;
  flagged: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  type: 'PHONE' | 'BANK';
  label: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xumlcfkmrlbwarbarpha.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export const FraudNetwork = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDataAndDraw() {
      try {
        setLoading(true);
        if (USE_MOCKS) {
<<<<<<< HEAD
          const mockPeople: Beneficiary[] = [
            { aadhaar_hash: "H1", full_name: "Ramesh P.", district: "Mysuru", phone: "9876543100", bank_account: "B1" },
            { aadhaar_hash: "H2", full_name: "Anita B.", district: "Belagavi", phone: "9876543100", bank_account: "B2" },
            { aadhaar_hash: "H3", full_name: "Suresh M.", district: "Kalaburagi", phone: "9876543101", bank_account: "B1" },
            { aadhaar_hash: "H4", full_name: "Lakshmi R.", district: "Bidar", phone: "9876543102", bank_account: "B3" },
            { aadhaar_hash: "H5", full_name: "Mahesh P.", district: "Tumakuru", phone: "9876543102", bank_account: "B3" }
          ];
          
          const nodes: Node[] = mockPeople.map(p => ({
            id: p.aadhaar_hash, name: p.full_name, district: p.district, phone: p.phone, bank: p.bank_account, flagged: false
          }));

          const links: Link[] = [
            { source: "H1", target: "H2", type: "PHONE", label: "Shared Phone" } as Link,
            { source: "H1", target: "H3", type: "BANK", label: "Shared Bank" } as Link,
            { source: "H4", target: "H5", type: "PHONE", label: "Shared Phone" } as Link,
            { source: "H4", target: "H5", type: "BANK", label: "Shared Bank" } as Link
          ];

          nodes.forEach(n => {
            if (["H1", "H2", "H3", "H4", "H5"].includes(n.id)) n.flagged = true;
=======
          // Procedurally generate the massive 99-node structural neural network
          const nodes: Node[] = Array.from({ length: 99 }).map((_, i) => ({
            id: `N${i}`,
            name: `UID_${(1000 + i)}`,
            district: ["Belagavi", "Mysuru", "Bidar", "Kalaburagi"][i % 4],
            phone: `P_${Math.floor(i / 4)}`, // Clusters of 4 share a phone
            bank: `B_${Math.floor(i / 6)}`,  // Clusters of 6 share a bank
            flagged: false
          }));

          const links: Link[] = [];
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              if (nodes[i].phone === nodes[j].phone && Math.random() > 0.3) {
                links.push({ source: nodes[i].id, target: nodes[j].id, type: 'PHONE', label: 'Shared Phone' } as Link);
              }
              if (nodes[i].bank === nodes[j].bank && Math.random() > 0.4) {
                links.push({ source: nodes[i].id, target: nodes[j].id, type: 'BANK', label: 'Shared Bank' } as Link);
              }
            }
          }

          // Ensure exactly 142 connections form
          while(links.length > 142) links.pop();

          // Flag interconnected entities to render red
          const flaggedIds = links.flatMap(l => [
            typeof l.source === 'string' ? l.source : (l.source as any).id,
            typeof l.target === 'string' ? l.target : (l.target as any).id
          ]);
          
          nodes.forEach(n => {
            if (flaggedIds.includes(n.id)) n.flagged = true;
>>>>>>> 36e2a4b442043003667da50e1773e0f7cecf923d
          });

          drawNetwork(nodes, links);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/beneficiaries?select=*`,
          { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }}
        );
        
        if (!res.ok) throw new Error("Failed to fetch beneficiaries");
        const people: Beneficiary[] = await res.json();

        // Build nodes
        const nodes: Node[] = people.map(p => ({
          id: p.aadhaar_hash,
          name: p.full_name,
          district: p.district,
          phone: p.phone,
          bank: p.bank_account,
          flagged: false
        }));

        // Build links — connect people who share phone or bank
        const links: Link[] = [];
        for (let i = 0; i < people.length; i++) {
          for (let j = i + 1; j < people.length; j++) {
            if (people[i].phone === people[j].phone) {
              links.push({
                source: people[i].aadhaar_hash,
                target: people[j].aadhaar_hash,
                type: 'PHONE',
                label: 'Shared Phone'
              });
            }
            if (people[i].bank_account === people[j].bank_account) {
              links.push({
                source: people[i].aadhaar_hash,
                target: people[j].aadhaar_hash,
                type: 'BANK',
                label: 'Shared Bank'
              });
            }
          }
        }

        // Mark flagged nodes
        const flaggedIds = links.flatMap(l => [
          typeof l.source === 'string' ? l.source : (l.source as any).id,
          typeof l.target === 'string' ? l.target : (l.target as any).id
        ]);
        
        nodes.forEach(n => {
          if (flaggedIds.includes(n.id)) n.flagged = true;
        });

        drawNetwork(nodes, links);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    function drawNetwork(nodes: Node[], links: Link[]) {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const width = container.offsetWidth || 800;
      const height = 500;

      // Clear previous
      d3.select(container).selectAll('*').remove();

      const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#0f172a')
        .style('border-radius', '12px');

      // Add an interactive generic container for pan & zoom capability 
      const g = svg.append('g');

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 5])
        .on('zoom', (event) => {
           g.attr('transform', event.transform);
        });

      svg.call(zoom);

      // Glow filter
      const defs = svg.append('defs');
      const filter = defs.append('filter').attr('id', 'glow');
      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink<Node, Link>(links)
          .id(d => d.id)
          .distance(200))
        .force('charge', d3.forceManyBody().strength(-800))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(40).iterations(3));

      // Draw links
      const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', d => d.type === 'PHONE' ? '#f59e0b' : '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,3')
        .style('filter', 'url(#glow)');

      // Link labels
      const linkLabel = g.append('g')
        .selectAll('text')
        .data(links)
        .enter().append('text')
        .attr('font-size', '9px')
        .attr('fill', '#94a3b8')
        .attr('text-anchor', 'middle')
        .text(d => d.label);

      // Draw nodes
      const node = g.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 16)
        .attr('fill', d => d.flagged ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)')
        .attr('stroke', d => d.flagged ? '#ef4444' : '#22c55e')
        .attr('stroke-width', 2)
        .style('filter', 'url(#glow)')
        .call(d3.drag<SVGCircleElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any);

      // Node labels
      const label = g.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('font-size', '10px')
        .attr('fill', '#e2e8f0')
        .attr('text-anchor', 'middle')
        .attr('dy', '28px')
        .text(d => d.name.split(' ')[0]);

      simulation.on('tick', () => {

        link
          .attr('x1', d => (d.source as any).x)
          .attr('y1', d => (d.source as any).y)
          .attr('x2', d => (d.target as any).x)
          .attr('y2', d => (d.target as any).y);

        linkLabel
          .attr('x', d => ((d.source as any).x + (d.target as any).x) / 2)
          .attr('y', d => ((d.source as any).y + (d.target as any).y) / 2);

        node
          .attr('cx', d => d.x!)
          .attr('cy', d => d.y!);

        label
          .attr('x', d => d.x!)
          .attr('y', d => d.y!);
      });

      function dragstarted(event: any, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      }
      function dragged(event: any, d: Node) {
        d.fx = event.x; d.fy = event.y;
      }
      function dragended(event: any, d: Node) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      }
    }

    fetchDataAndDraw();
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={containerRef} className="w-full h-full" id="fraudNetwork" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy/20 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
              <p className="text-[10px] uppercase font-bold text-gov-text-heading tracking-widest">Compiling Neural Network...</p>
           </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/50">
           <div className="text-center p-6 card-gov border-red-200">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-red-600">Sync Failure</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 btn-primary-gov scale-75"
              >
                 Retry Handshake
              </button>
           </div>
        </div>
      )}

      <div className="absolute top-4 left-4 pointer-events-none">
          <div className="flex items-center gap-2 px-2 py-1 bg-navy/80 rounded border border-white/10">
              <Terminal size={10} className="text-gov-success" />
              <span className="text-[9px] font-mono text-white/50 lowercase tracking-tighter">live_stream_connected: true</span>
          </div>
      </div>
    </div>
  );
};
