import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ShoppingCart, User, X, Plus, Minus, Trash2,
  MapPin, CreditCard, Check, Clock, ChefHat, Truck,
  Star, Timer, DollarSign, Pizza, Fish, Soup, Salad,
  Sandwich, Coffee, Menu, ArrowLeft, Loader2
} from 'lucide-react';

// ============ TYPES ============
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  tags: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  image: string;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface User {
  name: string;
  email: string;
}

interface Address {
  street: string;
  city: string;
  zip: string;
}

type View = 'home' | 'checkout' | 'tracking';
type CheckoutStep = 'address' | 'payment' | 'processing' | 'complete';

// ============ MOCK DATA ============
const categories = [
  { id: 'all', name: 'All', icon: Menu },
  { id: 'pizza', name: 'Pizza', icon: Pizza },
  { id: 'sushi', name: 'Sushi', icon: Fish },
  { id: 'chinese', name: 'Chinese', icon: Soup },
  { id: 'healthy', name: 'Healthy', icon: Salad },
  { id: 'burgers', name: 'Burgers', icon: Sandwich },
  { id: 'cafe', name: 'Cafe', icon: Coffee },
];

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: "Mario's Pizzeria",
    category: 'pizza',
    tags: ['pizza', 'italian', 'pasta', 'cheese'],
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop',
    menu: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Fresh tomatoes, mozzarella, basil', price: 14.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=150&fit=crop' },
      { id: 'm2', name: 'Pepperoni Supreme', description: 'Double pepperoni, extra cheese', price: 17.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=150&fit=crop' },
      { id: 'm3', name: 'Garlic Bread', description: 'Crispy with herb butter', price: 5.99, image: 'https://images.unsplash.com/photo-1619531040576-f9416abb9f8b?w=200&h=150&fit=crop' },
    ],
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    category: 'sushi',
    tags: ['sushi', 'japanese', 'seafood', 'ramen'],
    rating: 4.9,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    menu: [
      { id: 's1', name: 'Dragon Roll', description: 'Eel, avocado, cucumber', price: 16.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=150&fit=crop' },
      { id: 's2', name: 'Salmon Sashimi', description: '8 pieces of fresh salmon', price: 14.99, image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200&h=150&fit=crop' },
      { id: 's3', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 4.99, image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=200&h=150&fit=crop' },
    ],
  },
  {
    id: '3',
    name: 'Golden Dragon',
    category: 'chinese',
    tags: ['chinese', 'asian', 'noodles', 'rice'],
    rating: 4.6,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
    menu: [
      { id: 'c1', name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts', price: 13.99, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&h=150&fit=crop' },
      { id: 'c2', name: 'Fried Rice', description: 'Egg, vegetables, soy sauce', price: 10.99, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=150&fit=crop' },
      { id: 'c3', name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 6.99, image: 'https://images.unsplash.com/photo-1548507200-e587eb8ba5c4?w=200&h=150&fit=crop' },
    ],
  },
  {
    id: '4',
    name: 'Green Bowl',
    category: 'healthy',
    tags: ['healthy', 'salad', 'vegan', 'organic'],
    rating: 4.7,
    deliveryTime: '15-25 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    menu: [
      { id: 'h1', name: 'Buddha Bowl', description: 'Quinoa, avocado, chickpeas', price: 12.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop' },
      { id: 'h2', name: 'Acai Bowl', description: 'Fresh berries, granola, honey', price: 11.99, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&h=150&fit=crop' },
      { id: 'h3', name: 'Green Smoothie', description: 'Spinach, banana, almond milk', price: 7.99, image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=200&h=150&fit=crop' },
    ],
  },
  {
    id: '5',
    name: 'Burger Barn',
    category: 'burgers',
    tags: ['burgers', 'american', 'fries', 'shakes'],
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    menu: [
      { id: 'b1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, pickles', price: 11.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop' },
      { id: 'b2', name: 'Bacon BBQ Burger', description: 'Crispy bacon, BBQ sauce', price: 14.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=150&fit=crop' },
      { id: 'b3', name: 'Loaded Fries', description: 'Cheese, bacon, jalapeños', price: 8.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop' },
    ],
  },
  {
    id: '6',
    name: 'Brew & Bites',
    category: 'cafe',
    tags: ['cafe', 'coffee', 'breakfast', 'pastries'],
    rating: 4.8,
    deliveryTime: '15-20 min',
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    menu: [
      { id: 'cf1', name: 'Cappuccino', description: 'Double shot espresso, steamed milk', price: 4.99, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=150&fit=crop' },
      { id: 'cf2', name: 'Avocado Toast', description: 'Sourdough, poached egg, microgreens', price: 9.99, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=150&fit=crop' },
      { id: 'cf3', name: 'Croissant', description: 'Buttery, flaky French pastry', price: 3.99, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=150&fit=crop' },
    ],
  },
];

// ============ MAIN APP COMPONENT ============
const BiteDash: React.FC = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<View>('home');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('address');
  
  // User State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  // Restaurant State
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout State
  const [address, setAddress] = useState<Address>({ street: '', city: '', zip: '' });
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Order Tracking State
  const [orderStatus, setOrderStatus] = useState(0);

  // ============ COMPUTED VALUES ============
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = cartTotal > 0 ? 3.99 : 0;
  const totalWithDelivery = cartTotal + deliveryFee;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ============ CART FUNCTIONS ============
  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // ============ CHECKOUT FUNCTIONS ============
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCart(false);
    setCurrentView('checkout');
    setCheckoutStep('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.street && address.city && address.zip) {
      setCheckoutStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber && cardExpiry && cardCvv) {
      setCheckoutStep('processing');
      setTimeout(() => {
        setCheckoutStep('complete');
        setCart([]);
        setTimeout(() => {
          setCurrentView('tracking');
          setOrderStatus(0);
          // Simulate order progress
          setTimeout(() => setOrderStatus(1), 3000);
          setTimeout(() => setOrderStatus(2), 8000);
        }, 2000);
      }, 2000);
    }
  };

  // ============ AUTH FUNCTIONS ============
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const name = email.split('@')[0];
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  // ============ NAVIGATION BAR ============
  const NavBar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => { setCurrentView('home'); setSelectedRestaurant(null); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-slate-800">BiteDash</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-slate-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">{user.name[0]}</span>
                </div>
                <button onClick={handleSignOut} className="text-sm text-slate-600 hover:text-orange-500">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // ============ AUTH MODAL ============
  const AuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <button className="text-orange-500 font-medium hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );

  // ============ CART SIDEBAR ============
  const CartSidebar = () => (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
            <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 rounded-xl">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.restaurantName}</p>
                      <p className="text-orange-500 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-red-100 rounded-lg text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 rounded-l-xl">
                          <Minus className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 rounded-r-xl">
                          <Plus className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>${totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============ RESTAURANT CARD ============
  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <button
      onClick={() => setSelectedRestaurant(restaurant)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left w-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-slate-800">{restaurant.rating}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{restaurant.name}</h3>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {restaurant.priceRange}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {restaurant.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );

  // ============ RESTAURANT DETAIL ============
  const RestaurantDetail = ({ restaurant }: { restaurant: Restaurant }) => (
    <div className="animate-in fade-in duration-300">
      <button
        onClick={() => setSelectedRestaurant(null)}
        className="flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to restaurants</span>
      </button>
      
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <Timer className="w-5 h-5" />
              {restaurant.deliveryTime}
            </span>
            <span>{restaurant.priceRange}</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Menu</h2>
      <div className="grid gap-4">
        {restaurant.menu.map(item => (
          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              <p className="text-orange-500 font-bold mt-2">${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(item, restaurant)}
              className="self-center p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ============ HOME VIEW ============
  const HomeView = () => (
    <div className="animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Delicious food,<br />
          <span className="text-orange-500">delivered fast</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Discover the best restaurants in your area and get your favorite meals delivered to your door.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search restaurants or cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-slate-800"
        />
      </div>
      
      {/* Category Scroller */}
      <div className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Restaurant Grid */}
      {selectedRestaurant ? (
        <RestaurantDetail restaurant={selectedRestaurant} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">No restaurants found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============ CHECKOUT VIEW ============
  const CheckoutView = () => (
    <div className="max-w-lg mx-auto animate-in fade-in duration-300">
      <button
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to menu</span>
      </button>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {['Address', 'Payment', 'Complete'].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = (checkoutStep === 'address' && idx === 0) ||
                          (checkoutStep === 'payment' && idx === 1) ||
                          ((checkoutStep === 'processing' || checkoutStep === 'complete') && idx === 2);
          const isCompleted = (checkoutStep === 'payment' && idx === 0) ||
                             ((checkoutStep === 'processing' || checkoutStep === 'complete') && idx <= 1);
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                isCompleted ? 'bg-green-500 text-white' :
                isActive ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`hidden sm:inline text-sm font-medium ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step}
              </span>
              {idx < 2 && <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />}
            </div>
          );
        })}
      </div>
      
      {/* Address Step */}
      {checkoutStep === 'address' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Delivery Address</h2>
              <p className="text-sm text-slate-500">Where should we deliver?</p>
            </div>
          </div>
          
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="New York"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="10001"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 mt-6"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      )}

      {/* Payment Step */}
      {checkoutStep === 'payment' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Payment Details</h2>
              <p className="text-sm text-slate-500">Enter your card information</p>
            </div>
          </div>
          
          {/* Mock Credit Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-6 text-white">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-md" />
              <span className="text-sm opacity-80">VISA</span>
            </div>
            <div className="text-xl tracking-widest mb-4 font-mono">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-80">{cardExpiry || 'MM/YY'}</span>
              <span className="opacity-80">CVV: {cardCvv ? '•••' : '•••'}</span>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                  setCardNumber(val);
                }}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                    setCardExpiry(val);
                  }}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono"
                />
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 mt-6">
              <div className="flex justify-between text-slate-600 mb-2">
                <span>Order Total</span>
                <span className="font-bold text-slate-800">${totalWithDelivery.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
            >
              Pay ${totalWithDelivery.toFixed(2)}
            </button>
          </form>
        </div>
      )}

      {/* Processing Step */}
      {checkoutStep === 'processing' && (
        <div className="bg-white rounded-3xl p-12 shadow-sm text-center animate-in fade-in duration-300">
          <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Processing Payment</h2>
          <p className="text-slate-500">Please wait while we process your order...</p>
        </div>
      )}
      
      {/* Complete Step */}
      {checkoutStep === 'complete' && (
        <div className="bg-white rounded-3xl p-12 shadow-sm text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-6">Your delicious food is on its way</p>
          <p className="text-sm text-slate-400">Redirecting to order tracking...</p>
        </div>
      )}
    </div>
  );

  // ============ ORDER TRACKING VIEW ============
  const TrackingView = () => {
    const steps = [
      { icon: Check, label: 'Order Received', description: 'Your order has been confirmed' },
      { icon: ChefHat, label: 'Preparing', description: 'The restaurant is preparing your food' },
      { icon: Truck, label: 'Out for Delivery', description: 'Your order is on the way!' },
    ];
    
    return (
      <div className="max-w-lg mx-auto animate-in fade-in duration-300">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Tracking</h1>
          <p className="text-slate-500">Order #BD{Date.now().toString().slice(-6)}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="space-y-0">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === orderStatus;
              const isCompleted = idx < orderStatus;
              
              return (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-0.5 h-16 transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className={`font-semibold transition-colors ${
                      isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      isActive || isCompleted ? 'text-slate-500' : 'text-slate-300'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-orange-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">Estimated Delivery</p>
                <p className="text-orange-500 font-bold">25-35 minutes</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => { setCurrentView('home'); setSelectedRestaurant(null); }}
          className="w-full mt-6 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  };

  // ============ MOBILE CART BUTTON ============
  const MobileCartButton = () => (
    cartItemCount > 0 && currentView === 'home' && !showCart && (
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 left-4 right-4 md:hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/40 flex items-center justify-between z-40 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">View Cart ({cartItemCount})</span>
        </div>
        <span className="font-bold">${totalWithDelivery.toFixed(2)}</span>
      </button>
    )
  );

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {currentView === 'home' && <HomeView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'tracking' && <TrackingView />}
      </main>
      
      {showAuthModal && <AuthModal />}
      {showCart && <CartSidebar />}
      <MobileCartButton />
    </div>
  );
};

export default BiteDash;
