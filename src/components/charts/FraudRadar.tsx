import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface FraudRadarProps {
  data: { dimension: string; score: number }[];
}

export function FraudRadar({ data }: FraudRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#4A5568", fontSize: 11, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "#94A3B8", fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          dataKey="score"
          stroke="#C0392B"
          fill="#C0392B"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
