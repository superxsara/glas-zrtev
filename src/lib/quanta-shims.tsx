// Quanta component shims — produce visually identical output using plain HTML + Tailwind
import type { ReactNode, CSSProperties } from "react";

// ─── Button ───
type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "marketingPrimary" | "danger" | "dangerSoft" | "brandSoft";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  start?: ReactNode;
  end?: ReactNode;
  children?: ReactNode;
};

const buttonVariants: Record<string, CSSProperties> = {
  primary: { backgroundColor: "#c0392b", color: "white" },
  secondary: { backgroundColor: "white", color: "#0a0a0a" },
  tertiary: { backgroundColor: "rgba(255,255,255,0.06)", color: "#f5f5f5", backdropFilter: "blur(8px)" },
  ghost: { backgroundColor: "transparent", color: "#a3a3a3" },
  marketingPrimary: { background: "linear-gradient(to bottom, #d9ff2e, #b8e000)", color: "#0a0a0a" },
  danger: { backgroundColor: "#dc2626", color: "white" },
};

const buttonSizes: Record<string, string> = {
  xs: "px-2 py-1 text-xs gap-1",
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export function Button({ variant = "tertiary", size = "md", disabled, onClick, className = "", start, end, children }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${buttonSizes[size]} ${className}`}
      style={buttonVariants[variant] ?? buttonVariants.tertiary}
    >
      {start}<span>{children}</span>{end}
    </button>
  );
}

// ─── Card ───
type CardProps = {
  surface?: "solid" | "glass";
  className?: string;
  children?: ReactNode;
};

export function Card({ surface = "solid", className = "", children }: CardProps) {
  const bg = surface === "solid" ? "#171717" : "rgba(255,255,255,0.04)";
  return <div className={`rounded-2xl border border-neutral-800 ${className}`} style={{ backgroundColor: bg }}>{children}</div>;
}

// ─── Icon (wraps lucide-react icons) ───
type IconProps = {
  as?: React.ComponentType<{ size?: string | number; className?: string }>;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const iconSizes: Record<string, number> = { xs: 14, sm: 16, md: 20, lg: 24 };

export function Icon({ as: Component, size = "sm", className = "" }: IconProps) {
  if (!Component) return null;
  return <Component size={iconSizes[size]} className={className} />;
}

// ─── Loader ───
type LoaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  "aria-label"?: string;
};

export function Loader({ size = "sm" }: LoaderProps) {
  const dims: Record<string, number> = { xs: 14, sm: 16, md: 24, lg: 32 };
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-neutral-700 border-t-white"
      style={{ width: dims[size], height: dims[size] }}
    />
  );
}

// ─── Tabs ───
type TabsRootProps = { variant?: string; value: string; onValueChange: (v: string) => void; className?: string; children?: ReactNode };
type TabsListProps = { className?: string; items?: { value: string; label: string; start?: ReactNode }[] };
type TabsPanelProps = { value: string; className?: string; children?: ReactNode };

export const Tabs = {
  Root: ({ value, onValueChange, className = "", children }: TabsRootProps) => {
    return (
      <div className={`flex flex-col gap-5 ${className}`}>
        {children}
      </div>
    );
  },
  List: ({ className = "", items = [] }: TabsListProps) => {
    // Tabs.List is rendered by the parent which manages state
    // We render the tab buttons here
    return null; // The actual tab buttons are rendered in AppDetailTemplate
  },
  Panel: ({ value: _value, className = "", children }: TabsPanelProps) => {
    return <div className={className}>{children}</div>;
  },
};

// ─── Textarea ───
type TextareaProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  label?: string;
  description?: string;
  error?: string;
};

export function Textarea({ value, onChange, placeholder, rows = 3, maxLength }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm text-white placeholder-neutral-600 focus:border-campaign-red focus:outline-none"
    />
  );
}

// ─── Typography ───
type TypographyProps = {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
  variant?: string;
  color?: "primary" | "secondary" | "tertiary" | "danger";
  className?: string;
  role?: string;
  truncate?: boolean;
  children?: ReactNode;
};

const typographyVariants: Record<string, string> = {
  "display-lg-bold": "text-4xl font-bold",
  "display-md-bold": "text-3xl font-bold",
  "headline-sm-semi-bold": "text-lg font-semibold",
  "headline-md-semi-bold": "text-xl font-semibold",
  "title-md-semi-bold": "text-base font-semibold",
  "title-sm-semi-bold": "text-sm font-semibold",
  "body-md-regular": "text-base font-normal",
  "body-sm-regular": "text-sm font-normal",
  "body-sm-medium": "text-sm font-medium",
  "caption-sm-regular": "text-xs font-normal",
  "caption-sm-medium": "text-xs font-medium",
  "label-lg-medium": "text-sm font-medium",
  "label-md-medium": "text-sm font-medium",
  "label-md-regular": "text-sm font-normal",
  "label-sm-medium": "text-xs font-medium",
  "label-sm-regular": "text-xs font-normal",
  "accent-xl-bold": "text-2xl font-bold uppercase",
};

const typographyColors: Record<string, string> = {
  primary: "text-white",
  secondary: "text-neutral-400",
  tertiary: "text-neutral-500",
  danger: "text-red-400",
};

export function Typography({ as: Tag = "p", variant = "body-sm-regular", color, className = "", role, truncate, children }: TypographyProps) {
  const variantClass = typographyVariants[variant] ?? "text-sm";
  const colorClass = color ? typographyColors[color] ?? "" : "";
  const truncateClass = truncate ? "truncate" : "";
  return <Tag role={role} className={`${variantClass} ${colorClass} ${truncateClass} ${className}`}>{children}</Tag>;
}

// ─── Toaster + toast ───
export function Toaster() {
  return null; // No toast in standalone version; alerts used instead
}

export const toast = {
  success: (msg: string) => console.log("✓", msg),
  error: (msg: string) => console.error("✗", msg),
  info: (msg: string) => console.log("ℹ", msg),
};
