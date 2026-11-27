import { useEffect, useMemo, useRef, useState } from "react";

const products = [
  {
    id: 1,
    name: "The Everyday Runner",
    category: "Running",
    price: 118,
    rating: "4.9",
    reviews: 128,
    badge: "Bestseller",
    colors: ["#d55943", "#d9d4c8", "#687159"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82",
    description:
      "Light on your feet and ready for wherever today goes. Soft cushioning, a breathable upper, and a just-right fit make this an everyday favorite.",
  },
  {
    id: 2,
    name: "The Court Classic",
    category: "Sneakers",
    price: 98,
    rating: "4.8",
    reviews: 96,
    badge: "Easy favorite",
    colors: ["#e6e2d9", "#4c514b", "#bb8269"],
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=82",
    description:
      "A clean, timeless sneaker with a cushioned sole and a versatile shape. The pair you'll reach for on repeat.",
  },
  {
    id: 3,
    name: "The Weekend Walker",
    category: "Lifestyle",
    price: 110,
    rating: "4.9",
    reviews: 74,
    badge: "",
    colors: ["#c3b9a6", "#52574f", "#d1a18c"],
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=82",
    description:
      "Made for wandering without watching the clock. Soft lining and a flexible sole keep every step comfortable.",
  },
  {
    id: 4,
    name: "The Easy Pace",
    category: "Running",
    price: 125,
    rating: "4.7",
    reviews: 53,
    badge: "New",
    colors: ["#d2d1c7", "#d4ad8b", "#687159"],
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=82",
    description:
      "A dependable running companion with a soft landing and an easy, lightweight feel. Your route, your pace.",
  },
  {
    id: 5,
    name: "The City Sneaker",
    category: "Sneakers",
    price: 105,
    rating: "4.8",
    reviews: 81,
    badge: "",
    colors: ["#e3ddd1", "#7d8069", "#4b4d48"],
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=82",
    description:
      "A little polish, a lot of comfort. This low-profile sneaker goes from the morning commute to wherever the evening takes you.",
  },
  {
    id: 6,
    name: "The Trail Seeker",
    category: "Running",
    price: 135,
    rating: "4.9",
    reviews: 67,
    badge: "Made to roam",
    colors: ["#7c8267", "#d1b894", "#474a45"],
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=82",
    description:
      "For the path that keeps going. Grippy traction, steady support, and a comfortable fit for your next outside-the-lines adventure.",
  },
  {
    id: 7,
    name: "The Sunday Slip-On",
    category: "Lifestyle",
    price: 89,
    rating: "4.7",
    reviews: 42,
    badge: "",
    colors: ["#c1ad94", "#d8d4c9", "#727664"],
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=82",
    description:
      "A no-fuss favorite that slips on and heads out. Easy comfort with a relaxed shape for the best kind of slow day.",
  },
  {
    id: 8,
    name: "The Daily Essential",
    category: "Sneakers",
    price: 115,
    rating: "4.8",
    reviews: 109,
    badge: "Staff pick",
    colors: ["#dedbd1", "#ad735d", "#646a58"],
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=82",
    description:
      "The shoes that somehow go with everything. Thoughtful details, dependable comfort, and a shape that feels right every time.",
  },
];

const categories = ["All", "Sneakers", "Running", "Lifestyle"];
const storageKey = "sole-society-cart";
const freeShippingThreshold = 100;
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const getProduct = (id) =>
  products.find((product) => product.id === Number(id));

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item) =>
        Number.isInteger(item.productId) &&
        getProduct(item.productId) &&
        typeof item.size === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch (error) {
    console.error("Could not read the saved shopping bag.", error);
    return [];
  }
}

function Icon({ name }) {
  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function Header({ count, onOpenCart, onSearch, search }) {
  return (
    <>
      <div className="announcement">
        <p>
          Free shipping on orders over $100 <span>·</span> Easy 30-day returns
        </p>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Sole Society home">
          sole<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop">Shop all</a>
          <a href="#shop" data-nav-category="Sneakers">
            Sneakers
          </a>
          <a href="#shop" data-nav-category="Running">
            Running
          </a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <label className="search-box" htmlFor="search-input">
            <Icon name="search" />
            <input
              id="search-input"
              type="search"
              placeholder="Search shoes..."
              autoComplete="off"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
          <button
            className="icon-button cart-trigger"
            onClick={onOpenCart}
            aria-label="Open shopping bag"
          >
            <Icon name="bag" />
            <span className="cart-count">{count > 99 ? "99+" : count}</span>
          </button>
        </div>
      </header>
    </>
  );
}

function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className="product-card">
      <div
        className="product-image-wrap"
        onClick={() => onOpen(product)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(product);
          }
        }}
        tabIndex="0"
        role="button"
        aria-label={`View ${product.name} details`}
      >
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        <button
          className="quick-add"
          onClick={(event) => {
            event.stopPropagation();
            onAdd(product);
          }}
          aria-label={`Quick add ${product.name}`}
        >
          Quick add <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">
            {currency.format(product.price)}
          </span>
        </div>
        <div className="product-meta">
          <span>
            {product.category} ·{" "}
            <span className="product-rating">★ {product.rating}</span> (
            {product.reviews})
          </span>
          <span
            className="color-dots"
            aria-label={`${product.colors.length} colors`}
          >
            {product.colors.map((color) => (
              <i
                className="color-dot"
                style={{ background: color }}
                key={color}
              />
            ))}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProductDialog({ product, onClose, onAdd }) {
  const [size, setSize] = useState("8");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (product) {
      setSize("8");
      dialogRef.current?.showModal();
    } else if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [product]);

  return (
    <dialog
      className="product-dialog"
      ref={dialogRef}
      aria-label="Product details"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Close product details"
      >
        ×
      </button>
      {product && (
        <>
          <img
            className="dialog-image"
            src={product.image}
            alt={product.name}
          />
          <div className="dialog-info">
            <span className="eyebrow">
              {product.category} · ★ {product.rating} ({product.reviews}{" "}
              reviews)
            </span>
            <h2>{product.name}</h2>
            <p className="dialog-price">{currency.format(product.price)}</p>
            <p className="dialog-description">{product.description}</p>
            <span className="size-label">Choose your size (US)</span>
            <div
              className="size-options"
              role="group"
              aria-label="Choose shoe size"
            >
              {["6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].map(
                (shoeSize) => (
                  <button
                    key={shoeSize}
                    className={`size-button${size === shoeSize ? " selected" : ""}`}
                    onClick={() => setSize(shoeSize)}
                    aria-pressed={size === shoeSize}
                  >
                    {shoeSize}
                  </button>
                ),
              )}
            </div>
            <button
              className="button button-dark dialog-add"
              onClick={() => onAdd(product, size)}
            >
              Add to bag <span>{currency.format(product.price)}　→</span>
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

function CartDrawer({ cart, onClose, onChangeQuantity, onRemove, onCheckout }) {
  const { items, open } = cart;
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + getProduct(item.productId).price * item.quantity,
    0,
  );
  const empty = items.length === 0;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={onClose} />
      <aside
        className={`cart-drawer${open ? " open" : ""}`}
        aria-label="Shopping bag"
        aria-modal="true"
        role="dialog"
        aria-hidden={!open}
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">YOUR GOOD FINDS</span>
            <h2>
              Your bag <span>({count})</span>
            </h2>
          </div>
          <button
            className="icon-button close-drawer"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            ×
          </button>
        </div>
        <div className={`cart-items${empty ? " empty" : ""}`}>
          {items.map((item) => {
            const product = getProduct(item.productId);
            return (
              <article
                className="cart-item"
                key={`${item.productId}-${item.size}`}
              >
                <img src={product.image} alt="" />
                <div className="cart-item-info">
                  <h3>{product.name}</h3>
                  <p>Size {item.size}</p>
                  <div
                    className="quantity-control"
                    aria-label={`Quantity for ${product.name}`}
                  >
                    <button
                      onClick={() => onChangeQuantity(item, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onChangeQuantity(item, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <strong>
                    {currency.format(product.price * item.quantity)}
                  </strong>
                  <button
                    className="remove-item"
                    onClick={() => onRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className={`cart-empty${empty ? " visible" : ""}`}>
          <span>♡</span>
          <h3>Your next favorite is out there.</h3>
          <p>Find a pair that feels like you.</p>
          <button className="button button-dark" onClick={onClose}>
            Keep looking
          </button>
        </div>
        {!empty && (
          <div className="cart-footer">
            <div className="shipping-note">
              {remaining === 0
                ? "You’ve unlocked free shipping. Nice one!"
                : `You’re ${currency.format(remaining)} away from free shipping.`}
            </div>
            <div className="subtotal-row">
              <span>Subtotal</span>
              <strong>{currency.format(subtotal)}</strong>
            </div>
            <p>Shipping and taxes calculated at checkout.</p>
            <button
              className="button button-dark checkout-button"
              onClick={onCheckout}
            >
              Continue to checkout <span aria-hidden="true">→</span>
            </button>
            <span className="demo-note">
              Frontend demo · no payment will be processed
            </span>
          </div>
        )}
      </aside>
    </>
  );
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartItems, setCartItems] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Could not save the shopping bag.", error);
      notify("Your bag could not be saved in this browser.");
    }
  }, [cartItems]);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", cartOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [cartOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = products.filter(
      (product) =>
        (category === "All" || product.category === category) &&
        (!query ||
          `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(query)),
    );
    if (sort === "price-low") matches.sort((a, b) => a.price - b.price);
    if (sort === "price-high") matches.sort((a, b) => b.price - a.price);
    if (sort === "rating")
      matches.sort((a, b) => Number(b.rating) - Number(a.rating));
    return matches;
  }, [category, search, sort]);

  const count = cartItems.reduce((total, item) => total + item.quantity, 0);

  function notify(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }

  function addToCart(product, size = "8") {
    setCartItems((current) => {
      const existing = current.find(
        (item) => item.productId === product.id && item.size === size,
      );
      if (existing)
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      return [...current, { productId: product.id, size, quantity: 1 }];
    });
    notify(`${product.name} added to your bag.`);
  }

  function changeQuantity(item, amount) {
    setCartItems((current) =>
      current
        .map((entry) =>
          entry.productId === item.productId && entry.size === item.size
            ? { ...entry, quantity: entry.quantity + amount }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  function removeFromCart(item) {
    setCartItems((current) =>
      current.filter(
        (entry) =>
          !(entry.productId === item.productId && entry.size === item.size),
      ),
    );
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
  }

  function resetFilters() {
    setCategory("All");
    setSearch("");
  }

  return (
    <>
      <Header
        count={count}
        onOpenCart={() => setCartOpen(true)}
        onSearch={setSearch}
        search={search}
      />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> A better kind of everyday
            </span>
            <h1 id="hero-title">
              Find your
              <br />
              own <em>stride.</em>
            </h1>
            <p>
              Good shoes take you places. Find the pair that feels like it was
              made for yours.
            </p>
            <a className="button button-dark" href="#shop">
              Shop the collection <span aria-hidden="true">↗</span>
            </a>
            <div className="hero-note">
              <div className="avatar-stack" aria-hidden="true">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </div>
              <p>
                <strong>4.9/5</strong> from 2,000+ happy feet
              </p>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src={products[0].image.replace("w=900", "w=1400")}
              alt="Bright red running shoe against a warm-toned background"
            />
            <div className="hero-image-tag">
              <span>THE EVERYDAY RUNNER</span>
              <strong>Made to move.</strong>
            </div>
            <div className="hero-sticker" aria-hidden="true">
              WALK
              <br />
              YOUR
              <br />
              WAY
            </div>
          </div>
          <span className="hero-index" aria-hidden="true">
            01 / 03
          </span>
        </section>

        <section className="benefits" aria-label="Shopping benefits">
          <div>
            <span className="benefit-icon">✳</span>
            <p>
              <strong>Thoughtfully picked</strong>
              <br />
              Better shoes, fewer choices
            </p>
          </div>
          <div>
            <span className="benefit-icon">↗</span>
            <p>
              <strong>Free shipping</strong>
              <br />
              On every order over $100
            </p>
          </div>
          <div>
            <span className="benefit-icon">↺</span>
            <p>
              <strong>Easy returns</strong>
              <br />
              30 days to find your fit
            </p>
          </div>
          <div>
            <span className="benefit-icon">♡</span>
            <p>
              <strong>Made for real life</strong>
              <br />
              Comfort comes first
            </p>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE GOOD STUFF</span>
              <h2>
                Find your new <em>favorite.</em>
              </h2>
            </div>
            <p className="product-total">
              {visibleProducts.length}{" "}
              {visibleProducts.length === 1 ? "pair" : "pairs"}
            </p>
          </div>
          <div className="shop-toolbar">
            <div
              className="category-tabs"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((name) => (
                <button
                  key={name}
                  className={`category-tab${category === name ? " active" : ""}`}
                  onClick={() => selectCategory(name)}
                >
                  {name === "All" ? "All shoes" : name}
                </button>
              ))}
            </div>
            <label className="sort-control" htmlFor="sort-select">
              Sort by
              <select
                id="sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setSelectedProduct}
                  onAdd={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>◌</span>
              <h3>No shoes found just yet.</h3>
              <p>Try another search or browse all of our favorites.</p>
              <button className="button button-dark" onClick={resetFilters}>
                Show all shoes
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="story">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=85"
              alt="A pair of shoes ready for a walk outdoors"
              loading="lazy"
            />
            <span className="story-image-caption">TAKE THE LONG WAY HOME.</span>
          </div>
          <div className="story-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> A little about us
            </span>
            <h2>
              Less noise.
              <br />
              More <em>good steps.</em>
            </h2>
            <p>
              We think finding shoes you love should feel simple. So we put
              together a thoughtful collection of comfortable, good-looking
              pairs for everywhere the day takes you.
            </p>
            <a className="text-link" href="#shop">
              Get to know our collection <span aria-hidden="true">→</span>
            </a>
            <div className="story-number">SS — 2025</div>
          </div>
        </section>

        <section className="newsletter">
          <div>
            <span className="eyebrow">A GOOD THING IN YOUR INBOX</span>
            <h2>
              We’ll keep it <em>light.</em>
            </h2>
            <p>New arrivals, good stories, and 10% off your first order.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              const email = new FormData(event.currentTarget).get("email");
              setNewsletterMessage(`You’re on the list, ${email}. (Demo only)`);
              event.currentTarget.reset();
            }}
          >
            <label className="visually-hidden" htmlFor="email-input">
              Your email address
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              placeholder="Your email address"
              required
            />
            <button type="submit">
              Count me in <span aria-hidden="true">→</span>
            </button>
            <p id="newsletter-message" aria-live="polite">
              {newsletterMessage}
            </p>
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#">
          sole<span>.</span>
        </a>
        <p>Good shoes. Good days. Wherever you’re headed.</p>
        <span>© 2025 Sole Society</span>
      </footer>

      <CartDrawer
        cart={{ items: cartItems, open: cartOpen }}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={changeQuantity}
        onRemove={removeFromCart}
        onCheckout={() =>
          notify("This storefront is a frontend demo—checkout isn’t connected.")
        }
      />
      <ProductDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(product, size) => {
          addToCart(product, size);
          setSelectedProduct(null);
          setCartOpen(true);
        }}
      />
      <div
        className={`toast${toast ? " visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}
