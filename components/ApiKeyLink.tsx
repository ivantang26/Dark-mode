"use client";

import Link from "next/link";
import { MODEL_KEY, useSessionValue } from "@/lib/session-store";
import { getModel } from "@/lib/pricing";

/**
 * "Get API key" (FR-7): routes to sign-up with the model in the URL. Pass `model` to
 * pin one; otherwise it uses the last model chosen this session (calculator, catalogue).
 */
export default function ApiKeyLink({
  model,
  className = "btn btn-primary",
  children = "Get API key",
  onClick,
}: {
  model?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const [chosen] = useSessionValue<string>(MODEL_KEY, "");
  const id = model ?? (getModel(chosen) ? chosen : "");
  const href = id ? `/signup?model=${encodeURIComponent(id)}` : "/signup";
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
