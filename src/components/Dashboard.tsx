import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PlatformIcon } from "./PlatformIcon";
import { StatusBadge } from "./StatusBadge";

export function Dashboard() {
  const videoStats = useQuery(api.videos.getStats);
  const referenceStats = useQuery(api.references.getStats);
  const upcomingVideos = useQuery(api.videos.getUpcoming);
  const recentReferences = useQuery(api.references.getRecent);

  if (!videoStats || !referenceStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Visão geral das suas publicações e referências</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total de Vídeos</h3>
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{videoStats.total}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Referências</h3>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{referenceStats.total}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Em Produção</h3>
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{videoStats.inProduction}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Publicados</h3>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{videoStats.published}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Vídeos por Plataforma</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform="tiktok" size="sm" />
                  <span className="font-medium text-gray-900">TikTok</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{videoStats.byPlatform.tiktok}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform="youtube" size="sm" />
                  <span className="font-medium text-gray-900">YouTube</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{videoStats.byPlatform.youtube}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform="kwai" size="sm" />
                  <span className="font-medium text-gray-900">Kwai</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{videoStats.byPlatform.kwai}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform="facebook" size="sm" />
                  <span className="font-medium text-gray-900">Facebook</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{videoStats.byPlatform.facebook}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Videos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Próximas Publicações</h3>
            {upcomingVideos && upcomingVideos.length > 0 ? (
              <div className="space-y-4">
                {upcomingVideos.map((video) => (
                  <div key={video._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <PlatformIcon platform={video.platform} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{video.title}</p>
                      <p className="text-sm text-gray-600">
                        {video.scheduledDate && new Date(video.scheduledDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <StatusBadge status={video.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma publicação agendada</p>
            )}
          </div>

          {/* Recent References */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Referências Recentes</h3>
            {recentReferences && recentReferences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentReferences.map((reference) => (
                  <div key={reference._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformIcon platform={reference.platform} size="sm" />
                      <span className="text-sm font-medium text-gray-900 truncate">{reference.title}</span>
                    </div>
                    {reference.notes && (
                      <p className="text-sm text-gray-600 line-clamp-2">{reference.notes}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {reference.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma referência salva ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
