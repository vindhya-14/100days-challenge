let products = [];

const getAllProducts = (req, res) => {
  res.json(products);
};

const addProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    const err = new Error("Name and price are required.");
    err.status = 400;
    return next(err);
  }
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

module.exports = { getAllProducts, addProduct };
