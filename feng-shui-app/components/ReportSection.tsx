interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export default function ReportSection({ title, icon, children }: Props) {
  return (
    <div className="bg-white/80 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800 mb-5 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}
