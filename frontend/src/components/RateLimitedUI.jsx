import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="panel mb-8 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <ZapIcon className="size-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900">Rate limit reached</h3>
          <p className="mt-2 text-sm text-slate-600">
            You've made too many requests in a short period. Please wait a moment and try again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
