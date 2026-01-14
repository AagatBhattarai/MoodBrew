import espressoImage from '../assets/espresso.jpeg';
import layeredLatteImage from '../assets/layered-latte.jpeg';
import latteHeartImage from '../assets/latte-heart.jpeg';
import cafeBannerImage from '../assets/cafe-banner.jpeg';
import avatarImage from '../assets/avatar.jpg';

export const design = {
  appName: 'MoodBrew',
  screens: [
    {
      screenId: 'home',
      title: '🏠 Home',
      components: {
        header: {
          greeting: 'Good Afternoon, JAVAS!',
          userAvatar: avatarImage,
          points: '2300 Points',
        },
        moodSelector: {
          title: 'How are you feeling?',
          options: [
            { id: 'energized', label: 'Energized', icon: '⚡' },
            { id: 'relaxed', label: 'Relaxed', icon: '🌿' },
            { id: 'creative', label: 'Creative', icon: '🎨' },
            { id: 'social', label: 'Social', icon: '👥' },
            { id: 'cozy', label: 'Cozy', icon: '☕' },
          ],
        },
        featureCard: {
          title: 'NEW ARRIVAL',
          subtitle: 'Spring Season',
          cta: { text: 'View Details', action: 'navigate_to_product_detail' },
          image: cafeBannerImage,
        },
        tabs: [
          { id: 'pick_up', label: 'Pick Up', icon: '🛒' },
          { id: 'delivery', label: 'Delivery', icon: '🚚' },
        ],
        products: {
          title: 'Recommended for You',
          items: [
            {
              id: '1',
              name: 'Vietnamese Spanish Latte',
              price: '$11',
              image: layeredLatteImage,
              badge: 'CALORIE LOW',
            },
            {
              id: '2',
              name: 'Café Mocha',
              price: '$11',
              image: latteHeartImage,
              badge: 'BEST DEAL',
            },
            {
              id: '3',
              name: 'Americano',
              price: '$8',
              image: espressoImage,
            },
            {
              id: '4',
              name: 'Caramel Macchiato',
              price: '$10',
              image: layeredLatteImage,
            },
          ],
        },
        desserts: {
          title: 'Sweet Treats',
          subtitle: 'Perfect pairings with your coffee',
          items: [
            {
              id: 'tiramisu',
              name: 'Classic Tiramisu',
              price: '$8',
              image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
              badge: 'BESTSELLER',
            },
            {
              id: 'cheesecake',
              name: 'New York Cheesecake',
              price: '$9',
              image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop',
              badge: 'NEW',
            },
            {
              id: 'brownie',
              name: 'Chocolate Brownie',
              price: '$6',
              image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
            },
            {
              id: 'croissant',
              name: 'Butter Croissant',
              price: '$4',
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
            },
            {
              id: 'muffin',
              name: 'Blueberry Muffin',
              price: '$5',
              image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop',
            },
            {
              id: 'donut',
              name: 'Glazed Donut',
              price: '$3',
              image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
            },
          ],
        },
        navigation: [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'orders', label: 'My Orders', icon: '🛍️' },
          { id: 'vouchers', label: 'Vouchers', icon: '🎟️' },
        ],
      },
    },
    {
      screenId: 'product_detail',
      title: '☕ Product Detail',
      components: {
        product: {
          images: [
            layeredLatteImage,
            latteHeartImage,
          ],
          calorieBadge: '245 Kcal',
          title: 'Caramel Macchiato',
          description:
            'For Creamy Dessert Lovers. Crafted With 100% Authentic French Syrup!',
          options: [
            {
              title: 'Options Available',
              required: true,
              type: 'radio',
              choices: [
                { label: 'Iced', selected: true },
                { label: 'Hot' },
              ],
            },
            {
              title: 'Topping',
              required: false,
              type: 'checkbox',
              choices: [
                { label: 'Whipped Cream' },
                { label: 'Chocolate Drizzle' },
              ],
            },
          ],
          location: {
            cafeName: 'Cafe Camilia',
            address: 'Lakeside, Pokhara, Nepal',
            distance: '0.8 km',
            rating: 4.9,
          },
          addToCart: { text: 'Add to Cart', price: '$10' },
        },
      },
    },
    {
      screenId: 'weekly_ranking',
      title: '🏆 Weekly Ranking',
      components: {
        ranking: {
          header: {
            title: 'Top Cafes This Week',
            subtitle: 'Based on user ratings and popularity',
          },
          filters: [
            { id: 'affordable', label: 'Affordable' },
            { id: 'popular', label: 'Most Popular' },
            { id: 'best_rated', label: 'Best Rated' },
            { id: 'promo', label: 'Promotions' },
            { id: 'indoor', label: 'Indoor Seating' },
          ],
          list: [
            {
              rank: 1,
              cafeName: 'Cafe Camilia',
              location: 'Lakeside, Pokhara',
              rating: 4.9,
              distance: '0.8km',
              popularItem: 'Himalayan Blend Coffee',
              price: 'Rs 250 - 450',
            },
            {
              rank: 2,
              cafeName: 'Himalayan Java',
              location: 'Lakeside, Pokhara',
              rating: 4.8,
              distance: '1.2km',
              popularItem: 'Nepali Coffee Special',
              price: 'Rs 200 - 400',
            },
            {
              rank: 3,
              cafeName: 'White Rabbit',
              location: 'Lakeside, Pokhara',
              rating: 4.7,
              distance: '0.5km',
              popularItem: 'Artisan Latte',
              price: 'Rs 300 - 500',
            },
            {
              rank: 4,
              cafeName: 'OR2K',
              location: 'Lakeside, Pokhara',
              rating: 4.6,
              distance: '1.0km',
              popularItem: 'Middle Eastern Coffee',
              price: 'Rs 180 - 350',
            },
            {
              rank: 5,
              cafeName: 'Moondance Restaurant & Cafe',
              location: 'Lakeside, Pokhara',
              rating: 4.7,
              distance: '1.5km',
              popularItem: 'Espresso Blend',
              price: 'Rs 220 - 420',
            },
          ],
          highlight: {
            cafeName: 'Cafe Camilia',
            cuisine: 'Coffee, Western, Nepali',
            rating: 4.9,
            priceRange: 'Rs 250 - 450',
            openingHours: 'Open • Closes at 21:00',
            distance: '0.8km',
            discountBadge: '15% off',
            image: cafeBannerImage,
            cta: { text: 'View Details', action: 'navigate_to_cafe_detail' },
          },
          hiddenGems: {
            title: 'Hidden Gems',
            subtitle: 'Underrated cafes worth discovering',
            items: [
              {
                id: 'perky_beans',
                cafeName: 'Perky Beans',
                location: 'Lakeside, Pokhara',
                rating: 4.5,
                distance: '0.6km',
                popularItem: 'Specialty Cold Brew',
                price: 'Rs 180 - 320',
                description: 'Cozy spot with locally sourced beans',
              },
              {
                id: 'coffee_di_sip',
                cafeName: 'Coffee Di Sip',
                location: 'Lakeside, Pokhara',
                rating: 4.4,
                distance: '1.1km',
                popularItem: 'Signature Cappuccino',
                price: 'Rs 200 - 380',
                description: 'Intimate atmosphere, great for work',
              },
              {
                id: 'cafe_mitra',
                cafeName: 'Cafe Mitra',
                location: 'Lakeside, Pokhara',
                rating: 4.3,
                distance: '0.9km',
                popularItem: 'Traditional Nepali Coffee',
                price: 'Rs 150 - 280',
                description: 'Authentic local coffee experience',
              },
              {
                id: 'the_old_inn',
                cafeName: 'The Old Inn Cafe',
                location: 'Lakeside, Pokhara',
                rating: 4.4,
                distance: '1.3km',
                popularItem: 'House Blend Coffee',
                price: 'Rs 220 - 400',
                description: 'Charming vintage setting',
              },
            ],
          },
        },
      },
    },
    {
      screenId: 'cafe_detail',
      title: '🏪 Cafe Detail',
      components: {
        cafe: {
          banner: {
            image: cafeBannerImage,
            cafeName: 'Cafe Camilia',
            rating: 4.9,
            cuisine: 'Coffee, Western, Nepali',
            priceRange: 'Rs 250 - 450',
            location: 'Lakeside, Pokhara, Nepal',
          },
          features: [
            { icon: 'Wifi', label: 'Wifi' },
            { icon: 'WC', label: 'WC' },
            { icon: 'Sofa', label: 'Sofa' },
            { icon: 'Music', label: 'Mushola' },
          ],
          menu: {
            title: 'Popular Menu',
            items: [
              {
                id: '1',
                name: 'Himalayan Blend Coffee',
                price: 'Rs 350',
                image: layeredLatteImage,
              },
              {
                id: '2',
                name: 'Nepali Coffee Special',
                price: 'Rs 300',
                image: latteHeartImage,
              },
            ],
          },
          map: {
            title: 'Location',
            mapImage: 'https://example.com/map.jpg',
            address: 'Lakeside, Pokhara, Nepal',
            cta: { text: 'Get Directions', action: 'open_navigation_app' },
          },
        },
      },
    },
  ],
  interactions: {
    moodSelection: {
      trigger: 'on_mood_select',
      action: 'update_recommendations',
      targetScreen: 'home',
    },
    productTap: {
      trigger: 'on_product_tap',
      action: 'navigate_to_product_detail',
      parameters: ['product_id'],
    },
    addToCart: {
      trigger: 'on_add_to_cart',
      action: 'add_item_to_cart',
      parameters: ['product_id', 'options'],
    },
    filterChange: {
      trigger: 'on_filter_change',
      action: 'refresh_ranking_list',
      parameters: ['filter_id'],
    },
  },
} as const;

