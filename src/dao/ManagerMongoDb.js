import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";


class ProductManger{

    async getProduct(){
        try{
            const products = await productModel.find();
            return products; 
        }
        catch(err){
            throw err; 
        }
    }

    async createProduct(product) {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return product;
        } catch (err) {
            throw err;
        }
    }

    async updateProduct(id, product) {
        try{
            const update = await productModel.findByIdAndUpdate(id, product);
            return update;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProd = await productModel.findByIdAndDelete(id);
            return deleteProd;
        }
        catch (err) {
            throw err;
        }
    }
}

class CartManager{

    async getCart(){
        try{
            const cart = await cartModel.find();
            return cart;
        }
        catch (err) {
            throw err;
        }
    }

    async createCart(cart){
        try{
            const newCart = new cartModel(cart);
            await newCart.save();
            return cart;
        }
        catch (err) {
            throw err;
        }
    }

    async addProductToCart(id, product){
        try{
            const cartId = await cartModel.findById(id);
            if (cartId){
                const findproduct = cartId.products
                const productCart = findproduct.findIndex(p=> p.id === product._id)
                if (productCart !== -1){
                    findproduct[productCart].quantity += 1
                    console.log(findproduct)
                    const update = {products: findproduct}
                    const updateCart = await cartModel.findByIdAndUpdate(id,  update );
                    return updateCart
                }else{
                    const productInCart = {
                        id: product._id,
                        title : product.title,
                        quantity: 1
                    }
                const cart = { products: productInCart}
                const updateCart = await cartModel.findByIdAndUpdate(id, {$push: cart});
                return updateCart;
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    async removeProductFromCart(id, product){
        try{
            const cartId = await cartModel.findById(id);
            if (cartId){
                const findproduct = cartId.products
                const productCart = findproduct.findIndex(p=> p.id === product._id)
                if (productCart !== -1){
                    if (findproduct[productCart].quantity>1){
                    findproduct[productCart].quantity -= 1
                    const update = {products: findproduct}
                    const updateCart = await cartModel.findByIdAndUpdate(id,  update );
                    return updateCart
                }else{
                    const IndexProduct = findproduct.findIndex( prod => prod.id === product._id)
                    findproduct.splice(IndexProduct,1)
                    const update = {products: findproduct}
                    const updateCart = await cartModel.findByIdAndUpdate(id, update );
                    return updateCart
                }
            }
        }
        }catch (err) {
            throw err;
        }
    }

    async deleteCart(id){
        try {
            const cart = await cartModel.findByIdAndDelete(id);
            return cart;
          } catch (err) {
            throw err;
          }
    }

}

export default {ProductManger, CartManager}