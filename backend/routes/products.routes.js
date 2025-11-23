const express = require('express');
const { validationResult } = require('express-validator');
const db = require('../models/db');
const updateProductValidator = require('../utils/products.validators');

const productRouter = express.Router();

productRouter.get('/products', (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        return res.json(rows);
      });
      return;
    }
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });
      res.json(rows);
    });
  } catch (err) {
    console.log(err);
  }
});

productRouter.get('/products/search', (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name query required' });
    const pattern = `%${name}%`;
    db.all('SELECT * FROM products WHERE name LIKE ? COLLATE NOCASE', [pattern], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });
      res.json(rows);
    });
  } catch (err) {
    console.log(err);
  }
});

productRouter.get('/products/categories', (req, res) => {
  try {
    db.all('SELECT DISTINCT category FROM products', [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database query failed' });
      const categories = rows.map(r => r.category).filter(Boolean);
      res.json(categories);
    });
  } catch (err) {
    console.log(err);
  }
});

productRouter.put('/products/:id', updateProductValidator, (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, unit, category, brand, stock, status, image } = req.body;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const shouldLog = product.stock !== Number(stock);

    const next = () => {
      db.run(
        `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
        [name, unit, category, brand, stock, status, image, id],
        function (err) {
          if (err) return res.status(500).json({ error: 'Update failed' });
          return res.json({ message: 'Product updated successfully' });
        }
      );
    };

    if (shouldLog) {
      db.run(
        `INSERT INTO inventory_history 
         (product_id, old_quantity, new_quantity, change_date) 
         VALUES (?, ?, ?, ?)`,
        [id, product.stock, stock, new Date().toISOString()],
        () => next()
      );
    } else {
      next();
    }
  });
});



module.exports = productRouter;
