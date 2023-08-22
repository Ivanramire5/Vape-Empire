import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    title : {
        type: String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    code : {
        type : String,
        require : true,
        unique : true
    },
    price : {
        type : Number,
        require : true
    },
    status : {
        type : Boolean
    },
    stock : {
        type : Number,
        require : true
    },
    category : {
        type : String,
        require : true
    },
    thumbnail : {
        type : String,
        require : true
    },
    quantity :{
        type: Number,
        require: true
    }
})
productsSchema.plugin(mongoosePaginate)
function addToCart(id, product) {
  let carrito = "64d6c953ddbeb56bf9552e7e";
  postCart(id, carrito)
    .then((dato) => {
      alert("producto agregado al carrito", dato);
    })
    .catch((err) => console.log(err, "no se agrego el producto "));
}

async function postCart(id, carrito) {
  try {
    const response = await fetch(`/api/carts/${carrito}/product/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function increase(idCart, idProduct) {
  console.log(idCart, idProduct);
  let carrito = "64d6c953ddbeb56bf9552e7e";
  postCart(idProduct, carrito)
    .then((dato) => {
      alert("producto agregado al carrito", dato);
    })
    .catch((err) => console.log(err, "no se agrego el producto "));
}
const ProductsModel = mongoose.model(productsCollection,productsSchema)

export default ProductsModel

