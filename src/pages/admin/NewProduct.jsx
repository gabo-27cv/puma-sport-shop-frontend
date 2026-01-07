import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

export default function NewProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id; // Esto detecta si hay ID en la URL

  console.log('🔍 NewProduct - ID:', id, '| isEdit:', isEdit); // Debug

  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    categoria_id: '',
    descripcion: '',
    imagenes: [],
    variantes: [
      {
        sku: '',
        color: '',
        talla: '',
        stock: 0,
        precio_compra: 0,
        precio_venta: 0
      }
    ],
    destacado: false,
    nuevo: false
  });

  useEffect(() => {
    loadCategorias();
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadCategorias = async () => {
    try {
      const response = await api.get('/categories');
      console.log('📦 Categorías recibidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      const data = response.data;
      if (Array.isArray(data)) {
        setCategorias(data);
      } else if (data.categorias && Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else if (data.rows && Array.isArray(data.rows)) {
        setCategorias(data.rows);
      } else {
        console.error('❌ Formato de categorías no reconocido:', data);
        setCategorias([]);
      }
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      setCategorias([]);
    }
  };

  const loadProduct = async () => {
    try {
      console.log('📡 Cargando producto ID:', id);
      
      // Intentar cargar por ID primero, luego por slug
      let response;
      try {
        // Intentar por ID numérico
        response = await api.get(`/products/id/${id}`);
      } catch (error) {
        if (error.response?.status === 404) {
          // Si no encuentra por ID, intentar como slug
          console.log('⚠️ No encontrado por ID, intentando como slug...');
          response = await api.get(`/products/slug/${id}`);
        } else {
          throw error;
        }
      }
      
      console.log('📦 Producto cargado:', response.data);
      const data = response.data;
      
      setFormData({
        nombre: data.nombre || '',
        slug: data.slug || '',
        categoria_id: data.categoria_id || '',
        descripcion: data.descripcion || '',
        imagenes: data.imagenes || [],
        variantes: data.variantes && data.variantes.length > 0 ? data.variantes : [{
          sku: '',
          color: '',
          talla: '',
          stock: 0,
          precio_compra: 0,
          precio_venta: 0
        }],
        destacado: data.destacado || false,
        nuevo: data.nuevo || false
      });
    } catch (error) {
      console.error('❌ Error loading product:', error);
      alert('Error al cargar el producto: ' + (error.response?.data?.error || error.message));
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Auto-generate slug from nombre
    if (name === 'nombre') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variantes];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'stock' || field === 'precio_compra' || field === 'precio_venta' 
        ? Number(value) 
        : value
    };
    setFormData({ ...formData, variantes: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variantes: [
        ...formData.variantes,
        {
          sku: '',
          color: '',
          talla: '',
          stock: 0,
          precio_compra: 0,
          precio_venta: 0
        }
      ]
    });
  };

  const removeVariant = (index) => {
    if (formData.variantes.length === 1) {
      alert('Debe haber al menos una variante');
      return;
    }
    const newVariants = formData.variantes.filter((_, i) => i !== index);
    setFormData({ ...formData, variantes: newVariants });
  };

  const handleImageAdd = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        imagenes: [...formData.imagenes, url]
      });
    }
  };

  const removeImage = (index) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index);
    setFormData({ ...formData, imagenes: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📤 Enviando producto:', formData);
      
      if (isEdit) {
        await api.put(`/products/${id}`, formData);
        alert('Producto actualizado exitosamente');
      } else {
        await api.post('/products', formData);
        alert('Producto creado exitosamente');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('❌ Error saving product:', error);
      console.error('❌ Response:', error.response?.data);
      alert('Error al guardar el producto: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Actualiza la información del producto' : 'Agrega un nuevo producto a tu inventario'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Se genera automáticamente</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Sin categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📷 Imágenes</h2>
            <button
              type="button"
              onClick={handleImageAdd}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={20} />
              Agregar Imagen
            </button>
          </div>

          {formData.imagenes.length === 0 ? (
            <div className="text-center py-12 bg-purple-50 rounded-lg">
              <ImageIcon size={48} className="mx-auto text-purple-300 mb-4" />
              <p className="text-gray-600">No hay imágenes agregadas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.imagenes.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150/d946ef/ffffff?text=Error';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏷️ Variantes</h2>
            <button
              type="button"
              onClick={addVariant}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={20} />
              Agregar Variante
            </button>
          </div>

          <div className="space-y-4">
            {formData.variantes.map((variant, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Variante {index + 1}</h3>
                  {formData.variantes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      className="input-field"
                      placeholder="SKU-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Color *
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="input-field"
                      placeholder="Negro"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Talla *
                    </label>
                    <input
                      type="text"
                      value={variant.talla}
                      onChange={(e) => handleVariantChange(index, 'talla', e.target.value)}
                      className="input-field"
                      placeholder="35-38"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Compra *
                    </label>
                    <input
                      type="number"
                      value={variant.precio_compra}
                      onChange={(e) => handleVariantChange(index, 'precio_compra', e.target.value)}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Venta *
                    </label>
                    <input
                      type="number"
                      value={variant.precio_venta}
                      onChange={(e) => handleVariantChange(index, 'precio_venta', e.target.value)}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Opciones</h2>
          
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-semibold text-gray-700">⭐ Producto Destacado</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="nuevo"
                checked={formData.nuevo}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-semibold text-gray-700">🆕 Producto Nuevo</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}