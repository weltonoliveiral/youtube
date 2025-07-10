import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ReferenceForm } from "./ReferenceForm";
import { ReferenceCard } from "./ReferenceCard";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { toast } from "sonner";

export function ReferenceManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingReference, setEditingReference] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    platform: undefined as any,
    folder: undefined as any,
  });

  const references = useQuery(api.references.list, filters);
  const searchResults = useQuery(
    api.references.search,
    searchTerm ? { searchTerm, ...filters } : "skip"
  );
  const deleteReference = useMutation(api.references.remove);

  const displayReferences = searchTerm ? searchResults : references;

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta referência?")) {
      try {
        await deleteReference({ id: id as any });
        toast.success("Referência excluída com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir referência");
      }
    }
  };

  const handleEdit = (reference: any) => {
    setEditingReference(reference);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReference(null);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Referências</h2>
            <p className="text-gray-600">Colete e organize referências criativas</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Referência
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar referências por título ou tag..."
          />
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            type="references"
          />
        </div>

        {displayReferences ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayReferences.map((reference) => (
              <ReferenceCard
                key={reference._id}
                reference={reference}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {displayReferences && displayReferences.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma referência encontrada</h3>
            <p className="text-gray-600 mb-4">Comece salvando sua primeira referência</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Salvar Referência
            </button>
          </div>
        )}

        {showForm && (
          <ReferenceForm
            reference={editingReference}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
}
