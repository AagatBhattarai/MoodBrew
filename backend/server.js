import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dbModule from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

app.use(cors());
app.use(express.json());

await dbModule.initDatabase();
const { run, get, all } = dbModule;

// ── Auth Middleware ────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// ── Gamification Logic ─────────────────────────────────────────────────────
function calculateXP(order) {
    let xp = 20; // base per order
    try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        for (const item of items) {
            if (item.customizations) xp += Object.keys(item.customizations).length * 5;
        }
    } catch { }
    xp += Math.floor((order.total_amount || 0) * 2);
    return xp;
}

function processOrderGamification(userId, order) {
    try {
        const earnedXP = calculateXP(order);
        const earnedPoints = Math.floor(earnedXP / 2);
        const current = get('SELECT xp, points, level FROM user_stats WHERE user_id = ?', [userId]);
        if (!current) return { earnedXP, earnedPoints, levelUp: false, newLevel: 1 };
        const newXP = (current.xp || 0) + earnedXP;
        const newPoints = (current.points || 0) + earnedPoints;
        const newLevel = Math.floor(newXP / 500) + 1;
        const levelUp = newLevel > (current.level || 1);
        run('UPDATE user_stats SET xp = ?, points = ?, level = ? WHERE user_id = ?',
            [newXP, newPoints, newLevel, userId]);
        return { earnedXP, earnedPoints, levelUp, newLevel };
    } catch (e) {
        console.error('Gamification error:', e);
        return { earnedXP: 20, earnedPoints: 10, levelUp: false, newLevel: 1 };
    }
}

// ── AUTH ROUTES ────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return res.status(400).json({ error: 'Email, password, and name are required' });
        if (get('SELECT id FROM users WHERE email = ?', [email]))
            return res.status(400).json({ error: 'User already exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, passwordHash]);
        run('INSERT INTO profiles (user_id, name) VALUES (?, ?)', [userId, name]);
        run('INSERT INTO user_stats (user_id, xp, points, level) VALUES (?, 0, 0, 1)', [userId]);
        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: userId, email }, profile: { id: userId, name, email }, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' });
        const user = get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        let profile = get('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
        if (!profile) {
            const name = user.email.split('@')[0];
            run('INSERT INTO profiles (user_id, name) VALUES (?, ?)', [user.id, name]);
            profile = get('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
        }
        if (!get('SELECT id FROM user_stats WHERE user_id = ?', [user.id]))
            run('INSERT INTO user_stats (user_id, xp, points, level) VALUES (?, 0, 0, 1)', [user.id]);
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.id, email: user.email }, profile: { id: profile.id, name: profile.name, email: user.email }, token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/user', authenticateToken, (req, res) => {
    try {
        const user = get('SELECT id, email, created_at FROM users WHERE id = ?', [req.user.userId]);
        const profile = get('SELECT * FROM profiles WHERE user_id = ?', [req.user.userId]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user, profile: { ...profile, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/signout', (req, res) => res.json({ message: 'Signed out successfully' }));

// ── PROFILE ROUTES ─────────────────────────────────────────────────────────
app.get('/api/profile', authenticateToken, (req, res) => {
    try {
        res.json(get('SELECT * FROM profiles WHERE user_id = ?', [req.user.userId]));
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

app.put('/api/profile', authenticateToken, (req, res) => {
    try {
        const { name, bio, favorite_coffee, mood_preferences } = req.body;
        run(`UPDATE profiles SET name=?, bio=?, favorite_coffee=?, mood_preferences=?,
             updated_at=CURRENT_TIMESTAMP WHERE user_id=?`,
            [name, bio, favorite_coffee, mood_preferences, req.user.userId]);
        res.json(get('SELECT * FROM profiles WHERE user_id = ?', [req.user.userId]));
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// ── PRODUCTS ROUTES ────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
    try {
        const { mood } = req.query;
        const products = mood
            ? all('SELECT * FROM products WHERE LOWER(mood_tag) = LOWER(?) ORDER BY id', [mood])
            : all('SELECT * FROM products ORDER BY id', []);
        res.json(products);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const product = get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// ── ORDERS ROUTES ──────────────────────────────────────────────────────────
app.get('/api/orders', authenticateToken, (req, res) => {
    try {
        const orders = all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId]);
        const parsed = orders.map(o => ({
            ...o,
            items: (() => { try { return JSON.parse(o.items); } catch { return []; } })()
        }));
        res.json(parsed);
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/orders', authenticateToken, (req, res) => {
    try {
        const { items, total_amount, delivery_address, notes } = req.body;
        const orderId = run(
            `INSERT INTO orders (user_id, items, total_amount, delivery_address, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.userId, JSON.stringify(items), total_amount, delivery_address, notes]
        );
        run(`UPDATE user_stats SET total_orders = total_orders + 1, total_spent = total_spent + ?
             WHERE user_id = ?`, [total_amount, req.user.userId]);

        // Gamification
        const gamification = processOrderGamification(req.user.userId, { items, total_amount });

        const order = get('SELECT * FROM orders WHERE id = ?', [orderId]);
        res.json({
            ...order,
            items: (() => { try { return JSON.parse(order.items); } catch { return []; } })(),
            gamification
        });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── USER STATS ROUTES ──────────────────────────────────────────────────────
app.get('/api/stats', authenticateToken, (req, res) => {
    try {
        const s = get('SELECT * FROM user_stats WHERE user_id = ?', [req.user.userId]);
        res.json(s || { points: 0, xp: 0, level: 1, total_orders: 0, total_spent: 0, streak_days: 0 });
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// ── RANKING/LEADERBOARD ROUTES ─────────────────────────────────────────────
app.get('/api/ranking', authenticateToken, (req, res) => {
    try {
        const rows = all(`
            SELECT u.id, p.name, p.cafe_name, s.xp, s.points, s.level, s.total_orders
            FROM user_stats s
            JOIN users u ON u.id = s.user_id
            LEFT JOIN profiles p ON p.user_id = s.user_id
            ORDER BY s.xp DESC
            LIMIT 10
        `, []);
        const result = rows.map((r, i) => ({
            rank: i + 1,
            userId: r.id,
            name: r.name || 'Anonymous',
            cafe: r.cafe_name || 'MoodBrew Pokhara',
            xp: r.xp || 0,
            points: r.points || 0,
            level: r.level || 1,
            totalOrders: r.total_orders || 0,
        }));
        res.json({ ranking: result, currentUserId: req.user.userId });
    } catch (error) {
        console.error('Ranking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── REVIEWS ROUTES ─────────────────────────────────────────────────────────
app.get('/api/reviews', authenticateToken, (req, res) => {
    try {
        res.json(all('SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId]));
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

app.post('/api/reviews', authenticateToken, (req, res) => {
    try {
        const { product_name, rating, comment } = req.body;
        const reviewId = run('INSERT INTO reviews (user_id, product_name, rating, comment) VALUES (?,?,?,?)',
            [req.user.userId, product_name, rating, comment]);
        res.json(get('SELECT * FROM reviews WHERE id = ?', [reviewId]));
    } catch { res.status(500).json({ error: 'Internal server error' }); }
});

// ── HEALTH ─────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'MoodBrew API running' }));

app.listen(PORT, () => {
    console.log(`🚀 MoodBrew API → http://localhost:${PORT}`);
});
