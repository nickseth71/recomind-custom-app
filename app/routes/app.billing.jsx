import React from 'react'
export const usageData = [
  {
    title: "Products Tracked",
    used: 312,
    total: 500,
    percentage: 62,
  },
  {
    title: "Prompts Used",
    used: 3840,
    total: 5000,
    percentage: 77,
  },
  {
    title: "Reports Generated",
    used: 8,
    total: 20,
    percentage: 40,
  },
];
const plans=[
  {
    "id":"1",
    "name":"Starter",
    "price": "$29",
    "details":"Perfect for small stores getting started with AI visibility.",
    "features": [
      "Up to 50 products tracked",
      "500 prompts/month",
      "Basic AI visibility score",
      "Email support",
    ],
    "button": "Switch to Starter",
    "current": false,
  },
  { 
    "id":"2",
    "name":"Growth",
    "price": "$79",
    "details":"For growing brands that need deeper AI insights.",
      "features": [
      "Up to 500 products tracked",
      "5,000 prompts/month",
      "Advanced AI visibility score",
      "Competitor analysis",
      "Priority support",
    ],
    "button": "Current Plan",
    "current": true,
  },
  {
    "id":"3",
    "name":"Pro",
    "price": "$199",
    "details":"Full-scale AI commerce visibility for large catalogs.",
    "features": [
      "Unlimited products",
      "Unlimited prompts",
      "Full AI recommendation simulation",
      "Custom reports",
      "Dedicated account manager",
    ],
    "button": "Switch to Pro",
    "current": false,
  },

]
// const Billing = () => {
//   return (
//     <div>
//       <h1 className='text-secondary'>Billing</h1>
//       <p className='text-secondary'>Manage your subscription, plan, and payment details</p>

//       <div className='h-50 w-full glass-card rounded-xl'>
//         <div>
//         <p className='text-secondary'>Current Plan</p>
//         <h1 className='text-secondary'>Growth Plan</h1> <div>Active</div>
//         <p className='text-secondary'>Next  Billing Date :</p>
//         <div>
//           <button className='text-primary text-xs  glass-card rounded-xl h-10 w-20'>Cancel Plan</button>
//           <button className='text-on-primary text-xs bg-blue-950 rounded-xl h-10 w-20'>Upgrade Plan</button>
//         </div>
//         </div>
        
//       </div>

//       {/* 2nd box --Plans*/}
//       <div  className='h-100 w-full glass-card p-5 rounded-xl mt-5'>
//       <p>Choose a Plan</p>
//       <div>
//         {plans.map((plan)=>(
//           <div key={plan.id}>

            
//           </div>
//         ))}
//       </div>
//       </div>

//     </div>
//   )
// }

// export default Billing
import { CheckCircle } from "lucide-react";

export default function Billing() {
  return (
    <div className="min-h-screen">

      {/* Heading */}

      <h1 className="text-on-surface text-headline-md text-mono-sm">Billing</h1>
      <p className="mt-2 text-on-surface-variant text-mono-sm">
        Manage your subscription, plan, and payment details
      </p>

      {/* Current Plan */}

      <div className="mt-5 rounded-xl glass-card p-8">
        <div className="flex justify-between">
          <div>
            <p className="text-on-surface-variant text-mono-sm">Current Plan</p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-on-surface text-headline-md">Growth Plan</h2>
              <span className="rounded-full  px-4 py-1 border text-on-surface-variant text-mono-sm">Active</span>
            </div>
            <p className="mt-3 text-on-surface-variant text-mono-sm">
              Next billing date:
              <span className="text-on-surface-variant text-mono-sm"> June 1, 2024</span>
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

        <div className="mt-5 grid grid-cols-3 gap-4">
          {usageData.map((item) => (
            <div key={item.title}>
              <div className="mb-2 flex justify-between">
                <span className="text-on-surface-variant text-mono-sm">
                  {item.title}
                </span>

                <span className="text-on-surface-variant text-mono-sm">
                  {item.used.toLocaleString()} / {item.total.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#111844]" style={{ width: `${item.percentage}%` }}/></div>
              <p className="mt-2 text-on-surface-variant text-mono-sm">
                {item.percentage}% used
              </p>
            </div>

          ))}

        </div>
      </div>
      {/* Plans */}

      <div className="mt-5 rounded-xl border glass-card  p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-on-surface text-mono-sm text-headline-md">
            Choose a Plan
          </h2>
          <div className="flex rounded-xl bg-white p-1">
            <button className="rounded-lg px-3 py-1 text-on-surface-variant text-mono-sm">Monthly</button>
            <button className="rounded-lg bg-white px-3 py-1 text-on-surface-variant text-mono-sm">
              Annual
              <span className="ml-1 text-green-500">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {plans.map((plan) => (

            <div
              key={plan.id}
              className={`relative rounded-3xl border p-8 ${
                plan.current
                  ? "border-[#111844] bg-white"
                  : "border-white bg-transparent"
              }`}
            >
              {plan.current && (
                <span className="absolute right-8 top-8 rounded-full bg[#111844] px-2 text-white py-1 ">
                  Current
                </span>

              )}

              <h3
                className={`text-on-surface text-headline-md${
                  plan.current ? "text-on-surface-variant" : "text-on-surface-variant"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mt-3 flex items-end gap-2">
                <span
                  className={`text-3xl font-bold ${
                    plan.current ? "text-on-surface-variant" : "text-on-surface-variant"
                  }`}
                >
                  {plan.price}
                </span>

                <span className="mb-2 text-on-surface text-headline-md">
                  /month
                </span>

              </div>

              <p className="mt-2 text-on-surface-variant text-mono-sm text-semibold">
                {plan.name === "Starter" &&
                  "Perfect for small stores getting started with AI visibility."}

                {plan.name === "Growth" &&
                  "For growing brands that need deeper AI insights."}

                {plan.name === "Pro" &&
                  "Full-scale AI commerce visibility for large catalogs."}
              </p>

              <div className="mt-4 space-y-5">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-green-500"  size={18}/>

                    <span
                      className={`text-xs ${
                        plan.current ? "text-on-surface-variant" : "text-on-surface-variant"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className={`mt-5 w-full rounded-xl py-4 text-xl font-semibold ${
                  plan.current
                    ? "bg-[#111844] text-white"
                    : "border border-[#3A4AA0] text-white"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
