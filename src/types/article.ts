/**
 * Stock item interface
 */
export interface StockItem {
  id?: number;
  size: string; // Talle/Tamaño (e.g., "S", "M", "L", "XL", "42", "43")
  color: string; // Color del artículo
  quantity: number; // Cantidad en stock
  price: number; // Precio de venta (can be float)
}

/**
 * Article interface
 */
export interface Article {
  id?: number;
  codeBar: string; // Código de barras del producto
  description: string; // Descripción del producto
  brandId: number; // ID de la marca del producto
  purchasePrice: number; // Precio de compra/lista (can be float)
  categoryId: number; // ID de la categoria del producto
  stock: StockItem[]; // Array de items de stock con talle, color, cantidad y precio
}

export interface ArticleShort {
  id: number;
  codeBar: string;
  description: string;
  brand: string;
  category: string;
}