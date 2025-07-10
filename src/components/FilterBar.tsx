import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PlatformIcon } from "./PlatformIcon";

interface FilterBarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  type: "videos" | "references";
}

export function FilterBar({ filters, onFiltersChange, type }: FilterBarProps) {
  const categories = useQuery(api.categories.list);
  const folders = useQuery(api.folders.list);

  const platforms = [
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "kwai", label: "Kwai" },
    { value: "facebook", label: "Facebook" },
  ];

  const statuses = [
    { value: "planned", label: "Planejado" },
    { value: "in_production", label: "Em Produção" },
    { value: "published", label: "Publicado" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Plataforma:</label>
        <select
          value={filters.platform || ""}
          onChange={(e) => onFiltersChange({ ...filters, platform: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Todas</option>
          {platforms.map((platform) => (
            <option key={platform.value} value={platform.value}>
              {platform.label}
            </option>
          ))}
        </select>
      </div>

      {type === "videos" && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filters.status || ""}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Categoria:</label>
            <select
              value={filters.category || ""}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {categories?.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {type === "references" && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Pasta:</label>
          <select
            value={filters.folder || ""}
            onChange={(e) => onFiltersChange({ ...filters, folder: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {folders?.map((folder) => (
              <option key={folder._id} value={folder.name}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(filters.platform || filters.status || filters.category || filters.folder) && (
        <button
          onClick={() => onFiltersChange({})}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
