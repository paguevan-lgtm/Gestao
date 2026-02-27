import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, X, Loader2, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'EXPENSE', color: '#000000' }
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Categoria excluída');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('type', category.type);
    setValue('color', category.color);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    reset({ type: 'EXPENSE', color: '#000000' });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, data);
      } else {
        await api.post('/categories', data);
      }
      toast.success('Categoria salva');
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: category.color || '#ccc' }}
                  >
                    {category.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.type === 'INCOME' ? 'Receita' : 'Despesa'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 p-2">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900 p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
            {categories.length === 0 && (
                <li className="px-6 py-4 text-center text-gray-500">Nenhuma categoria encontrada.</li>
            )}
          </ul>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  {...register('type')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="EXPENSE">Despesa</option>
                  <option value="INCOME">Receita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cor</label>
                <input
                  type="color"
                  {...register('color')}
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
