import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  type RootState,
} from '../redux';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen bg-[#101114] px-4 py-10 text-gray-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-400">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#17191e] px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <svg
                className="h-10 w-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 8H6"
                />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-white">
              Your cart is empty
            </h2>
            <p className="mt-3 text-gray-400">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#17191e] p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-white p-3 sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-lg font-semibold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">Price per item</p>
                    <p className="mt-1 text-lg font-semibold text-gray-100">
                      {formatPrice(item.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="mt-3 text-sm font-medium text-red-400 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#101114]">
                      <button
                        type="button"
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="px-3 py-2 text-lg text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-10 text-center font-medium text-white">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="px-3 py-2 text-lg text-gray-300 transition hover:bg-white/5"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Item total</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-white/10 bg-[#17191e] p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-white">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-400">Items</span>
                  <span className="font-medium text-gray-200">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-200">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Shipping is calculated at checkout.
                  </p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-7 block w-full rounded-lg bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-500"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="mt-4 block text-center text-sm text-gray-400 transition hover:text-blue-400"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
