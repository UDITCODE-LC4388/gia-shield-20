import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Low Risk", value: 145, color: "#2D6A4F" },
  { name: "Medium Risk", value: 58, color: "#D97706" },
  { name: "High Risk", value: 28, color: "#C0392B" },
  { name: "Critical", value: 16, color: "#962D22" },
];

export function DistributionDonut() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          dataKey="value"
          strokeWidth={2}
          stroke="#FFFFFF"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-gov-text-body">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
