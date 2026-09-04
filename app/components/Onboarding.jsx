import { useState } from "react";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  ListFilter,
  X,
} from "lucide-react";

const steps = [
  {
    label: "Step 1 of 3",
    title: "Know your Buyer Demand Score",
    description:
      "RecoMind scans your Shopify products and scores how well each one matches real buyer searches on AI engines like ChatGPT, Gemini, and Perplexity.",
  },
  {
    label: "Step 2 of 3",
    title: "See which buyer searches you win — and miss",
    description:
      "Prompt Intelligence maps every buyer query to your catalog. You’ll instantly see where your products show up and where competitors are capturing demand instead.",
  },
  {
    label: "Step 3 of 3",
    title: "Fix missing signals in one click",
    description:
      "RecoMind generates precise content fixes for each gap. Apply them directly to your Shopify store — no copywriting, no guesswork.",
  },
];

function StepPill({ step }) {
  const Icon = step === 1 ? Clock3 : step === 2 ? ListFilter : CheckCircle2;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#c9ced8] bg-[#e9edf2] px-3 py-1.5 text-[13px] leading-none text-[#40516b] shadow-sm">
      <Icon size={18} strokeWidth={2} />
      <span>{steps[step - 1].label}</span>
    </div>
  );
}

function ScorePreview() {
  return (
    <div className="relative mx-auto flex h-[145px] w-[145px] items-center justify-center">
      <div className="absolute inset-0 rounded-full border-[11px] border-[#e6ebf1]" />

      <div className="absolute inset-0 -rotate-[25deg] rounded-full border-[11px] border-transparent border-r-[#00e29e] border-t-[#00e29e] border-l-[#00e29e]" />

      <div className="relative text-center text-[#101d34]">
        <div className="text-[30px] font-semibold leading-none">72</div>

        <div className="mt-1.5 text-[11px] text-[#52627b]">
          Buyer Demand Score
        </div>
      </div>
    </div>
  );
}

function PromptPreview() {
  const prompts = [
    ["best wireless headphones under $100", true],
    ["noise cancelling earbuds for gym", true],
    ["headphones for remote work calls", false],
    ["premium audio gift for teenager", false],
  ];

  return (
    <div className="mx-auto flex w-full max-w-[315px] flex-col gap-1.5">
      {prompts.map(([prompt, winning]) => (
        <div
          key={prompt}
          className={`flex min-h-[42px] items-center gap-2.5 rounded-[12px] border px-3 text-[13px] leading-tight text-[#263650] ${
            winning
              ? "border-[#b9d9d7] bg-[#e8f1f1]"
              : "border-[#f0caca] bg-[#f8eded]"
          }`}
        >
          {winning ? (
            <Check size={16} className="shrink-0 text-[#008c83]" />
          ) : (
            <X size={16} className="shrink-0 text-[#e34d55]" />
          )}

          <span>{prompt}</span>
        </div>
      ))}
    </div>
  );
}

function FixPreview() {
  return (
    <div className="mx-auto w-full max-w-[320px] mt-12 overflow-hidden rounded-[16px] border border-[#cbd0d9] bg-white text-[#27364f]">
      {/* Card Header */}
      <div className="flex h-[42px] items-center gap-2 border-b border-[#cbd0d9] px-3.5 text-[12px] ">
        <span className="rounded-full border border-[#efcdbd] bg-[#fff5ef] px-2 py-1 text-[#ba4f0b]">
          Improve
        </span>

        <span>Missing signal detected</span>
      </div>

      {/* Card Body */}
      <div className="px-3.5 py-3 text-[12px] leading-[1.4]">
        <p>
          Suggested fix for{" "}
          <strong className="text-[#111d31]">Sony WH-1000XM5</strong>
        </p>

        <p className="mt-1.5 text-[13px] leading-[1.45] text-[#101d34]">
          Add <em>“ideal for remote work”</em> and <em>“30-hour battery”</em> to
          your product description to match buyer intent.
        </p>

        <button
          type="button"
          className="mt-2.5 flex h-8 w-full items-center justify-center gap-1.5 rounded-[9px] bg-[#4e5b72] text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#414d63] active:scale-[0.99]"
        >
          Apply Fix
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function ProgressDots({ step }) {
  return (
    <div
      className="flex h-3 items-center justify-center gap-1.5"
      aria-label={`Step ${step} of 3`}
    >
      {[1, 2, 3].map((item) => (
        <span
          key={item}
          className={`block rounded-full transition-all ${
            item === step ? "h-2 w-6 bg-[#4e5b72]" : "h-2 w-2 bg-[#d1d7df]"
          }`}
        />
      ))}
    </div>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);

  const current = steps[step - 1];

  const next = () => {
    if (step === steps.length) {
      onComplete();
      return;
    }

    setStep((value) => value + 1);
  };

  return (
    <section className="glass-surface h-screen w-full overflow-hidden px-5 py-4 text-[#101d34] sm:px-8">
      <div className="mx-auto flex h-full w-full max-w-[500px] flex-col">
        {/* TOP / HEADER */}
        <div className="shrink-0">
          <StepPill step={step} />

          <h1 className="mt-3 max-w-[480px] text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[25px]">
            {current.title}
          </h1>

          <p className="mt-2 max-w-[470px] text-[12px] leading-[1.4] text-[#61728c] sm:text-[13px]">
            {current.description}
          </p>
        </div>

        {/* PREVIEW AREA */}
        <div className="flex h-[190px] shrink-0 items-center justify-center">
          {step === 1 && <ScorePreview />}

          {step === 2 && <PromptPreview />}

          {step === 3 && <FixPreview />}
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="mt-auto shrink-0">
          <ProgressDots step={step} />

          <div className="mx-auto mt-3 flex w-full max-w-[400px] gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((value) => value - 1)}
                className="h-10 flex-1 rounded-[12px] border border-[#d1d7df] bg-white px-5 text-[14px] font-semibold text-[#101d34] shadow-sm transition-all hover:bg-[#f0f2f5] active:scale-[0.99]"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={next}
              className={`flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#4e5b72] px-5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#414d63] active:scale-[0.99] ${
                step === 1 ? "ml-auto w-[120px]" : "flex-[1.5]"
              }`}
            >
              {step === 3 && <Check size={16} />}

              <span>{step === 3 ? "Get Started" : "Next"}</span>

              {step < 3 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
