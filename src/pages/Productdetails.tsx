import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductByIdQuery, addToCart } from '../redux';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(id!, {
    skip: !id,
  });

  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    if (!product) return;

    dispatch(addToCart(product));
    setAdded(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setAdded(false);
      timerRef.current = null;
    }, 2000);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101114] text-gray-300">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />
          <p className="text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101114] px-6 text-center">
        <div className="rounded-2xl border border-[#303137] bg-[#17191e] p-8">
          <h1 className="text-xl font-semibold text-gray-100">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            We couldn't load this product. Please try browsing the collection.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101114] text-gray-100">
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Back Navigation */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-blue-400"
        >
          <span aria-hidden="true">←</span>
          Back to Products
        </Link>

        {/* Product Details */}
        <section className="mt-7 grid gap-8 rounded-2xl border border-[#303137] bg-[#17191e] p-5 sm:p-7 md:grid-cols-2 md:gap-10 lg:p-10">
          {/* Product Image */}
          <div className="flex min-h-80 items-center justify-center rounded-xl border border-[#303137] bg-[#f7f7f7] p-8 .sm:min-h-[420px]">
            <img
              src={product.image}
              alt={product.title}
              className=".max-h-[360px] w-full object-contain"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              {product.category}
            </p>

            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-gray-100 sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            <div className="mt-6 border-b border-[#303137] pb-6">
              <p className="text-sm text-gray-500">Price</p>

              <p className="mt-1 text-3xl font-bold text-gray-100">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-200">
                Product Description
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                {product.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-lg border border-[#303137] bg-[#101114] p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                ✓
              </span>

              <div>
                <p className="text-sm font-medium text-gray-200">
                  Available to shop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Add this item to your cart whenever you're ready.
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-7 w-full rounded-lg border border-gray-600 bg-[#252830] px-6 py-3.5 text-sm font-semibold text-gray-100 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#17191e]"
            >
              Add to Cart
            </button>

            {/* Success Message */}
            <div
              role="status"
              aria-live="polite"
              className={`overflow-hidden text-center text-sm font-medium text-emerald-400 transition-all duration-200 ${
                added ? 'mt-3 max-h-10 opacity-100' : 'mt-0 max-h-0 opacity-0'
              }`}
            >
              ✓ Added to your cart!
            </div>

            <Link
              to="/cart"
              className="mt-4 text-center text-sm font-medium text-gray-400 transition hover:text-blue-400"
            >
              View Shopping Cart →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductDetails;
