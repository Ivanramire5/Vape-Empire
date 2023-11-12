
import Users from "../../dao/mongo/UserMongooseDao.js"
import Products from "../../dao/mongo/ProductMongooseDao.js"
import CartMongooseDao from "../../dao/mongo/CartMongooseDao.js"

import CartRepository from "../../dao/repository/cartRepository.js"
import ProductRepository from "../../dao/repository/productRepository.js"
import UserRepository from "../../dao/repository/userRepository"

export const cartService = new CartRepository(new CartMongooseDao())
export const userService = new UserRepository(new Users())
export const productService = new ProductRepository(new Products())