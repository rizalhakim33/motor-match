export default function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "warning" | "note";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-800",
      content: "text-blue-700",
    },
    tip: {
      container: "bg-green-50 border-green-200",
      icon: "text-green-600",
      title: "text-green-800",
      content: "text-green-700",
    },
    warning: {
      container: "bg-amber-50 border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-800",
      content: "text-amber-700",
    },
    note: {
      container: "bg-surface-50 border-surface-200",
      icon: "text-surface-600",
      title: "text-surface-800",
      content: "text-surface-600",
    },
  };

  const s = styles[type];
  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    note: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-xl border p-4 ${s.container}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex-shrink-0 ${s.icon}`}>{icons[type]}</span>
        <div className={`text-sm ${s.content}`}>
          {title && (
            <p className={`font-semibold mb-1 ${s.title}`}>{title}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
