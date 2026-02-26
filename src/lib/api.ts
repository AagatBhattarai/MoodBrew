// Local API client
const API_URL = 'http://localhost:3001/api';

function getToken() { return localStorage.getItem('auth_token'); }
function setToken(token: string) { localStorage.setItem('auth_token', token); }
function removeToken() { localStorage.removeItem('auth_token'); }

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

interface AuthSession { user: { id: number; email: string }; token: string | null; }

export const auth = {
    async signUp(email: string, password: string, name: string) {
        try {
            const data = await fetchWithAuth('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) });
            setToken(data.token);
            return { data, error: null };
        } catch (error) { return { data: null, error: { message: (error as Error).message } }; }
    },
    async signIn(email: string, password: string) {
        try {
            const data = await fetchWithAuth('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
            setToken(data.token);
            return { data, error: null };
        } catch (error) { return { data: null, error: { message: (error as Error).message } }; }
    },
    async signOut() {
        try { await fetchWithAuth('/auth/signout', { method: 'POST' }); } catch { }
        removeToken();
        return { error: null };
    },
    async getUser() {
        try {
            const token = getToken();
            if (!token) return { data: null, error: null };
            const data = await fetchWithAuth('/auth/user');
            return { data, error: null };
        } catch (error) {
            const err = error as Error;
            if (err.message.includes('401') || err.message.includes('403') || err.message.includes('404')) {
                removeToken();
                return { data: null, error: null };
            }
            return { data: null, error: { message: err.message } };
        }
    },
    onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
        const token = getToken();
        if (token) {
            auth.getUser().then(({ data, error }) => {
                if (data && !error) callback('SIGNED_IN', { user: data.user, token });
                else callback('SIGNED_OUT', null);
            });
        } else {
            callback('SIGNED_OUT', null);
        }
        return { data: { subscription: { unsubscribe: () => { } } } };
    },
};

interface ProfileData { name?: string; bio?: string; favorite_coffee?: string; mood_preferences?: string; }
export const profile = {
    async get() { return fetchWithAuth('/profile'); },
    async update(data: ProfileData) { return fetchWithAuth('/profile', { method: 'PUT', body: JSON.stringify(data) }); },
};

export interface OrderItem {
    productId: string;
    name: string;
    basePrice: number;
    quantity: number;
    moodContext?: string;
    totalItemPrice: number;
}

interface OrderData { items: OrderItem[]; total_amount: number; delivery_address?: string; notes?: string; }
export const orders = {
    async getAll() { return fetchWithAuth('/orders'); },
    async create(orderData: OrderData) {
        return fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(orderData) });
    },
};

export const stats = {
    async get() { return fetchWithAuth('/stats'); },
};

export interface Product {
    id: number;
    name: string;
    price: number;
    mood_tag: string;
    flavor_profile: string;
    image_url: string;
    description: string;
    badge?: string;
}

export const products = {
    async getAll(mood?: string): Promise<Product[]> {
        const qs = mood ? `?mood=${encodeURIComponent(mood)}` : '';
        return fetchWithAuth(`/products${qs}`);
    },
    async getById(id: number): Promise<Product> {
        return fetchWithAuth(`/products/${id}`);
    },
};

export interface RankingEntry {
    rank: number;
    userId: number;
    name: string;
    cafe: string;
    xp: number;
    points: number;
    level: number;
    totalOrders: number;
}

export const ranking = {
    async getAll(): Promise<{ ranking: RankingEntry[]; currentUserId: number }> {
        return fetchWithAuth('/ranking');
    },
};

interface ReviewData { product_name: string; rating: number; comment?: string; }
export const reviews = {
    async getAll() { return fetchWithAuth('/reviews'); },
    async create(reviewData: ReviewData) { return fetchWithAuth('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }); },
};

export const api = { auth, profile, orders, stats, products, ranking, reviews };
