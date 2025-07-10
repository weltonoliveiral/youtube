import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PlatformIcon } from "./PlatformIcon";
import { toast } from "sonner";

interface ReferenceFormProps {
  reference?: any;
  onClose: () => void;
}

export function ReferenceForm({ reference, onClose }: ReferenceFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    platform: "tiktok" as "tiktok" | "youtube" | "kwai" | "facebook",
    notes: "",
    tags: [] as string[],
    folder: "",
  });
  const [tagInput, setTagInput] = useState("");

  const folders = useQuery(api.folders.list);
  const createReference = useMutation(api.references.create);
  const updateReference = useMutation(api.references.update);
  const createFolder = useMutation(api.folders.create);

  useEffect(() => {
    if (reference) {
      setFormData({
        title: reference.title || "",
        link: reference.link || "",
        platform: reference.platform || "tiktok",
        notes: reference.notes || "",
        tags: reference.tags || [],
        folder: reference.folder || "",
      });
    }
  }, [reference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (reference) {
        await updateReference({ id: reference._id, ...formData });
        toast.success("Referência atualizada com sucesso!");
      } else {
        await createReference(formData);
        toast.success("Referência salva com sucesso!");
      }
      
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar referência");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNewFolder = async () => {
    const name = prompt("Nome da nova pasta:");
    if (name) {
      try {
        await createFolder({ name, color: "#3B82F6" });
        setFormData(prev => ({ ...prev, folder: name }));
        toast.success("Pasta criada!");
      } catch (error) {
        toast.error("Erro ao criar pasta");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {reference ? "Editar Referência" : "Nova Referência"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título da referência"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link *
            </label>
            <input
              type="url"
              required
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma *
              </label>
              <div className="space-y-2">
                {(["tiktok", "youtube", "kwai", "facebook"] as const).map((platform) => (
                  <label key={platform} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={formData.platform === platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                      className="text-blue-600"
                    />
                    <PlatformIcon platform={platform} size="sm" />
                    <span className="font-medium capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pasta
                </label>
                <button
                  type="button"
                  onClick={handleNewFolder}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Nova pasta
                </button>
              </div>
              <select
                value={formData.folder}
                onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sem pasta</option>
                {folders?.map((folder) => (
                  <option key={folder._id} value={folder.name}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anotações Criativas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Estratégias observadas, ideias criativas, insights..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite uma tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {reference ? "Atualizar" : "Salvar"} Referência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
