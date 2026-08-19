import { FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: string;
  imageAlt: string;
  customisable: boolean;
  tags: string[];
};

type InquiryForm = {
  name: string;
  email: string;
  phone: string;
  interestedProduct: string;
  message: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const fallbackProducts: Product[] = [
  {
    id: 'cozy-baby-blanket',
    name: 'Cozy Baby Blanket',
    category: 'Baby Gifts',
    description: 'A soft crochet blanket made for newborn gifts, stroller walks, and nursery keepsakes.',
    startingPrice: 'Custom quote',
    imageAlt: 'Folded handmade crochet baby blanket in soft neutral yarn',
    customisable: true,
    tags: ['blanket', 'baby', 'gift'],
  },
  {
    id: 'amigurumi-keepsake',
    name: 'Amigurumi Keepsake Toy',
    category: 'Amigurumi',
    description: 'A made-to-order crochet character or animal designed as a playful handmade keepsake.',
    startingPrice: 'Custom quote',
    imageAlt: 'Small crochet amigurumi toy with stitched details',
    customisable: true,
    tags: ['toy', 'custom', 'keepsake'],
  },
  {
    id: 'market-tote',
    name: 'Market Tote',
    category: 'Accessories',
    description: 'A sturdy crochet tote for errands, yarn shopping, beach days, or everyday use.',
    startingPrice: 'Custom quote',
    imageAlt: 'Reusable crochet tote bag with long handles',
    customisable: true,
    tags: ['bag', 'accessory', 'reusable'],
  },
];

const initialForm: InquiryForm = {
  name: '',
  email: '',
  phone: '',
  interestedProduct: '',
  message: '',
};

function App() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState<InquiryForm>(initialForm);
  const [formStatus, setFormStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiBaseUrl}/api/products`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load products');
        }
        return response.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch(() => {
        setProducts(fallbackProducts);
      });

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Inquiry request failed');
      }

      setForm(initialForm);
      setFormStatus("Thank you. Nana's Hand Crafts received your request.");
    } catch {
      setFormStatus('Your message is ready, but the API is not reachable right now. Please try again when the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Nana's Hand Crafts home">
          <span className="mini-mark" aria-hidden="true">
            <span />
          </span>
          <span>Nana's Hand Crafts</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#custom">Custom orders</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Crocheted with love</p>
          <h1>Handmade crochet pieces for cozy homes and thoughtful gifts.</h1>
          <p>
            Nana's Hand Crafts creates soft, personal crochet work inspired by gentle colors,
            keepsake details, and the warmth of handmade gifting.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#products">
              View starter catalog
            </a>
            <a className="button secondary" href="#contact">
              Request a custom piece
            </a>
          </div>
        </div>

        <div className="hero-card" aria-label="Nana's Hand Crafts logo-inspired artwork">
          <div className="logo-ring">
            <p>Nana's</p>
            <div className="yarn-mark">
              <span className="needle" />
              <span className="yarn-ball" />
              <span className="heart-thread" />
            </div>
            <p>Hand Crafts</p>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div>
          <p className="eyebrow">About the brand</p>
          <h2>Slow-made, soft-textured, and personal.</h2>
        </div>
        <p>
          This starter site is ready for your real product photos and listings. For now, it
          presents a polished brand home with placeholder catalog items and custom order flow.
        </p>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <p className="eyebrow">Starter catalog</p>
          <h2>Pieces Nana can make</h2>
          <p>Swap these placeholders with the actual products when you send the product details.</p>
        </div>

        <div className="category-pills" aria-label="Product categories">
          {categories.map((category) => (
            <button
              className={category === selectedCategory ? 'active' : ''}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-art" role="img" aria-label={product.imageAlt}>
                <span>{product.category}</span>
              </div>
              <div className="product-content">
                <p className="category">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span>{product.startingPrice}</span>
                  {product.customisable ? <span>Customisable</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="custom-section" id="custom">
        <div>
          <p className="eyebrow">Custom orders</p>
          <h2>Choose the color, size, texture, and story.</h2>
        </div>
        <div className="steps">
          <article>
            <span>01</span>
            <h3>Share the idea</h3>
            <p>Tell Nana what you want made, who it is for, and any inspiration details.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Pick the details</h3>
            <p>Decide yarn colors, size, pattern style, deadline, and personalization.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Handmade finish</h3>
            <p>Each piece is crocheted with care and prepared as a meaningful handmade gift.</p>
          </article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">Contact Nana</p>
          <h2>Ask about a piece or request something custom.</h2>
          <p>
            The form posts to the Quarkus backend at <code>{apiBaseUrl}</code>. Set
            <code> VITE_API_BASE_URL</code> for deployment.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="Optional"
            />
          </label>
          <label>
            Product or idea
            <input
              value={form.interestedProduct}
              onChange={(event) => setForm({ ...form, interestedProduct: event.target.value })}
              placeholder="Baby blanket, tote, custom toy..."
            />
          </label>
          <label>
            Message
            <textarea
              required
              minLength={10}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Tell Nana about colors, size, deadline, and any inspiration."
            />
          </label>
          <button className="button primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending...' : 'Send inquiry'}
          </button>
          {formStatus ? <p className="form-status">{formStatus}</p> : null}
        </form>
      </section>
    </main>
  );
}

export default App;
