import { Toast } from "./UI";
import { useAnalysisTracker } from "../context/AnalysisTrackerContext";

export default function GlobalAnalysisToast() {
  const { toast } = useAnalysisTracker();
  if (!toast) return null;
  return <Toast key={toast.id} msg={toast.msg} type={toast.type} />;
}
