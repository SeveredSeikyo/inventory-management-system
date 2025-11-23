const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

describe('products', () => {
  beforeAll((done) => {
    db.serialize(() => {
      db.run('DELETE FROM products', () => {
        db.run("INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)", ['Apple Juice', 'bottle', 'Beverages', 'BrandA', 20, 'active', null], () => {
          db.run("INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)", ['Orange Juice', 'bottle', 'Beverages', 'BrandB', 15, 'active', null], done);
        });
      });
    });
  });

  test('Get Products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('Search Products by name', async () => {
    const res = await request(app).get('/api/products/search').query({ name: 'Apple' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(p => p.name && p.name.includes('Apple'))).toBe(true);
  });

  test('Filter Products by category', async () => {
    const res = await request(app).get('/api/products').query({ category: 'Beverages' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('Get Categories', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('Beverages');
  });
});