import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartButton from "./components/Cart/CartButton";
import Cart from "./components/Cart/Cart";
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    try{
      const savedCart = localStorage.getItem("cart");
      // If there's a stored cart, skip the immediate save effect that would
      // otherwise run with the initial empty state and overwrite storage.
      if (savedCart) skipNextSaveRef.current = true;
      if(savedCart){
        const parsed = JSON.parse(savedCart);
        console.debug('Loaded cart from localStorage:', parsed);
        setCartItems(parsed)
      }
    } catch (error){
      console.error("Error loading cart from LocalStorage", error);
    }
  }, []);

  useEffect(() =>{
    try {
      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false;
        console.debug('Skipping initial save to avoid overwriting existing cart');
        return;
      }

      const asString = JSON.stringify(cartItems);
      localStorage.setItem("cart", asString);
      console.debug('Saved cart to localStorage:', cartItems, 'string:', asString);
    } catch (error){
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity) =>{

    setCartItems((prevItems) => {
      // findLast isn't available in all runtimes — use find
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem){
        const newItems = prevItems.map((item) =>
          item.product.id === product.id
            ? {...item, quantity: item.quantity + quantity}
            : item
        );
        console.debug('addToCart updating existing item', {productId: product.id, prevItems, newItems});
        return newItems;
      } else {
        const newItems = [...prevItems, {product, quantity}];
        console.debug('addToCart adding new item', {productId: product.id, newItems});
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) =>{
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem('cart', JSON.stringify(newItems));
        console.debug('removeFromCart prev:', prevItems, 'new:', newItems, 'localStorage now:', localStorage.getItem('cart'));
      } catch (e) {
        console.error('Error writing cart to localStorage during removeFromCart', e);
      }
      return newItems;
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
    prevItems.map((item) =>
    item.product.id === productId
    ? {...item, quantity: newQuantity}
    : item
      )
    );
  };

  const clearCart = () =>{
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.isOnSale
      ? item.product.salePrice
      : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return (
  <Router>
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Blogbox Store</h1>
            <p>Your E-Commerce Solution</p>
          </div>
          <CartButton
            itemCount={getCartItemCount()}
            total={getCartTotal()}
            onClick={() => setShowCart(true)}
          />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route
            path="/products/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Blogbox Store. Built with React & ASP.NET Core</p>
      </footer>

      {showCart && (
        <Cart
          items={cartItems}
          total={getCartTotal()}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  </Router>
  );
}

export default App;
