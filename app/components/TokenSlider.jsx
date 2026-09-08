import React from "react";

const DEFAULT_MARKS = [
  { value: 1000, label: "1K" },
  { value: 5000, label: "5K" },
  { value: 10000, label: "10K" },
  { value: 20000, label: "20K" },
  { value: 30000, label: "30K" },
  { value: 50000, label: "50K" },
  { value: 100000, label: "100K" },
];

export default function TokenSlider({
  value,
  onChange,
  min = 1000,
  max = 100000,
  step = 1000,
  pricePerThousand = 10,
  marks = DEFAULT_MARKS,
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  const price = (value / 1000) * pricePerThousand;

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="relative px-2 pt-14 pb-10">
        {/* Selected value bubble */}
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2"
          style={{
            left: `${percentage}%`,
          }}
        >
          <div className="relative rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-md">
            {value.toLocaleString()}

            <span
              className="absolute left-1/2 top-full -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid var(--color-primary)",
              }}
            />
          </div>
        </div>

        {/* Range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="token-slider"
          style={{
            "--slider-progress": `${percentage}%`,
          }}
        />

        {/* Marks */}
        <div className="pointer-events-none absolute left-2 right-2 top-[calc(100%-28px)]">
          {marks
            .filter((mark) => mark.value >= min && mark.value <= max)
            .map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;

              return (
                <div
                  key={mark.value}
                  className="absolute -translate-x-1/2 text-center"
                  style={{
                    left: `${markPercentage}%`,
                  }}
                >
                  <div className="mx-auto mb-1 h-2 w-px bg-outline" />

                  <span className="text-[11px] font-medium text-on-surface-variant">
                    {mark.label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Selected value + price */}
      <div className="mt-1 flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-4">
        <div>
          <p className="text-[18px] font-bold text-on-surface">
            {value.toLocaleString()} tokens
          </p>

          <p className="mt-1 text-[12px] text-on-surface-variant">
            Great for growing your visibility
          </p>
        </div>

        <div className="border-l border-outline-variant pl-8 text-right">
          <p className="text-[18px] font-bold text-on-surface">
            ${price.toFixed(2)} / month
          </p>

          <p className="mt-1 text-[12px] text-on-surface-variant">
            ${pricePerThousand} per 1,000 tokens
          </p>
        </div>
      </div>
    </div>
  );
}
