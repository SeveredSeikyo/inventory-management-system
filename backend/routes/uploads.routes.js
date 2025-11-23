const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../models/db');

const uploadRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

uploadRouter.post('/products/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  let added = 0;
  let skipped = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      const processNext = (i) => {
        if (i >= results.length) {
          fs.unlinkSync(req.file.path);
          return res.json({ added, skipped });
        }

        const { name, unit, category, brand, stock, status, image } = results[i];

        db.get('SELECT * FROM products WHERE name = ?', [name], (err, product) => {
          if (product) {
            skipped++;
            return processNext(i + 1);
          }

          db.run(
            `INSERT INTO products (name, unit, category, brand, stock, status, image)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, unit, category, brand, stock || 0, status || 'In Stock', image || ''],
            (err) => {
              if (!err) added++;
              processNext(i + 1);
            }
          );
        });
      };

      processNext(0);
    });
});


uploadRouter.get('/products/export', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    let csv = 'id,name,unit,category,brand,stock,status,image\n';

    rows.forEach((p) => {
      csv += `${p.id},${p.name},${p.unit || ''},${p.category || ''},${p.brand || ''},${p.stock},${p.status || ''},${p.image || ''}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  });
});

module.exports = uploadRouter;
