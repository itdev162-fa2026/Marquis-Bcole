const API_BASE_URL = 'http://localhost:5064';

export const getProducts = async () => {
    try{
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok){
            throw new Error('failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getProductById = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok){
            throw new Error('failed to fetch product');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}