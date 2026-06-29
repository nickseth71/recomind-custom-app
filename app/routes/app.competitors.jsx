import React from "react";
const comparisonData = [
  {
    feature: "Lactose-Free Mention",
    you: "❌",
    optimumNutrition: "✅",
    dymatizeISO100: "✅",
    nakedWhey: "✅",
  },
  {
    feature: "Digestive Health Benefit",
    you: "❌",
    optimumNutrition: "✅",
    dymatizeISO100: "✅",
    nakedWhey: "❌",
  },
  {
    feature: "Grass Fed/ Natural",
    you: "❌",
    optimumNutrition: "❌",
    dymatizeISO100: "❌",
    nakedWhey: "✅",
  },
  {
    feature: "FAQ Section",
    you: "Partial",
    optimumNutrition: "✅",
    dymatizeISO100: "✅",
    nakedWhey: "✅",
  },
  {
    feature: "Customer Reviews",
    you: "128",
    optimumNutrition: "2430",
    dymatizeISO100: "1892",
    nakedWhey: "1202",
  },
  {
    feature: "AI Visibility Score",
    you: "42/100",
    optimumNutrition: "81/100",
    dymatizeISO100: "79/100",
    nakedWhey: "76/100",
  },
];
const Competitors = () => {
  return (
    <div>
      <h1 className="font-headline-lg  text-on-surface text-headline-lg">
        Competitor Analysis
      </h1>
      <p className="text-secondary-fixed-dim mt-1 text-body-md ">
        {" "}
        Compare your AI visibility against top competitors
      </p>
      <div className="flex justify-between items-center gap-5">
      <div className=" h-125 w-125 glass-card rounded-xl divide-y border-outline-variant mt-2">
        <div className="font-mono-sm text-black text-[12px] p-3">
          <span>Compare with</span>
          <select className="border-1 rounded border-gray ml-2">
            <option>Top 3 Competitors</option>
            <option>Top 5 Competitors</option>
          </select>
        </div>
        <div className="grid grid-cols-5 text-sm font-semibold text-black px-6 py-3 items-center">
          <div className="whitespace-nowrap">Feature/Signal</div>
          <div className="text-center">You</div>
          <div className="text-center">Optimum Nutrition</div>
          <div className="text-center">Dymatize ISO100</div>
          <div className="text-center">Naked Whey</div>
        </div>
        <div className="divide-y border-outline-variant ">
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className=" text-on-surface-variant text-[12px] font-mono-sm grid grid-cols-5 justify-items-center items-center px-3 py-3"
            >
              <div>{row.feature}</div>
              <div>{row.you}</div>
              <div>{row.optimumNutrition}</div>
              <div>{row.dymatizeISO100}</div>
              <div>{row.nakedWhey}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card h-125 w-100 rounded-xl"> 
        <h3 className="font-headline-sm  text-on-surface text-headline-sm p-4">Key Takeaway</h3>
        <p className="text-on-surface-variant font-mono-sm p-4">Your competitors are winning because they better communicate digestive benefits and have more trust signals.</p>
        <div className="px-4 pb-4">
        <button className="bg-primary text-on-primary rounded-xl font-bold cursor-pointer w-full py-3 text-center">View Opportunities</button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Competitors;
