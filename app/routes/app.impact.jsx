import { useState } from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  RotateCcw,
  Banknote,
  Zap,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useApi } from "../hooks/useApi";
import { impactApi } from "../lib/api";
import AiSpinner from "../components/loader/AiSpinner";

const METRIC_ICONS = {
  Traffic: TrendingUp,
  Conversions: RotateCcw,
  Revenue: Banknote,
  "Intents Unlocked": Zap,
};

const METRIC_COLORS = {
  Traffic: "text-green-400",
  Conversions: "text-blue-500",
  Revenue: "text-purple-500",
  "Intents Unlocked": "text-orange-500",
};

const Impact = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { data, loading, error } = useApi(
    () => impactApi.dashboard({ windowDays: 7 }),
    [],
  );

  const payload = data?.data;

  if (loading) {
    return (
      
      <div className="flex items-center justify-center gap-2 py-20 text-on-surface-variant">
         {/* <Loader2 className="animate-spin font-mono-sm" size={20} /> */}
         <AiSpinner label="Loading impact data from Shopify…" />

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-red-700">
        <p className="font-semibold font-mono-sm">Could not load impact data</p>
        <p className="mt-1 text-sm font-mono-sm">{error}</p>
      </div>
    );
  }

  const metrics = payload?.metrics || [];
  const beforeData = payload?.comparison?.before || [];
  const afterData = payload?.comparison?.after || [];
  const highlights = payload?.comparison?.highlights || {};
  const productImpactData = payload?.productImpact || [];
  const opportunities = payload?.opportunities || [];

  return (
    <div>
      <h1 className="font-headline-lg text-on-surface text-headline-lg">
        Your AI Optimization Impact
      </h1>
      <p className="text-secondary-fixed-dim mt-1 text-body-md">
        See how fixing buyer intent gaps is improving your store performance
        {payload?.dataSource ? ` (data from ${payload.dataSource})` : ""}
      </p>

      {!payload?.hasOptimizations && (
        <p className="mt-3 rounded-lg glass-card px-4 py-2 text-sm text-amber-800">
          Optimize at least one product to unlock before/after comparison. Current
          metrics show your latest Shopify store performance.
        </p>
      )}

      <div className="grid grid-cols-4 gap-5 mt-8">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">   for 2 in 1 line */}
        {metrics.map((item, index) => {
          const Icon = METRIC_ICONS[item.title] || TrendingUp;
          return (
            <div key={index} className="glass-card h-40 w-full rounded-2xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center ">
                <Icon size={18} className={METRIC_COLORS[item.title] || ""} />
              </div>
              <div className="text-on-surface font-headline-sm ">{item.title}</div>
              <div className="text-on-surface font-semibold">{item.value}</div>
              <div className="text-on-surface font-mono-sm text-[12px]">{item.subtitle}</div>
            </div>
          );
        })}
      </div>

      <div className="glass-card h-65 w-full mt-5 rounded-xl">
        <div className="p-3 border-b border-outline">
          <h3 className="text-on-surface font-headline-md">How your performance changed</h3>
          <p className="text-on-surface text-xs">
            {payload?.hasOptimizations
              ? "Performance improved after optimization"
              : "Current store performance"}
          </p>
        </div>

        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-outline">
            <h3 className="text-on-surface font-headline-md font-semibold mb-2">
              BEFORE OPTIMIZATION
            </h3>
            <div className="space-y-3">
              {beforeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-on-surface-variant text-mono-sm">{item.title}</p>
                  <p className="text-primary font-semibold text-mono-sm text-[16px]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-on-surface font-headline-md font-semibold mb-2">
              AFTER OPTIMIZATION
            </h3>
            <div className="space-y-3">
              {afterData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-on-surface-variant text-mono-sm">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-primary font-semibold font-mono text-[16px]">{item.value}</p>
                    {item.change && (
                      <p className="text-green-700 font-semibold">
                        {item.change.startsWith("+") ||
                        item.change.startsWith("-")
                          ? item.change
                          : `↑ ${item.change}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-10 bg-emerald-50 rounded-xl flex items-center px-4 gap-4">
          <div className="flex items-center ">
            <Zap size={12} className="text-green-800" />
            <p className="text-xs text-green-800">
              +{highlights.intentsUnlocked ?? 0} new buyer intents unlocked
            </p>
            {highlights.visibilityIncreasePercent != null && (
              <>
                <TrendingUp size={12} className="text-green-800 ml-3" />
                <p className="text-xs text-green-800">
                  {highlights.visibilityIncreasePercent >= 0 ? "+" : ""}
                  {highlights.visibilityIncreasePercent}% increase in product
                  visibility
                </p>
              </>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border mt-7 border-outline-variant">
          <div className="px-6 py-5 border-b border-outline-variant gap-5">
            <h2 className="font-headline-md text-on-surface">
              Top Impact Opportunities
            </h2>
            <p className="text-on-surface-variant text-mono-sm">
              Fixes that delivered the highest performance gains
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="px-6 py-8 text-on-surface-variant text-sm">
              No impact opportunities yet. Optimize products and match buyer intents
              to see gains here.
            </div>
          ) : (
            opportunities.map((item, index) => (
              <div
                key={index}
                className="border-b border-outline-variant last:border-b-0 text-mono-sm"
              >
                <div className="flex justify-between items-start px-6 py-5 text-mono-sm">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-on-surface text-mono-sm">
                        &quot;{item.keyword}&quot;
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        {item.priority || "HIGH"}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-4 text-sm text-on-surface-variant">
                      <span>
                        <TrendingUp size={12} className="text-green-800 inline" />
                      </span>
                      <span className="text-green-500">{item.impact}</span>
                      {item.impact2 && (
                        <span className="text-blue-500 flex gap-2">
                          <RotateCcw size={12} />
                          {item.impact2}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="text-primary font-medium flex items-center gap-1"
                  >
                    View Details
                    <span
                      className={`transition-transform ${
                        openIndex === index ? "rotate-90" : ""
                      }`}
                    >
                      <ChevronRight className="h-5" />
                    </span>
                  </button>
                </div>
                {openIndex === index && (
                  <div className="px-3 pb-3">
                    <div className="bg-white rounded-xl px-5 py-4 text-mono-sm text-on-surface-variant">
                      {item.detail}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="w-full overflow-hidden rounded-xl border glass-card mt-7">
          <div className="px-6 py-5">
            <h2 className="text-on-surface text-headline-md">Product Impact</h2>
            <p className="mt-1 text-on-surface-variant text-mono-sm">
              Before and after metrics per product (from Shopify)
            </p>
          </div>
          <div className="grid grid-cols-5 bg-white px-4 py-2 text-on-surface font-semibold text-mono-sm uppercase">
            <div>Product</div>
            <div>Before</div>
            <div>After</div>
            <div>Growth</div>
            <div>Action</div>
          </div>

          {productImpactData.length === 0 ? (
            <div className="px-6 py-8 text-on-surface-variant text-sm">
              No optimized products yet. Apply fixes to products to track
              before/after revenue and intent wins.
            </div>
          ) : (
            productImpactData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 items-center border-t border-[#384077] px-6 py-6"
              >
                <div className="text-on-surface-variant text-mono-sm text-[15px]">
                  {item.product}
                </div>
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
                <div className="space-y-1">
                  <p className="text-on-surface-variant text-mono-sm">
                    Intents:
                    <span className="ml-1 font-semibold text-[#00C27A]">
                      {item.after.intents}
                    </span>
                  </p>
                  <p className="text-on-surface-variant text-mono-sm">
                    Revenue:
                    <span className="ml-1 font-semibold text-[#00C27A]">
                      ${item.after.revenue.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  {item.growth != null ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#D6FFE7] px-3 py-1 font-semibold text-[#007A52]">
                      ↗ {item.growth >= 0 ? "+" : ""}
                      {item.growth}%
                    </span>
                  ) : (
                    <span className="text-on-surface-variant text-sm">—</span>
                  )}
                </div>
                <div>
                  <Link
                    to={`/app/products/${item.productId}`}
                    className="flex items-center gap-2 rounded-xl text-mono-sm bg-gradient-to-r bg-[#111844] px-3 py-1 font-medium text-white transition hover:opacity-90 w-fit"
                  >
                    <Zap size={16} /> View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Impact;
