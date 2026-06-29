import React from "react";
import { TrendingUp, RotateCcw, Banknote, Zap, RotateCw } from "lucide-react";
const metrics = [
  {
    title: "Traffic",
    value: "+18%",
    subtitle: "vs previous period",
    icon: <TrendingUp />,
    color: "text-green-400",
  },
  {
    title: "Conversions",
    value: "+12%",
    subtitle: "vs previous period",
    icon: <RotateCcw />,
    color: "text-blue-500",
  },
  {
    title: "Revenue",
    value: "+9%",
    subtitle: "vs previous period",
    icon: <Banknote />,
    color: "text-purple-500",
  },
  {
    title: "Intents Unlocked",
    value: "+14",
    subtitle: "new buyer intents matched",
    icon: <Zap />,
    color: "text-orange-500",
  },
];

const beforeData = [
  {
    title: "Intents Won",
    value: "12",
  },
  {
    title: "Traffic",
    value: "12,400",
  },
  {
    title: "Revenue",
    value: "$8,200",
  },
];

const afterData = [
  {
    title: "Intents Won",
    value: "26",
    change: "+14",
  },
  {
    title: "Traffic",
    value: "15,200",
    change: "+22%",
  },
  {
    title: "Revenue",
    value: "$9,800",
    change: "+20%",
  },
];

const productImpactData=[
  {
    id: 1,
    product: "Whey Protein",
    before: {
      intents: 4,
      revenue: 2300,
    },
    after: {
      intents: 9,
      revenue: 3100,
    },
    growth: +35,
    action: "Apply Fix",
  },
  {
    id: 2,
    product: "Face Cream",
    before: {
      intents: 5,
      revenue: 1800,
    },
    after: {
      intents: 11,
      revenue: 2400,
    },
    growth: +28,
    action: "Apply Fix",
  },
  {
    id: 3,
    product: "Electrolyte Powder",
    before: {
      intents: 3,
      revenue: 1200,
    },
    after: {
      intents: 7,
      revenue: 1580,
    },
    growth: +32,
    action: "Apply Fix",
  
  }
]

const Impact = () => {
  return (
    <div>
      <h1 className="font-headline-lg  text-on-surface text-headline-lg">
        Your AI Optimization Impact
      </h1>
      <p className="text-secondary-fixed-dim mt-1 text-body-md ">
        See how fixing buyer intent gaps is improving your store performance
      </p>

      <div className="grid grid-cols-4">
        {metrics.map((item, index) => (
          <div key={index} className="glass-card h-40 w-50 rounded-xl gap-5 ">
            <div className=" ml-3 mt-3 w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <div className=" text-black px-3">{item.title}</div>
            <div className="text-black px-3">{item.value}</div>
            <div className="text-black px-3">{item.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="glass-card h-70 w-full mt-5 rounded-xl">
        {/* Header */}
        <div className="p-3 border-b border-outline">
          <h3 className="text-primary">How your performance changed</h3>
          <p className="text-primary text-xs">
            Performance improved after optimization
          </p>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-2">
          {/* BEFORE */}
          <div className="p-3 border-r border-outline">
            <h3 className="text-primary font-semibold mb-6">
              BEFORE OPTIMIZATION
            </h3>

            <div className="space-y-3">
              {beforeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-secondary text-sm">{item.title}</p>

                  <p className="text-primary font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div className="p-3">
            <h3 className="text-primary font-semibold mb-6">
              AFTER OPTIMIZATION
            </h3>

            <div className="space-y-3">
              {afterData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-secondary text-sm">{item.title}</p>

                  <div className="flex items-center gap-2">
                    <p className="text-primary font-semibold">{item.value}</p>
                    <p className="text-green-700 font-semibold">
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* last line */}
          </div>
        </div>
        {/*  */}

        <div className="w-full h-10 bg-emerald-50 rounded-xl flex items-center px-4 gap-8">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-green-800" />
            <p className="text-xs text-green-800">
              {" "}
              +14 new buyer intents unlocked{" "}
            </p>
            <TrendingUp size={12} className="text-green-800 ml-3" />
            <p className="text-xs text-green-800">
              +22% increase in product visibility
            </p>
          </div>
        </div>

        {/* 2nd block */}
        <div className="flex flex-col glass-card rounded-xl px-5  mt-5 h-70 w-full ">
          <span>
            <h2 className="text-primary text-mono-xl font-bold">
              Top Impact Opportunities
            </h2>
            <p className="text-secondary text-mono-sm">
              Fixes that delivered the highest performance gains
            </p>
          </span>
          
          <div className="text-primary text-mono-sm mr-3">
            "low bloating protein"
            <span className="px-3 py-1 rounded-full w-10 bg-[#187bda] text-red-600 text-xs font-semibold">
              HIGH
            </span>
          </div>
          <div className="flex ml-5">
            <div className="flex items-center gap-1 text-on-surface-variant text-mono-sm ">
              <div className="flex display-inline">
                <TrendingUp size={14} className="text-green-500 " />
                Traffic :
                <span className="text-green-500 font-mono-sm"> +22%</span>
                <RotateCw size={14} className="text-blue-500 ml-5" />
                Conversions :
                <span className="text-blue-500 font-medium"> +15%</span>
              </div>
            </div>
          </div>
        </div>
        {/* 33rd block */}
        {/* <div className="h-100 w-full glass-card rounded-xl mt-7 px-5 bg-surface-container-low">
          <div>
              <h2 className="text-on-surface text-headline-md ">
              Product Impact
            </h2>
            <p className="text-on-surface-variant text-mono-sm">
              Before and after metrics per product
            </p>
            </div>
          </div>
          <table>
            <thead>
              <tr></tr>
            </thead>
          </table> 
      </div>*/}
    <div className="w-full overflow-hidden rounded-xl border glass-card mt-7">
      {/* Header */}
      <div className="px-6 py-5">
        <h2 className="text-on-surface text-headline-md">
          Product Impact
        </h2>
        <p className="mt-1 text-on-surface-variant text-mono-sm">
          Before and after metrics per product
        </p>
      </div>
      <div className="grid grid-cols-5 bg-white px-4 py-2 text-on-surface font-semibold text-mono-sm uppercase ">
        <div>Product</div>
        <div>Before</div>
        <div>After</div>
        <div>Growth</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      {productImpactData.map((item) => (
        <div key={item.id} className="grid grid-cols-5 items-center border-t border-[#384077] px-6 py-6">
          <div className="text-on-surface-variant text-mono-sm text-[15px]">{item.product}
          </div>

          {/* Before */}
          <div className="space-y-1">
            <p className="text-on-surface-variant text-mono-sm">
              Intents:
              <span className="ml-1 text-on-surface-variant text-mono-sm">
                {item.before.intents}
              </span>
            </p>

            <p className="text-on-surface-variant text-mono-sm">
              Revenue:
              <span className="ml-1 font-semibold text-on-surface-variant text-mono-sm">
                ${item.before.revenue.toLocaleString()}
              </span>
            </p>
          </div>

          {/* After */}
          <div className="space-y-1">
            <p className="text-on-surface-variant text-mono-sm">
              Intents:
              <span className="ml-1 font-semibold text-[#00C27A]">{item.after.intents}
              </span>
            </p>

            <p className="text-on-surface-variant text-mono-sm">
              Revenue:
              <span className="ml-1 font-semibold text-[#00C27A]">${item.after.revenue.toLocaleString()}</span>
            </p>
          </div>

          {/* Growth */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D6FFE7] px-3 py-1 font-semibold text-[#007A52]"> ↗ +{item.growth}%
            </span>
          </div>

          {/* Action */}
          <div>
            <button className="flex items-center gap-2 rounded-xl text-mono-sm bg-gradient-to-r bg-[#111844] px-3 py-1 font-medium text-white transition hover:opacity-90">
              <Zap size={16} /> Apply Fix
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
    //     </div>
    //   </div>
  );
};

export default Impact;
