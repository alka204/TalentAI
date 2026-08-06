export default function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="glass-card flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
      </div>
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon size={20} />
        </span>
      )}
    </div>
  );
}
