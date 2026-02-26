import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'moodbrew.db');

let SQL;
let db;

export async function initDatabase() {
  SQL = await initSqlJs();

  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('✅ Existing database loaded');
    runMigrations();
  } else {
    db = new SQL.Database();
    console.log('📦 Creating new database');
    createSchema();
    seedData();
    saveDatabase();
    console.log('✅ Database initialized with seed data');
  }
}

function createSchema() {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    favorite_coffee TEXT,
    mood_preferences TEXT,
    cafe_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL,
    items TEXT NOT NULL,
    delivery_address TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_type TEXT NOT NULL,
    achievement_data TEXT,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES reviews(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_check_in DATE,
    points INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    mood_tag TEXT NOT NULL,
    flavor_profile TEXT,
    image_url TEXT,
    description TEXT,
    badge TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

function seedData() {
  // ── Pokhara competitor users ──────────────────────────────────────────────
  const competitors = [
    { email: 'priya@example.com', name: 'Priya Sharma', cafe: 'Lakeside Brews, Pokhara', xp: 1850, points: 925, level: 4, orders: 24, spent: 186 },
    { email: 'bikash@example.com', name: 'Bikash Gurung', cafe: 'Fishtail Coffee Co.', xp: 1640, points: 820, level: 4, orders: 19, spent: 152 },
    { email: 'anita@example.com', name: 'Anita Thapa', cafe: 'Barahi Café, Pokhara', xp: 1420, points: 710, level: 3, orders: 17, spent: 131 },
    { email: 'suresh@example.com', name: 'Suresh Acharya', cafe: 'Asan Espresso Bar', xp: 980, points: 490, level: 2, orders: 12, spent: 88 },
    { email: 'maya@example.com', name: 'Maya Poudel', cafe: 'Seti River Sips', xp: 720, points: 360, level: 2, orders: 9, spent: 64 },
  ];

  const dummyHash = '$2b$10$dummyHashForSeededUsers1234567890abcde'; // not usable for login

  for (const c of competitors) {
    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [c.email, dummyHash]);
    const res = db.exec('SELECT last_insert_rowid() as id');
    const uid = res[0].values[0][0];
    db.run('INSERT INTO profiles (user_id, name, cafe_name) VALUES (?, ?, ?)', [uid, c.name, c.cafe]);
    db.run(
      'INSERT INTO user_stats (user_id, total_orders, total_spent, points, xp, level) VALUES (?,?,?,?,?,?)',
      [uid, c.orders, c.spent, c.points, c.xp, c.level]
    );
  }

  // ── Products ─────────────────────────────────────────────────────────────
  const products = [
    { name: 'Midnight Bolt', price: 5.50, mood: 'energized', flavor: 'Bold, Chocolate', desc: 'Double-shot espresso with dark cocoa. Maximum energy boost.', badge: 'POWER UP', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop' },
    { name: 'Velvet Cloud', price: 6.25, mood: 'cozy', flavor: 'Vanilla, Nutty', desc: 'Smooth oat milk latte with Madagascar vanilla. Pure comfort.', badge: 'BEST SELLER', img: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop' },
    { name: 'Citrus Bloom', price: 5.75, mood: 'social', flavor: 'Fruity, Light', desc: 'Cold brew infused with dried orange and hibiscus. Share the vibe.', badge: 'REFRESHING', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
    { name: 'Zen Matcha', price: 6.00, mood: 'relaxed', flavor: 'Earthy, Sweet', desc: 'Premium ceremonial grade matcha with raw honey. Find your calm.', badge: 'CALORIE LOW', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
    { name: 'Aurora Latte', price: 6.75, mood: 'creative', flavor: 'Floral, Subtle', desc: 'Lavender latte with butterfly pea flower for a stunning blue hue.', badge: 'ARTISAN', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
    { name: 'Storm Brew', price: 5.00, mood: 'energized', flavor: 'Intense, Dark', desc: 'Triple-shot cold brew, no sugar, pure caffeine force.', badge: 'STRONG', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  ];

  for (const p of products) {
    db.run(
      'INSERT INTO products (name, price, mood_tag, flavor_profile, image_url, description, badge) VALUES (?,?,?,?,?,?,?)',
      [p.name, p.price, p.mood, p.flavor, p.img, p.desc, p.badge]
    );
  }
}

function runMigrations() {
  const migrations = [
    // Add xp column if missing
    `ALTER TABLE user_stats ADD COLUMN xp INTEGER DEFAULT 0`,
    // Add level column if missing
    `ALTER TABLE user_stats ADD COLUMN level INTEGER DEFAULT 1`,
    // Add cafe_name to profiles if missing
    `ALTER TABLE profiles ADD COLUMN cafe_name TEXT`,
    // Create products table if missing
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      mood_tag TEXT NOT NULL,
      flavor_profile TEXT,
      image_url TEXT,
      description TEXT,
      badge TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of migrations) {
    try { db.run(sql); } catch { /* column/table already exists */ }
  }

  // Seed products if table is empty
  const prodCount = db.exec('SELECT COUNT(*) as c FROM products');
  if (prodCount[0].values[0][0] === 0) {
    const products = [
      { name: 'Midnight Bolt', price: 5.50, mood: 'energized', flavor: 'Bold, Chocolate', desc: 'Double-shot espresso with dark cocoa.', badge: 'POWER UP', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop' },
      { name: 'Velvet Cloud', price: 6.25, mood: 'cozy', flavor: 'Vanilla, Nutty', desc: 'Smooth oat milk latte with Madagascar vanilla.', badge: 'BEST SELLER', img: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop' },
      { name: 'Citrus Bloom', price: 5.75, mood: 'social', flavor: 'Fruity, Light', desc: 'Cold brew infused with dried orange and hibiscus.', badge: 'REFRESHING', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
      { name: 'Zen Matcha', price: 6.00, mood: 'relaxed', flavor: 'Earthy, Sweet', desc: 'Premium ceremonial grade matcha with raw honey.', badge: 'CALORIE LOW', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
      { name: 'Aurora Latte', price: 6.75, mood: 'creative', flavor: 'Floral, Subtle', desc: 'Lavender latte with butterfly pea flower for a stunning blue hue.', badge: 'ARTISAN', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
      { name: 'Storm Brew', price: 5.00, mood: 'energized', flavor: 'Intense, Dark', desc: 'Triple-shot cold brew, no sugar, pure caffeine force.', badge: 'STRONG', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
    ];
    for (const p of products) {
      db.run(
        'INSERT INTO products (name, price, mood_tag, flavor_profile, image_url, description, badge) VALUES (?,?,?,?,?,?,?)',
        [p.name, p.price, p.mood, p.flavor, p.img, p.desc, p.badge]
      );
    }
  }

  // Seed Pokhara competitors if ranking is sparse
  const userCount = db.exec('SELECT COUNT(*) as c FROM users');
  if (userCount[0].values[0][0] < 3) {
    const competitors = [
      { email: 'priya@example.com', name: 'Priya Sharma', cafe: 'Lakeside Brews, Pokhara', xp: 1850, points: 925, level: 4, orders: 24, spent: 186 },
      { email: 'bikash@example.com', name: 'Bikash Gurung', cafe: 'Fishtail Coffee Co.', xp: 1640, points: 820, level: 4, orders: 19, spent: 152 },
      { email: 'anita@example.com', name: 'Anita Thapa', cafe: 'Barahi Café, Pokhara', xp: 1420, points: 710, level: 3, orders: 17, spent: 131 },
      { email: 'suresh@example.com', name: 'Suresh Acharya', cafe: 'Asan Espresso Bar', xp: 980, points: 490, level: 2, orders: 12, spent: 88 },
      { email: 'maya@example.com', name: 'Maya Poudel', cafe: 'Seti River Sips', xp: 720, points: 360, level: 2, orders: 9, spent: 64 },
    ];
    const dummyHash = '$2b$10$dummyHashForSeededUsers1234567890abcde';
    for (const c of competitors) {
      try {
        db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [c.email, dummyHash]);
        const res = db.exec('SELECT last_insert_rowid() as id');
        const uid = res[0].values[0][0];
        db.run('INSERT INTO profiles (user_id, name, cafe_name) VALUES (?, ?, ?)', [uid, c.name, c.cafe]);
        db.run(
          'INSERT INTO user_stats (user_id, total_orders, total_spent, points, xp, level) VALUES (?,?,?,?,?,?)',
          [uid, c.orders, c.spent, c.points, c.xp, c.level]
        );
      } catch { /* already exists */ }
    }
  }

  saveDatabase();
  console.log('✅ Migrations applied');
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(dbPath, buffer);
  }
}

export function run(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    let result = true;
    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const idRes = db.exec('SELECT last_insert_rowid() as id');
      result = idRes[0].values[0][0];
    }
    saveDatabase();
    return result;
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
}

export function get(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const result = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return result;
  } catch (error) {
    console.error('Database get error:', error);
    throw error;
  }
}

export function all(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Database all error:', error);
    throw error;
  }
}

export function getLastInsertId() {
  try {
    const result = db.exec('SELECT last_insert_rowid() as id');
    return result[0].values[0][0];
  } catch (error) {
    console.error('Database getLastInsertId error:', error);
    return null;
  }
}

export default { initDatabase, saveDatabase, run, get, all, getLastInsertId };
