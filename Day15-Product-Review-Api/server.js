const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json()); 
app.use(logger);         
app.use('/api/products', productRoutes); 
app.use(errorHandler);  

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
