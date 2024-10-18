import { getProductsBySku } from "../repository/productProjections.repository ";

export const fetchProducts = async (recommended_product: any[]): Promise<any[]> => {
    const allRecommendedProducts: any[] = [];
  
    for (const sku of recommended_product) {
      try {
        const recommendedProducts = await getProductsBySku(sku);
  
        if (recommendedProducts.length > 0) {
          console.log(`Product ID for SKU "${sku}": ${recommendedProducts[0].id}`);
          allRecommendedProducts.push(recommendedProducts[0]);
        } else {
          console.log(`No products found for SKU: ${sku}`);
        }
      } catch (err) {
        console.error(`Error fetching products for SKU: ${sku}`, err);
      }
    }
  
    return allRecommendedProducts;
  };


  export const uniqueRecommendedProducts = (products: any[]): any[] => {
    return products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );
  };