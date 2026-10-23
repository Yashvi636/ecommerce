import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetProductsQuery, addToCart } from '../redux';
import type { Product } from '../redux';

function Products() {
  const dispatch = useDispatch();

  const { data: products, isLoading, isError } = useGetProductsQuery();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const categories = [
    'All',
    ...new Set(products?.map((product) => product.category) ?? []),
  ];

  const filteredProducts = (products ?? []).filter(
    (product) =>
      selectedCategory === 'All' || product.category === selectedCategory,
  );

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  function handleAddToCart(product: Product) {
    dispatch(addToCart(product));
    setAddedProductId(product.id);

    setTimeout(() => {
      setAddedProductId((currentId) =>
        currentId === product.id ? null : currentId,
      );
    }, 1800); 
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#101114] px-5 py-20 text-center text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#343740] border-t-blue-500" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#101114] px-5 py-20 text-center text-white">
        <h1 className="text-2xl font-bold">Unable to load products</h1>
        <p className="mt-3 text-gray-400">
          Please check your internet connection and try again.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101114] px-4 py-10 text-[#ececf0] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Heading */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            SHOPZONE COLLECTION
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Explore Products
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Find your favourites and discover something new for your
                everyday needs.
              </p>
            </div>

            <Link
              to="/cart"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-[#343740] bg-[#17191e] px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-[#20232b]"
            >
              View Cart <span className="ml-2 text-blue-400">→</span>
            </Link>
          </div>
        </section>

        {/* Category filters */}
        <section className="mb-8 rounded-2xl border border-[#303137] bg-[#17191e] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">
              Shop by Category
            </h2>

            <span className="text-xs text-gray-500">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-[#343740] bg-[#111318] text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#303137] bg-[#17191e] px-5 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Try choosing a different category.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#303137] bg-[#17191e] transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-black/20"
              >
                {/* Image */}
                <Link
                  to={`/products/${product.id}`}
                  aria-label={`View ${product.title}`}
                  className="flex h-60 items-center justify-center overflow-hidden bg-white p-6"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 truncate text-xs capitalize text-blue-400">
                    {product.category}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                    className="text-white transition hover:text-blue-400"
                  >
                    <h2 className="line-clamp-2 .min-h-[3rem] text-sm font-semibold leading-6">
                      {product.title}
                    </h2>
                  </Link>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-bold text-white">
                      {formatPrice(product.price)}
                    </p>

                    <span className="text-xs text-amber-400">
                      ★ {product.rating.rate}
                      <span className="ml-1 text-gray-500">
                        ({product.rating.count})
                      </span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex min-h-11 items-center justify-center rounded-xl border border-[#343740] px-2 text-center text-xs font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white sm:text-sm"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`min-h-11 rounded-xl px-2 text-xs font-semibold text-white transition active:scale-[0.98] sm:text-sm ${
                        addedProductId === product.id
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      {addedProductId === product.id
                        ? '✓ Added'
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;
