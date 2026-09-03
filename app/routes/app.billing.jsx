import React, { useEffect, useState } from "react";
import { billingApi } from "../lib/api";
// export default Billing
import AiSpinner from "../components/loader/AiSpinner";
import { CheckCircle } from "lucide-react";

export default function Billing() {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      const [plansRes, billingRes] = await Promise.all([
        billingApi.getPlans(),
        billingApi.getBilling(),
      ]);

      setPlans(plansRes.data.plans);
      setBilling(billingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const usageData = billing
    ? [
        {
          title: "Products Tracked",
          used: billing.usage.productsAnalyzed,
          total: billing.usage.maxProductsAnalyzed, // null = unlimited (Pro plan)
          percentage:
            billing.usage.maxProductsAnalyzed != null
              ? (billing.usage.productsAnalyzed /
                  billing.usage.maxProductsAnalyzed) *
                100
              : 0,
        },
        {
          title: "Prompts Used",
          used: billing.tokenQuota.used,
          total: billing.tokenQuota.monthly, // null = unlimited (Pro plan)
          percentage:
            billing.tokenQuota.monthly != null
              ? billing.tokenQuota.percentUsed
              : 0,
        },
        {
          title: "Products Synced",
          used: billing.products.analyzed,
          total: billing.products.total,
          percentage: billing.products.total
            ? (billing.products.analyzed / billing.products.total) * 100
            : 0,
        },
      ]
    : [];
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <AiSpinner size={70} label="Loading billing information..." />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Heading */}

      <h1 className="text-on-surface text-headline-md text-mono-sm">Billing</h1>
      <p className="mt-2 text-on-surface-variant text-mono-sm">
        Manage your subscription, plan, and payment details
      </p>

      {/* Current Plan */}

      {/* <div className="mt-5 rounded-xl glass-card p-8">
        <div className="flex justify-between">
          <div>
            <p className="text-on-surface-variant text-mono-sm">Current Plan</p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-on-surface text-headline-md">
                {billing?.plan?.label}
              </h2>
              <span className="rounded-full  px-4 py-1 border text-on-surface-variant text-mono-sm">
                {billing?.account?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-3 text-on-surface-variant text-mono-sm">
              Next billing date:
              <span className="text-on-surface-variant text-mono-sm">
                {" "}
                {new Date(billing?.tokenQuota?.resetDate).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <button className="rounded-xl border px-2 py-2 h-8 text-on-surface-variant text-mono-sm">
              Cancel Plan
            </button>

            <button className="rounded-xl  px-2 py-2 h-8 text-white text-mono-sm bg-[#111844]">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Progress */}

        {/* <div className="mt-5 grid grid-cols-3 gap-4">
          {usageData.map((item) => (
            <div key={item.title}>
              <div className="mb-2 flex justify-between">
                <span className="text-on-surface-variant text-mono-sm">
                  {item.title}
                </span>

                <span className="text-on-surface-variant text-mono-sm">
                  {(item.used ?? 0).toLocaleString()} /{" "}
                  {item.total != null
                    ? item.total.toLocaleString()
                    : "Unlimited"}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#111844]"
                  style={{
                    width: `${item.total != null ? Math.min(100, item.percentage) : 0}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-on-surface-variant text-mono-sm">
                {item.total != null
                  ? `${Math.round(item.percentage)}% used`
                  : "Unlimited on your plan"}
              </p>
            </div>
          ))}
        </div>
      </div>  */}

      {/* Plans */}

      <div className="mt-5 rounded-xl border glass-card  p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-on-surface text-mono-sm text-headline-md">
            Choose a Plan
          </h2>
          <div className="flex rounded-xl bg-surface-container-high p-1">
            <button className="rounded-lg px-3 py-1 text-on-surface-variant text-mono-sm">
              Monthly
            </button>
            <button className="rounded-lg bg-surface-container-high px-3 py-1 text-on-surface-variant text-mono-sm">
              Annual
              <span className="ml-1 text-green-500">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[#3A4AA0] hover:bg-white/70 ${
                billing?.plan?.name === plan.id
                  ? "border-[#111844] bg-transparent shadow-xl"
                  : "border-white/60 bg-surface-container-low"
              }`}
            >
              {billing?.plan?.name === plan.id && (
                <span className="absolute right-8 top-8 rounded-full bg-surface-container-high px-2 text-white py-1 ">
                  Current
                </span>
              )}

              <h3
                className={`text-on-surface text-headline-md${
                  billing?.plan?.name === plan.id
                    ? "text-on-surface-variant"
                    : "text-on-surface-variant"
                }`}
              >
                {plan.label}
              </h3>

              <div className="mt-3 flex items-end gap-2">
                <span
                  className={`text-3xl font-bold ${
                    billing?.plan?.name === plan.id
                      ? "text-on-surface-variant"
                      : "text-on-surface-variant"
                  }`}
                >
                  ${plan.priceMonthly}
                </span>

                <span className="mb-2 text-on-surface text-headline-md">
                  /month
                </span>
              </div>

              <p className="mt-2 text-on-surface-variant text-mono-sm text-semibold">
                {plan.label === "Starter" &&
                  "Perfect for small stores getting started with AI visibility."}

                {plan.label === "Growth" &&
                  "For growing brands that need deeper AI insights."}

                {plan.label === "Pro" &&
                  "Full-scale AI commerce visibility for large catalogs."}
              </p>

              <div className="mt-4 space-y-5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={18} />

                    <span
                      className={`text-xs ${
                        billing?.plan?.name === plan.id
                          ? "text-on-surface-variant"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className={`mt-5 w-full rounded-xl py-4 cursor-pointer text-xl font-semibold ${
                  billing?.plan?.name === plan.id
                    ? "bg-[#111844] text-white"
                    : "border border-[#3A4AA0] text-on-surface-variant"
                }`}
              >
                {billing?.plan?.name === plan.id
                  ? "Current Plan"
                  : `Switch to ${plan.label}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
