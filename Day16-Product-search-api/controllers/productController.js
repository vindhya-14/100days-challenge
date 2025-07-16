const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const finalQuery = JSON.parse(queryStr);

   
    if (finalQuery.name) {
      finalQuery.name = { $regex: finalQuery.name, $options: 'i' };
    }

    const products = await Product.find(finalQuery);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts };
