interface StatusBadgeProps {
  status: "planned" | "in_production" | "published";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    planned: {
      label: "Planejado",
      color: "bg-blue-100 text-blue-700",
    },
    in_production: {
      label: "Em Produção",
      color: "bg-orange-100 text-orange-700",
    },
    published: {
      label: "Publicado",
      color: "bg-green-100 text-green-700",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
