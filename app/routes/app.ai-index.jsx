import { useEffect, useState } from "react";
import { llmFilesApi } from "../lib/api";
import { useAuth } from "../context/Authcontext";

export const loader = async () => null;

export default function AiIndex() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const load = async () => {
    try {
      setData((await llmFilesApi.get()).data);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    if (token) load();
  }, [token]);
  async function generate() {
    setBusy(true);
    setError(null);
    try {
      setData((await llmFilesApi.generate()).data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    setBusy(true);
    setError(null);
    try {
      await llmFilesApi.publish();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const files = data?.files || {};
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-on-surface text-headline-md">AI Store Index</h1>
        <p className="mt-2 text-on-surface-variant text-mono-sm">
          Generate and publish Shopify's agent-discovery templates without
          changing product data.
        </p>
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={generate}
          disabled={busy}
          className="rounded-xl bg-primary px-4 py-3 text-on-primary font-semibold"
        >
          {busy ? "Working..." : "Generate files"}
        </button>
        <button
          onClick={publish}
          disabled={busy || !files.agents}
          className="rounded-xl border border-outline-variant px-4 py-3 text-on-surface font-semibold"
        >
          Publish to Shopify
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["agents.md", files.agents],
          ["llms.txt", files.llms],
          ["llms-full.txt", files.llmsFull],
        ].map(([name, value]) => (
          <section
            key={name}
            className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
          >
            <h2 className="font-semibold text-on-surface">{name}</h2>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-on-surface-variant">
              {value || "Not generated"}
            </pre>
          </section>
        ))}
      </div>
      {data?.publishedAt && (
        <p className="text-sm text-green-win">
          Published {new Date(data.publishedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
