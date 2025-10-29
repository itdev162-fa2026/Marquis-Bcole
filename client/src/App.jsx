import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState, useEffect} from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    try{
      const savedCart = localStorage.getItem("cart");
      if(savedCart){
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error){
      console.error("Error loading cart from LocalStorage", error);
    }
  }, []);

  useEffect(() =>{
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error){
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity) =>{
    setCartItems((prevItems) => {
      const existingItem = prevItems.findLast(
        (item) => item.product.id === product.id
      );
      if (existingItem){
        return prevItems.map.map((item) =>
        item.product.id === product.id
        ? {...item, quantity: item.quantity + quantity}
        : item);
      } else {
        return [...prevItems, {product, quantity}];
      }
    });
  };

  const removeFromCart = (productId) =>{
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.productId !== productId)
    )
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
            <h1>Blogbox Store</h1>
            <p>Your E-Commerce Solution</p>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 Blogbox Store. Built with React & ASP.NET Core</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
