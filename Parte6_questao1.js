const express = require('express');
const productsRouter = express.Router();
const productsController = require('../controllers/products');
const authMiddleware = require('../middlewares/auth/auth');

// Rotas para produtos
productsRouter.get('/', authMiddleware, productsController.getAllProducts);
productsRouter.get('/:id', authMiddleware, productsController.getProductById);
productsRouter.post('/', authMiddleware, productsController.createProduct);
productsRouter.put('/:id', authMiddleware, productsController.updateProduct);
productsRouter.delete('/:id', authMiddleware, productsController.deleteProduct);

module.exports = productsRouter;

//////////////////////////////////////////////////////////////////////////////////////////////



const apiResponse = require('../utils/response/apiResponse');
const Products = require('../data/entities/products');

exports.getAll = async (req, res) => {
    try {
        const products = await Products.findAll();
        return apiResponse.successResponse(res, "Produtos recuperados com sucesso", products);
    } catch (error) {
        return apiResponse.errorResponse(res, "Erro ao recuperar produtos", error);
    }
}

exports.getById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Products.findById(productId);
        if (!product) {
            return apiResponse.notFoundResponse(res, "Produto não encontrado");
        }
        return apiResponse.successResponse(res, "Produto recuperado com sucesso", product);
    } catch (error) {
        return apiResponse.errorResponse(res, "Erro ao recuperar produto", error);
    }
}

exports.create = async (req, res) => {
    const newProductData = req.body;

    try {
        const createdProduct = await Products.create(newProductData);
        return apiResponse.successResponse(res, "Produto criado com sucesso", createdProduct);
    } catch (error) {
        return apiResponse.errorResponse(res, "Erro ao criar produto", error);
    }
}

exports.update = async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;

    try {
        const existingProduct = await Products.findById(productId);
        if (!existingProduct) {
            return apiResponse.notFoundResponse(res, "Produto não encontrado");
        }

        const updatedProduct = await Products.update(productId, updatedProductData);
        return apiResponse.successResponse(res, "Produto atualizado com sucesso", updatedProduct);
    } catch (error) {
        return apiResponse.errorResponse(res, "Erro ao atualizar produto", error);
    }
}

exports.delete = async (req, res) => {
    const productId = req.params.id;

    try {
        const existingProduct = await Products.findById(productId);
        if (!existingProduct) {
            return apiResponse.notFoundResponse(res, "Produto não encontrado");
        }

        await Products.delete(productId);
        return apiResponse.successResponse(res, "Produto excluído com sucesso");
    } catch (error) {
        return apiResponse.errorResponse(res, "Erro ao excluir produto", error);
    }
}
