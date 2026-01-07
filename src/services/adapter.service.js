// Adaptador para convertir datos de PostgreSQL al formato esperado por el frontend

export const adapter = {
  // Convertir producto de PostgreSQL a formato frontend
  adaptProduct(pgProduct) {
    if (!pgProduct) return null;

    // Adaptar categoría
    let category = null;
    if (pgProduct.categoria_id) {
      category = {
        _id: pgProduct.categoria_id?.toString(),
        name: pgProduct.categoria_nombre || 'Sin categoría'
      };
    }

    // Adaptar imágenes
    let images = [];
    if (pgProduct.imagenes) {
      if (Array.isArray(pgProduct.imagenes)) {
        images = pgProduct.imagenes;
      } else if (typeof pgProduct.imagenes === 'string') {
        try {
          images = JSON.parse(pgProduct.imagenes);
        } catch (e) {
          images = [pgProduct.imagenes];
        }
      }
    }

    // Adaptar variantes
    let variants = [];
    if (pgProduct.variantes) {
      if (Array.isArray(pgProduct.variantes)) {
        variants = this.adaptVariants(pgProduct.variantes);
      } else if (typeof pgProduct.variantes === 'string') {
        try {
          const parsed = JSON.parse(pgProduct.variantes);
          variants = this.adaptVariants(parsed);
        } catch (e) {
          console.error('Error parseando variantes:', e);
        }
      }
    }

    return {
      _id: pgProduct.id?.toString(),
      name: pgProduct.nombre,
      slug: pgProduct.slug,
      description: pgProduct.descripcion,
      category,
      images,
      variants,
      featured: pgProduct.destacado || false,
      isNew: pgProduct.nuevo || false,
      active: pgProduct.activo !== false,
      createdAt: pgProduct.created_at
    };
  },

  // Convertir productos
  adaptProducts(pgProducts) {
    if (!Array.isArray(pgProducts)) return [];
    
    return pgProducts.map(p => {
      const adapted = this.adaptProduct(p);
      
      // Si no hay variantes, crear una por defecto
      if (!adapted.variants || adapted.variants.length === 0) {
        adapted.variants = [{
          _id: `${adapted._id}-default`,
          sku: `SKU-${adapted._id}`,
          color: 'Negro',
          size: 'Único',
          stock: 10,
          purchasePrice: 100000,
          salePrice: 150000
        }];
      }
      
      // Si no hay imágenes, usar placeholder
      if (!adapted.images || adapted.images.length === 0) {
        const colors = ['d946ef', 'a855f7', '2dd4bf', 'f0abfc', 'c026d3'];
        const randomColor = colors[adapted._id ? parseInt(adapted._id) % colors.length : 0];
        adapted.images = [
          `https://via.placeholder.com/400x400/${randomColor}/ffffff?text=${encodeURIComponent(adapted.name?.substring(0, 15) || 'Producto')}`
        ];
      }
      
      return adapted;
    });
  },

  // Convertir variante de PostgreSQL a formato frontend
  adaptVariant(pgVariant) {
    if (!pgVariant) return null;

    return {
      _id: pgVariant.id?.toString(),
      sku: pgVariant.sku,
      color: pgVariant.color,
      size: pgVariant.talla || pgVariant.size,
      stock: pgVariant.stock || 0,
      purchasePrice: pgVariant.precio_compra || pgVariant.purchasePrice || 0,
      salePrice: pgVariant.precio_venta || pgVariant.salePrice || 0
    };
  },

  // Convertir variantes
  adaptVariants(pgVariants) {
    if (!Array.isArray(pgVariants)) return [];
    return pgVariants.map(v => this.adaptVariant(v));
  },

  // Convertir usuario de PostgreSQL a formato frontend
  adaptUser(pgUser) {
    if (!pgUser) return null;

    return {
      _id: pgUser.id?.toString(),
      name: pgUser.nombre,
      email: pgUser.email,
      phone: pgUser.telefono,
      role: pgUser.rol === 'cliente' ? 'customer' : pgUser.rol, // Convertir 'cliente' a 'customer' para el frontend
      active: pgUser.activo !== false,
      createdAt: pgUser.created_at
    };
  },

  // Convertir producto de frontend a PostgreSQL
  productToPostgres(frontProduct) {
    return {
      nombre: frontProduct.name,
      slug: frontProduct.slug,
      descripcion: frontProduct.description,
      categoria_id: frontProduct.category,
      imagenes: frontProduct.images,
      destacado: frontProduct.featured,
      nuevo: frontProduct.isNew
    };
  },

  // Convertir variante de frontend a PostgreSQL
  variantToPostgres(frontVariant) {
    return {
      sku: frontVariant.sku,
      color: frontVariant.color,
      talla: frontVariant.size,
      stock: frontVariant.stock,
      precio_compra: frontVariant.purchasePrice,
      precio_venta: frontVariant.salePrice
    };
  }
};