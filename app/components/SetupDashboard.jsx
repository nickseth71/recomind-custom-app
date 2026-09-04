import {
  ArrowRight,
  BarChart3,
  Box,
  Hand,
  Play,
  Search,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

const setupSteps = [
  {
    number: "1",
    icon: Box,
    title: "Add your products",
    description:
      "Import or manually add the products you want to track in AI search results.",
    action: "Go to Products",
    tone: "blue",
    path: "/app/products",
  },
  {
    number: "2",
    icon: Search,
    title: "Run your first scan",
    description:
      "Scan your products to see how AI engines like ChatGPT and Gemini respond to buyer searches.",
    action: "Scan Products",
    tone: "green",
    path: "/app/products",
  },
  {
    number: "3",
    icon: Trophy,
    title: "Review opportunities",
    description:
      "See which buyer intents you win and which ones you're missing — then fix them.",
    action: "View Opportunities",
    tone: "orange",
    path: "/app/promptwins",
  },
];

const unlocks = [
  {
    icon: BarChart3,
    title: "Buyer Demand Score",
    description:
      "A single score showing how visible your products are across AI search engines.",
  },
  {
    icon: Zap,
    title: "Prompt Intelligence",
    description:
      "Discover the exact buyer searches where competitors beat you — and how to close the gap.",
  },
  {
    icon: BarChart3,
    title: "Impact Tracking",
    description:
      "Track score improvements over time as you fix missing signals.",
  },
];

const toneStyles = {
  blue: "border-[#d5ddeb] text-[#405a9f] bg-[#f1f4fb]",
  green: "border-[#c9e2dd] text-[#007c72] bg-[#eff8f6]",
  orange: "border-[#f1d3bd] text-[#bd5a12] bg-[#fff6ef]",
};

function SetupStep({ item }) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <article
      className={`relative flex min-h-[178px] flex-col rounded-lg border bg-white p-4 shadow-sm ${item.tone === "blue" ? "border-[#d5ddeb]" : item.tone === "green" ? "border-[#c9e2dd]" : "border-[#f1d3bd]"}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full border text-[13px] ${toneStyles[item.tone]}`}
        >
          {item.number}
        </span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneStyles[item.tone]}`}
        >
          <Icon size={15} strokeWidth={1.8} />
        </span>
      </div>
      <h2 className="mt-4 text-[15px] font-semibold text-[#111d34]">
        {item.title}
      </h2>
      <p className="mt-1 max-w-[420px] text-[13px] leading-[1.45] text-[#63738b]">
        {item.description}
      </p>
      <button
        type="button"
        onClick={() => navigate(item.path)}
        className={`mt-auto flex w-fit items-center gap-2 cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-semibold ${toneStyles[item.tone]}`}
      >
        {item.action}
        <ArrowRight size={14} />
      </button>
    </article>
  );
}

export default function SetupDashboard() {
  const navigate = useNavigate();

  return (
    <div className="glass-surface min-h-full text-[#111d34]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-[21px] font-semibold leading-tight">
            <Hand size={21} className="text-[#db9a16]" /> Welcome to RecoMind
          </h1>
          <p className="mt-1 text-[14px] text-[#63738b]">
            You're set up. Here's how to get your first insights in under 5
            minutes.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            window.localStorage.setItem("recomind_onboarding_complete", "true")
          }
          className="flex items-center gap-2 rounded-lg border border-[#d1d7df] bg-white px-3 py-1.5 text-[12px] text-[#63738b]"
        >
          <X size={13} /> Skip intro
        </button>
      </div>

      <p className="mb-3 mt-6 text-[12px] font-medium uppercase tracking-wide text-[#536783]">
        Get started in 3 steps
      </p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 ">
        {setupSteps.map((item) => (
          <SetupStep key={item.number} item={item} />
        ))}
      </div>

      <p className="mb-3 mt-6 text-[12px] font-medium uppercase tracking-wide text-[#536783]">
        What you'll unlock
      </p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {unlocks.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="flex min-h-[87px] items-start gap-3 rounded-lg border border-[#d1d7df] bg-white p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef1f7] text-[#6176ae]">
              <Icon size={16} />
            </span>
            <div>
              <h2 className="text-[14px] font-semibold text-[#111d34]">
                {title}
              </h2>
              <p className="mt-1 text-[12px] leading-[1.45] text-[#63738b]">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mb-3 mt-6 text-[12px] font-medium uppercase tracking-wide text-[#536783]">
        Your dashboard — waiting for data
      </p>
      <section className="flex min-h-[235px] flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd2dc] bg-white text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f3f8] text-[#7890c5]">
          <BarChart3 size={21} />
        </span>
        <h2 className="mt-3 text-[15px] font-semibold">No scan data yet</h2>
        <p className="mt-1 max-w-[320px] text-[13px] leading-[1.4] text-[#63738b]">
          Once you add products and run your first scan, your KPIs, buyer intent
          wins, and opportunity gaps will appear here.
        </p>
        <button
          type="button"
          onClick={() => navigate("/app/products")}
          className="mt-3 flex items-center gap-2 rounded-lg bg-[#5262a6] cursor-pointer px-4 py-2 text-[14px] font-semibold text-white"
        >
          <Play size={13} /> Start First Scan
        </button>
      </section>
    </div>
  );
}
