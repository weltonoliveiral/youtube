import { PlatformIcon } from "./PlatformIcon";
import { StatusBadge } from "./StatusBadge";

interface VideoCardProps {
  video: any;
  onEdit: (video: any) => void;
  onDelete: (id: string) => void;
}

export function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={video.platform} size="sm" />
          <StatusBadge status={video.status} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(video)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(video._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
      
      {video.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Categoria:</span>
          <span className="font-medium text-gray-900">{video.category}</span>
        </div>

        {video.scheduledDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Agendado:</span>
            <span className="font-medium text-gray-900">
              {new Date(video.scheduledDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {video.publishedDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Publicado:</span>
            <span className="font-medium text-gray-900">
              {new Date(video.publishedDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {video.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {video.link && (
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium mt-3"
          >
            Ver vídeo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
