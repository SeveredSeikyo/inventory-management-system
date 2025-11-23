const express = require('express');
const db = require('../models/db');

const historyRouter = express.Router();

historyRouter.get('/products/:id/history', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT * FROM inventory_history 
     WHERE product_id = ? 
     ORDER BY change_date DESC`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch history' });
      }

      res.json(rows);
    }
  );
});

module.exports = historyRouter;
