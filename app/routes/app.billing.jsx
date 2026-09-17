// import { useEffect, useState } from "react";
// import { billingApi } from "../lib/api";
// // export default Billing
// import AiSpinner from "../components/loader/AiSpinner";
// import { CheckCircle } from "lucide-react";
// import TokenSlider from "../components/TokenSlider";
// export default function Billing() {
//   const [plans, setPlans] = useState([]);
//   const [billing, setBilling] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tokenAmount, setTokenAmount] = useState(1000);
//   const [purchaseLoading, setPurchaseLoading] = useState(false);
//   useEffect(() => {
//     fetchBillingData();
//   }, []);

//   const fetchBillingData = async () => {
//     try {
//       setLoading(true);

//       const [plansRes, billingRes] = await Promise.all([
//         billingApi.getPlans(),
//         billingApi.getBilling(),
//       ]);

//       setPlans(plansRes.data.plans);
//       setBilling(billingRes.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   async function purchaseTokens() {
//     setPurchaseLoading(true);
//     try {
//       const result = await billingApi.purchaseTokens(tokenAmount);
//       if (result.data?.confirmationUrl)
//         window.open(
//           result.data.confirmationUrl,
//           "_blank",
//           "noopener,noreferrer",
//         );
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setPurchaseLoading(false);
//     }
//   }
//   if (loading) {
//     return (
//       <div className="flex min-h-[70vh] items-center justify-center">
//         <AiSpinner size={70} label="Loading billing information..." />
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen">
//       {/* Heading */}

//       <h1 className="text-on-surface text-headline-md text-mono-sm">Billing</h1>
//       <p className="mt-2 text-on-surface-variant text-mono-sm">
//         Manage your subscription, plan, and payment details
//       </p>

//       {/* Current Plan */}

//       {/* <div className="mt-5 rounded-xl glass-card p-8">
//         <div className="flex justify-between">
//           <div>
//             <p className="text-on-surface-variant text-mono-sm">Current Plan</p>
//             <div className="mt-2 flex items-center gap-3">
//               <h2 className="text-on-surface text-headline-md">
//                 {billing?.plan?.label}
//               </h2>
//               <span className="rounded-full  px-4 py-1 border text-on-surface-variant text-mono-sm">
//                 {billing?.account?.isActive ? "Active" : "Inactive"}
//               </span>
//             </div>
//             <p className="mt-3 text-on-surface-variant text-mono-sm">
//               Next billing date:
//               <span className="text-on-surface-variant text-mono-sm">
//                 {" "}
//                 {new Date(billing?.tokenQuota?.resetDate).toLocaleDateString()}
//               </span>
//             </p>
//           </div>

//           <div className="flex gap-4">
//             <button className="rounded-xl border px-2 py-2 h-8 text-on-surface-variant text-mono-sm">
//               Cancel Plan
//             </button>

//             <button className="rounded-xl  px-2 py-2 h-8 text-white text-mono-sm bg-[#111844]">
//               Upgrade Plan
//             </button>
//           </div>
//         </div>

//         {/* Progress */}

//       {/* <div className="mt-5 grid grid-cols-3 gap-4">
//           {usageData.map((item) => (
//             <div key={item.title}>
//               <div className="mb-2 flex justify-between">
//                 <span className="text-on-surface-variant text-mono-sm">
//                   {item.title}
//                 </span>

//                 <span className="text-on-surface-variant text-mono-sm">
//                   {(item.used ?? 0).toLocaleString()} /{" "}
//                   {item.total != null
//                     ? item.total.toLocaleString()
//                     : "Unlimited"}
//                 </span>
//               </div>
//               <div className="h-2 overflow-hidden rounded-full bg-white">
//                 <div
//                   className="h-full rounded-full bg-[#111844]"
//                   style={{
//                     width: `${item.total != null ? Math.min(100, item.percentage) : 0}%`,
//                   }}
//                 />
//               </div>
//               <p className="mt-2 text-on-surface-variant text-mono-sm">
//                 {item.total != null
//                   ? `${Math.round(item.percentage)}% used`
//                   : "Unlimited on your plan"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>  */}

//       {/* Plans */}

//       <div className="mt-5 rounded-xl border glass-card p-5">
//         <h2 className="text-on-surface text-headline-md">Buy monthly tokens</h2>
//         <p className="mt-2 text-on-surface-variant text-mono-sm">
//           Purchased tokens expire at the next monthly renewal.
//         </p>
//         <input
//           className="mt-5 w-full"
//           type="range"
//           min="1000"
//           max="100000"
//           step="1000"
//           value={tokenAmount}
//           onChange={(event) => setTokenAmount(Number(event.target.value))}
//         />
//         <div className="mt-3 flex items-center justify-between text-on-surface">
//           <strong>{tokenAmount.toLocaleString()} tokens</strong>
//           <strong>${((tokenAmount / 1000) * 10).toFixed(2)} / month</strong>
//         </div>
//         <button
//           onClick={purchaseTokens}
//           disabled={purchaseLoading}
//           className="mt-4 rounded-xl bg-primary px-4 py-3 text-on-primary font-semibold"
//         >
//           {purchaseLoading ? "Opening Shopify billing..." : "Purchase tokens"}
//         </button>
//       </div>

//       <div className="mt-5 rounded-xl border glass-card  p-5">
//         <div className="mb-5 flex items-center justify-between">
//           <h2 className="text-on-surface text-mono-sm text-headline-md">
//             Choose a Plan
//           </h2>
//           <div className="flex rounded-xl bg-surface-container-high p-1">
//             <button className="rounded-lg px-3 py-1 text-on-surface-variant text-mono-sm">
//               Monthly
//             </button>
//             <button className="rounded-lg bg-surface-container-high px-3 py-1 text-on-surface-variant text-mono-sm">
//               Annual
//               <span className="ml-1 text-green-500">-20%</span>
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`relative rounded-3xl border p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[#3A4AA0] hover:bg-white/10 ${
//                 billing?.plan?.name === plan.id
//                   ? "border-[#111844] bg-blue-base shadow-xl"
//                   : "border-white/60 bg-blue-base"
//               }`}
//             >
//               {billing?.plan?.name === plan.id && (
//                 <span className="absolute right-8 top-8 rounded-full bg-primary px-2 text-white py-1 ">
//                   Current
//                 </span>
//               )}

//               <h3
//                 className={`text-on-surface text-headline-md${
//                   billing?.plan?.name === plan.id
//                     ? "text-on-surface-variant"
//                     : "text-on-surface-variant"
//                 }`}
//               >
//                 {plan.label}
//               </h3>

//               <div className="mt-3 flex items-end gap-2">
//                 <span
//                   className={`text-3xl font-bold ${
//                     billing?.plan?.name === plan.id
//                       ? "text-on-surface-variant"
//                       : "text-on-surface-variant"
//                   }`}
//                 >
//                   ${plan.priceMonthly}
//                 </span>

//                 <span className="mb-2 text-on-surface text-headline-md">
//                   /month
//                 </span>
//               </div>

//               <p className="mt-2 text-on-surface-variant text-mono-sm text-semibold">
//                 {plan.label === "Starter" &&
//                   "Perfect for small stores getting started with AI visibility."}

//                 {plan.label === "Growth" &&
//                   "For growing brands that need deeper AI insights."}

//                 {plan.label === "Pro" &&
//                   "Full-scale AI commerce visibility for large catalogs."}
//               </p>

//               <div className="mt-4 space-y-5">
//                 {plan.features.map((feature) => (
//                   <div key={feature} className="flex items-center gap-3">
//                     <CheckCircle className="text-green-500" size={18} />

//                     <span
//                       className={`text-xs ${
//                         billing?.plan?.name === plan.id
//                           ? "text-on-surface-variant"
//                           : "text-on-surface-variant"
//                       }`}
//                     >
//                       {feature}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className={`mt-5 w-full rounded-xl py-4 cursor-pointer text-xl font-semibold ${
//                   billing?.plan?.name === plan.id
//                     ? "bg-[#111844] text-white"
//                     : "border border-[#3A4AA0] text-on-surface-variant hover:-translate-y-1 hover:bg-[#111844] hover:text-white "
//                 }`}
//               >
//                 {billing?.plan?.name === plan.id
//                   ? "Current Plan"
//                   : `Switch to ${plan.label}`}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { billingApi } from "../lib/api";
import AiSpinner from "../components/loader/AiSpinner";
import { CheckCircle } from "lucide-react";
import TokenSlider from "../components/TokenSlider";

export default function Billing() {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tokenAmount, setTokenAmount] = useState(1000);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(null);
  const [billingError, setBillingError] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  useEffect(() => {
    function refreshAfterApproval() {
      fetchBillingData();
    }

    window.addEventListener("focus", refreshAfterApproval);
    return () => window.removeEventListener("focus", refreshAfterApproval);
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
      setBillingError(err.message || "Could not load billing information");
    } finally {
      setLoading(false);
    }
  };

  async function purchaseTokens() {
    setPurchaseLoading(true);
    setBillingError(null);

    try {
      const result = await billingApi.purchaseTokens(tokenAmount);

      if (result.data?.confirmationUrl) {
        window.open(
          result.data.confirmationUrl,
          "_blank",
          "noopener,noreferrer",
        );
      }
      await fetchBillingData();
    } catch (err) {
      setBillingError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  }

  async function purchasePlan(planId) {
    setPlanLoading(planId);
    setBillingError(null);
    try {
      const result = await billingApi.purchasePlan(planId);
      if (result.data?.confirmationUrl) {
        window.open(
          result.data.confirmationUrl,
          "_blank",
          "noopener,noreferrer",
        );
      }
      await fetchBillingData();
    } catch (err) {
      setBillingError(err.message);
    } finally {
      setPlanLoading(null);
    }
  }

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
      {billingError && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          <span>{billingError}</span>
          <button
            type="button"
            onClick={fetchBillingData}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
      {billing?.plan?.isTrial && (
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-surface">
          Free trial ends{" "}
          {new Date(billing.plan.trialEndsAt).toLocaleDateString()}. Approve the
          Starter plan to continue automatically after the trial.
        </div>
      )}
      {billing?.plan?.billingStatus &&
        billing.plan.billingStatus !== "ACTIVE" &&
        billing.plan.billingStatus !== "trialing" && (
          <div className="mt-3 rounded-xl border border-tertiary-fixed-dim/30 bg-tertiary-fixed-dim/10 px-4 py-3 text-sm text-on-surface">
            Shopify subscription approval is pending. Complete approval in the
            Shopify tab, then return here to refresh your billing status.
          </div>
        )}
      {billing?.billingConfirmationUrl && (
        <button
          type="button"
          onClick={() =>
            window.open(
              billing.billingConfirmationUrl,
              "_blank",
              "noopener,noreferrer",
            )
          }
          className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
        >
          Approve Shopify billing
        </button>
      )}
      {billing?.tokenQuota && (
        <p className="mt-3 text-sm text-on-surface-variant">
          Token balance: {billing.tokenQuota.remaining?.toLocaleString() ?? 0}{" "}
          remaining
        </p>
      )}

      {/* Plans */}
      <div className="mt-5 rounded-xl border glass-card p-5">
        <h2 className="text-on-surface text-headline-md">
          Buy one-time tokens
        </h2>

        <p className="mt-2 text-on-surface-variant text-mono-sm">
          Purchased tokens are added once after Shopify payment approval and do
          not renew.
        </p>

        {/* Modular Token Slider */}
        <div className="mt-5">
          <TokenSlider
            value={tokenAmount}
            onChange={setTokenAmount}
            min={1000}
            max={100000}
            step={1000}
            pricePerThousand={10}
          />
        </div>

        <button
          type="button"
          onClick={purchaseTokens}
          disabled={purchaseLoading}
          className="mt-4 rounded-xl bg-primary px-4 py-3 text-on-primary font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {purchaseLoading ? "Opening Shopify billing..." : "Purchase tokens"}
        </button>
      </div>

      {/* Choose a Plan */}
      <div className="mt-5 rounded-xl border glass-card p-5 ">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-on-surface text-mono-sm text-headline-md">
            Choose a Plan
          </h2>

          <div className="flex rounded-xl bg-surface-container-high p-1">
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-on-surface-variant text-mono-sm"
            >
              Monthly
            </button>

            <button
              type="button"
              className="rounded-lg bg-surface-container-high px-3 py-1 text-on-surface-variant text-mono-sm"
            >
              Annual
              <span className="ml-1 text-green-500">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = billing?.plan?.name === plan.id;
            const isPendingPlan = billing?.plan?.pendingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[#3A4AA0] hover:bg-white/10 ${
                  isCurrentPlan
                    ? "border-[#111844] bg-secondary-container shadow-xl"
                    : "border-white/60 bg-secondary-container"
                }`}
              >
                {/* Current badge */}
                {isCurrentPlan && !isPendingPlan && (
                  <span className="absolute right-8 top-8 rounded-full bg-primary px-2 py-1 text-white">
                    Current
                  </span>
                )}

                {/* Plan name */}
                <h3 className="text-headline-md text-on-surface-variant">
                  {plan.label}
                </h3>

                {/* Price */}
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold text-on-surface-variant">
                    ${plan.priceMonthly}
                  </span>

                  <span className="mb-2 text-on-surface text-headline-md">
                    /month
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-on-surface-variant text-mono-sm text-semibold">
                  {plan.label === "Starter" &&
                    "Perfect for small stores getting started with AI visibility."}

                  {plan.label === "Growth" &&
                    "For growing brands that need deeper AI insights."}

                  {plan.label === "Pro" &&
                    "Full-scale AI commerce visibility for large catalogs."}
                </p>

                {/* Features */}
                <div className="mt-4 space-y-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={18} />

                      <span className="text-xs text-on-surface-variant">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Plan button */}
                <button
                  type="button"
                  onClick={() =>
                    !isCurrentPlan &&
                    plan.priceMonthly != null &&
                    purchasePlan(plan.id)
                  }
                  disabled={
                    isCurrentPlan ||
                    isPendingPlan ||
                    plan.priceMonthly == null ||
                    planLoading === plan.id
                  }
                  className={`mt-5 w-full rounded-xl py-4 cursor-pointer text-xl font-semibold ${
                    isCurrentPlan
                      ? "bg-[#111844] text-white"
                      : "border border-[#3A4AA0] text-on-surface-variant hover:-translate-y-1 hover:bg-[#111844] hover:text-white"
                  }`}
                >
                  {isPendingPlan
                    ? "Approval pending"
                    : isCurrentPlan
                      ? "Current Plan"
                      : plan.priceMonthly == null
                        ? "Contact us"
                        : planLoading === plan.id
                          ? "Opening Shopify billing..."
                          : `Switch to ${plan.label}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
