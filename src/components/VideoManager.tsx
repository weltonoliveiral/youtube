import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VideoForm } from "./VideoForm";
import { VideoCard } from "./VideoCard";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { toast } from "sonner";

export function VideoManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    platform: undefined as any,
    status: undefined as any,
    category: undefined as any,
  });

  const videos = useQuery(api.videos.list, filters);
  const searchResults = useQuery(
    api.videos.search,
    searchTerm ? { searchTerm, ...filters } : "skip"
  );
  const deleteVideo = useMutation(api.videos.remove);

  const displayVideos = searchTerm ? searchResults : videos;

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este vídeo?")) {
      try {
        await deleteVideo({ id: id as any });
        toast.success("Vídeo excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir vídeo");
      }
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVideo(null);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Vídeos</h2>
            <p className="text-gray-600">Organize suas publicações e planejamento editorial</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Publicação
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar vídeos por título, tag ou categoria..."
          />
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            type="videos"
          />
        </div>

        {displayVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        {displayVideos && displayVideos.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-gray-600 mb-4">Comece criando sua primeira publicação</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Criar Vídeo
            </button>
          </div>
        )}

        {showForm && (
          <VideoForm
            video={editingVideo}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
}
