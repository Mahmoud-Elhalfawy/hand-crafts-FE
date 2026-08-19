import { FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: string;
  imageUrl?: string | null;
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
    id: 'granny-square-shoulder-bag',
    name: 'Granny Square Shoulder Bag',
    category: 'Bags',
    description: 'A compact crochet shoulder bag with floral granny squares, a long strap, and button detail.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/granny-square-shoulder-bag.jpg',
    imageAlt: 'Model wearing a cream, dusty rose, and navy granny square crochet shoulder bag',
    customisable: true,
    tags: ['bag', 'granny square', 'floral', 'shoulder bag'],
  },
  {
    id: 'granny-square-sundress',
    name: 'Granny Square Sundress',
    category: 'Dresses',
    description: 'A white sundress finished with a black and blue crochet granny square bodice.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/granny-square-sundress.jpg',
    imageAlt: 'White dress with black straps and a blue, white, and black granny square crochet bodice',
    customisable: true,
    tags: ['dress', 'granny square', 'summer', 'wearable'],
  },
  {
    id: 'open-stitch-bandana',
    name: 'Open Stitch Crochet Bandana',
    category: 'Bandanas',
    description: 'A lightweight tie-back crochet bandana with an airy open stitch pattern and scalloped edge.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/open-stitch-bandana.jpg',
    imageAlt: 'Red open stitch crochet bandana worn as a hair scarf',
    customisable: true,
    tags: ['bandana', 'hair scarf', 'red', 'open stitch'],
  },
  {
    id: 'open-stitch-bandana-blue',
    name: 'Open Stitch Crochet Bandana — Blue',
    category: 'Bandanas',
    description: 'The same airy open stitch bandana pattern in a bright blue colorway with scalloped edging.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/open-stitch-bandana-blue.jpg',
    imageAlt: 'Blue open stitch crochet bandana worn as a hair scarf',
    customisable: true,
    tags: ['bandana', 'hair scarf', 'blue', 'open stitch'],
  },
  {
    id: 'floral-lace-bandana-tan',
    name: 'Floral Lace Crochet Bandana',
    category: 'Bandanas',
    description: 'A tan floral lace crochet bandana with an open motif pattern, perfect for everyday hair styling.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/floral-lace-bandana-tan.jpg',
    imageAlt: 'Tan floral lace crochet bandana worn over loose hair',
    customisable: true,
    tags: ['bandana', 'hair scarf', 'tan', 'lace'],
  },
  {
    id: 'flower-granny-bandana',
    name: 'Flower Granny Square Bandana',
    category: 'Accessories',
    description: 'A floral granny square bandana available in bright and neutral color combinations.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/flower-granny-bandana.jpg',
    imageAlt: 'Blue and white floral granny square crochet bandana worn over loose hair',
    customisable: true,
    tags: ['bandana', 'hair scarf', 'granny square', 'floral'],
  },
  {
    id: 'multi-color-granny-bandana',
    name: 'Multi-Color Granny Bandana',
    category: 'Bandanas',
    description: 'A customizable granny square bandana made in colorways like blue, pink, green, yellow, purple, brown, black, orange, and teal.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/multi-color-granny-bandana.jpg',
    imageAlt: 'Grid of granny square crochet bandanas in multiple color options',
    customisable: true,
    tags: ['bandana', 'custom colors', 'granny square', 'floral'],
  },
  {
    id: 'tie-on-hip-scarf',
    name: 'Tie-On Crochet Hip Scarf',
    category: 'Wearables',
    description: 'A triangular crochet hip scarf that ties at the waist for styling over jeans, skirts, or beachwear.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/tie-on-hip-scarf.jpg',
    imageAlt: 'Red triangular crochet hip scarf tied over black jeans',
    customisable: true,
    tags: ['hip scarf', 'belt', 'red', 'festival'],
  },
  {
    id: 'granny-square-crop-top',
    name: 'Granny Square Crop Top',
    category: 'Tops',
    description: 'A fitted crochet crop top made from granny square panels with bold contrast straps and edging.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/granny-square-crop-top.svg',
    imageAlt: 'Black, blue, and white granny square crochet crop top worn with a white skirt',
    customisable: true,
    tags: ['top', 'granny square', 'wearable', 'summer'],
  },
  {
    id: 'granny-square-pouch',
    name: 'Granny Square Drawstring Pouch',
    category: 'Bags',
    description: 'A soft drawstring crochet pouch with floral granny square panels and scalloped edging.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/granny-square-pouch.svg',
    imageAlt: 'Stack of cream granny square crochet pouches with brown, black, pink, and blue flowers',
    customisable: true,
    tags: ['pouch', 'bag', 'drawstring', 'granny square'],
  },
  {
    id: 'lace-triangle-scarf',
    name: 'Lace Triangle Crochet Scarf',
    category: 'Accessories',
    description: 'A delicate open lace triangle scarf for layering around the neck or styling as a head covering.',
    startingPrice: 'Custom quote',
    imageUrl: '/products/lace-triangle-scarf.jpg',
    imageAlt: 'Taupe lace triangle crochet scarf styled around the neck',
    customisable: true,
    tags: ['scarf', 'lace', 'triangle scarf', 'neutral'],
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
          Each piece is crocheted by hand with thoughtful color, texture, and finish. Browse the
          catalog below or reach out to request something made just for you.
        </p>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <p className="eyebrow">Starter catalog</p>
          <h2>Pieces Nana can makes with love</h2>
          <p>Real photos from Nana&apos;s collection — more pieces can be added anytime.</p>
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
              {product.imageUrl ? (
                <img className="product-photo" src={product.imageUrl} alt={product.imageAlt} />
              ) : (
                <div className="product-art" role="img" aria-label={product.imageAlt}>
                  <span>{product.category}</span>
                </div>
              )}
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
