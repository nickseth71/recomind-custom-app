import { useState } from "react";
import{ArrowRight} from "lucide-react"
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
const Promptwins = () => {
  const [selected, setSelected] = useState("");
  const score = 42;
  const actions = [
    "Add digestion benefit section",
    "Add lactose-free claim",
    "Add FAQ for bloating",
  ];
  return (
    // 1st box

    <div className="grid grid-cols-3 gap-3 p-3">
      <div className="h-[190px] w-full glass-card rounded-xl p-4">
        <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4">
          PROMPT
        </span>
        <br />
        <span className="text-l font-bold text-black ml-4 mt-2 mb-3">
          low bloating whey protein
        </span>
        <br />

        <button
          onClick={() => setSelected("commercial")}
          className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
            selected === "commercial"
              ? "bg-[#0B1B5A] text-white border-[#0B1B5A]"
              : "border-outline-variant text-on-surface-variant bg-surface-container ml-4 mt-3"
          }`}
        >
          COMMERCIAL
        </button>

        <button
          onClick={() => setSelected("high-intent")}
          className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
            selected === "high-intent"
              ? "bg-[#0B1B5A] text-white border-[#0B1B5A]"
              : "border-outline-variant text-on-surface-variant bg-surface-container ml-3 mt-3"
          }`}
        >
          HIGH INTENT
        </button>
      </div>

      {/* //2nd box */}

      <div className="h-[190px] w-full glass-card rounded-xl p-3 ">
        {/* <div className="flex items-center gap-6 mt-4"> */}
        <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4 ">
          YOUR SCORE
        </span>
        <div className="flex items-center gap-3 mt-2 text-mono-sm ">
          {/* Circle */}
          <div className="relative w-24 h-24 shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(#7B5800 0% ${score}%, #e3d9c8 ${score}% 100%)`,
              }}
            />

            <div className="absolute inset-[8px] glass-card rounded-full flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[rgb(123,88,0)]">
                42
              </span>
              <span className="text-xs text-black">/100</span>
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-[rgb(123,88,0)] font-bold text-lg">IMPROVE</h3>

            <p className="text-black text-xs mt-2">
              You have some relevant content but missing important signals.
            </p>
          </div>
        </div>
      </div>
      {/* //3rd box */}
      <div className="h-[190px] w-full glass-card rounded-xl p-3">
        <span className="text-secondary-fixed-dim font-headline-sm font-bold uppercase text-body-md ml-4">
          AI VISIBILITY
        </span>
        {[
          ["You", "42%", "42"],
          ["DymatizeISO100", "81%", "81"],
          ["NakedWhey", "79%", "79"],
          ["Optimum Nutrition", "76%", "76"],
        ].map(([label, percent, width]) => (
          <div key={label} className="flex items-center justify-between">
            <p className="text-black text-xs text-mono-sm">{label}</p>
            <div className="h-[3px] w-[80px] bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className=" h-[3px] w-[80px] bg-[#15E5A5] rounded"
                style={{ width: `${width}%` }}
              ></div>
            </div>
            <span className="text-black">{percent}</span>
          </div>
        ))}
        <button className="mt-2 cursor-pointer inline-flex items-center text-on-surface text-mono-sm ">
          View all recommendations <span ><ArrowRight size={10} className="text-on-surface" /></span></button>
      </div>
      {/* //4th box */}
      <div className="h-[190px] w-full glass-card rounded-xl p-3">
        <span className="text-on-surface font-headline-sm">
          Why You're Not Ranking Higher
        </span>
        <p className="text-black text-mono-sm text-[10px]">
          No mention of easy digestion or gut-friendly
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          No lactose-free or low-lactose claim
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Missing keywords: bloating, digestive, gentle
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          No relevant FAQ addressing bloating
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Limited social proof for sensitive stomach users
        </p>
      </div>
      {/* //5th box */}
      <div className="h-[190px] w-full glass-card rounded-xl p-3">
        <p className="text-on-surface font-headline-sm ">What to Improve</p>
        <p className="text-[10px] text-black text-mono-sm">
          Add digestion-friendly and gut-health benefits
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Include lactose-free or low-lactose information
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Add FAQ about bloating and digestion
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Add customer reviews for sensitive stomach
        </p>
        <p className="text-[10px] text-black text-mono-sm">
          Include comparison with other gentle proteins
        </p>
      </div>
      {/* //6th box */}
      <div className="h-[190px] w-full glass-card rounded-xl p-3 flex flex-col">
  <h3 className="text-on-surface font-headline-sm mb-3">
    Recommended Actions
  </h3>

  <div className="flex-1 flex flex-col justify-between">
    {actions.map((action) => (
      <div
        key={action}
        className="flex items-center text-mono-sm justify-between"
      >
        {/* Action */}
        <p className="text-black text-[11px] leading-none flex-1 pr-2">
          {action}
        </p>

        {/* Badge + Button */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] px-2 py-[2px] text-on-surface-variant rounded-xl transition-colors border border-outline-variant whitespace-nowrap">
            High Impact
          </span>

          <button className="px-3 py-[2px] rounded-xl bg-primary text-white text-[10px] cursor-pointer whitespace-nowrap">
            Fix Now
          </button>
        </div>
        
      </div>
    ))}
    
  </div>
         <button className="mt-2 cursor-pointer inline-flex items-center text-on-surface text-mono-sm ">View all recommendations <span ><ArrowRight size={10} className="text-on-surface" /></span></button>

</div>
      </div>
    // </div>
  );
};

export default Promptwins;
