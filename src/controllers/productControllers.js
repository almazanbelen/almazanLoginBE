//imports
const { productService } = require("../services/repositories/index");
const User = require("../dao/models/User");
const { productModel } = require("../dao/models/product.model");


//ver productos
async function getProducts(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = parseInt(req.query.sort) || "asc";
  const filter =
    req.query.category === "all"
      ? {}
      : req.query.category
      ? { category: req.query.category }
      : {};

  const options = {
    limit: limit,
    page: page,
    sort: { price: sort },
    lean: true,
  };

  let product = await productService.getProduct(filter, options);
  res.send({ result: "success", payload: product });
}

//ver productos by ID
async function productById(req, res) {
  const { pid } = req.params;
  const result = await productService.getProductById(pid);
  res.send({ status: "success", payload: result });
}

//agregar producto
async function postProduct(req, res) {
  let { title, description, code, price, stock, category, owner } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    if (code) res.send({ status: "error", error: "Faltan parámetros" });
  }
  let user = await User.findOne({_id: owner})
  
  if (user.role == "premium" || user.role == "admin") {
    let result = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      owner: { user: owner },
    });

    res.send({ result: "success", payload: result });
  } else{
    res.send({ error: "Acceso no autorizado" })
  }
}

//modificar producto
async function putProduct(req, res) {
  let { pid } = req.params;
  let productToReplace = req.body;
  if (
    !productToReplace.title ||
    !productToReplace.description ||
    !productToReplace.code ||
    !productToReplace.price ||
    !productToReplace.stock ||
    !productToReplace.category
  ) {
    res.send({ status: "error", error: "Faltan parámetros" });
  }
  let result = await productService.putProduct({ _id: pid }, productToReplace);
  res.send({ result: "success", payload: result });
}

//eliminar producto
async function deleteProduct(req, res) {
  let { pid } = req.params;
  let result = await productService.deleteProducts(pid);
  res.send({ result: "success", payload: result });
}

module.exports = {
  getProducts,
  productById,
  postProduct,
  putProduct,
  deleteProduct,
};
