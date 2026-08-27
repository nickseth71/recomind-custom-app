import { Card, Eyebrow } from "../UI";

export default function ReasoningCard({ text, className = "" }) {
  return (
    <Card className={`p-5 ${className}`}>
      <Eyebrow className="mb-3">AI Reasoning</Eyebrow>
      <div className="relative pl-4 border-l-2 border-primary/30">
        <p className="text-[13px] font-mono-sm text-on-surface leading-relaxed italic">
          {text || "No reasoning available."}
        </p>
      </div>
    </Card>
  );
}
