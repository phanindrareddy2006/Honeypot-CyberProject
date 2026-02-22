import { Link } from "react-router-dom";
import "./Home.css";

const products = [
  { id: 1, name: "iPhone 15 Pro", price: "$999", emoji: "📱", tag: "New" },
  { id: 2, name: 'MacBook Pro 16"', price: "$2,499", emoji: "💻", tag: "Hot" },
  { id: 3, name: "AirPods Max", price: "$549", emoji: "🎧", tag: "Sale" },
  { id: 4, name: "iPad Air", price: "$599", emoji: "📲", tag: null },
  { id: 5, name: "Apple Watch Ultra", price: "$799", emoji: "⌚", tag: "New" },
  { id: 6, name: "Sony PS5", price: "$499", emoji: "🎮", tag: "Hot" },
];

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🔥 Big Sale — Up to 60% Off</span>
          <h1>
            Discover the <span className="gradient-text">Latest Tech</span> at
            Unbeatable Prices
          </h1>
          <p className="hero-subtitle">
            Shop from thousands of premium products with fast delivery and
            secure checkout. Your satisfaction, guaranteed.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
            <a href="#products" className="btn-secondary">
              Browse Products
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow"></div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="section-header">
          <h2>Trending Products</h2>
          <p>Handpicked deals just for you</p>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} className="product-card" key={p.id}>
              {p.tag && <span className="product-tag">{p.tag}</span>}
              <div className="product-emoji">{p.emoji}</div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">{p.price}</p>
              <button className="add-to-cart">Add to Cart</button>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-banner">
        <div className="trust-item">
          <span className="trust-icon">🚀</span>
          <div>
            <strong>Free Shipping</strong>
            <p>Orders over $50</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <div>
            <strong>Secure Payment</strong>
            <p>256-bit SSL</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">↩️</span>
          <div>
            <strong>Easy Returns</strong>
            <p>30-day policy</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">💬</span>
          <div>
            <strong>24/7 Support</strong>
            <p>Always here</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;