import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { clearCart, type RootState } from '../redux';
import { getCurrentUser } from '../utils/auth';

// 1. Validation schema
const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  address: z.string().trim().min(1, 'Full address is required'),
  city: z.string().trim().min(1, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const user = getCurrentUser();

  const [orderError, setOrderError] = useState('');

  // 2. React Hook Form setup
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    },
  });

  // 3. Price formatting
  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // 4. Calculate order totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // 5. Place order
  const onSubmit = async (data: CheckoutFormData) => {
    setOrderError('');

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty. Please add products before checkout.');
      return;
    }

    const order = {
      id: `SZ-${Date.now()}`,
      userId: user.id,
      customer: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        address: data.address.trim(),
        city: data.city.trim(),
        pincode: data.pincode,
      },
      items: cart.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
      status: 'order placed',
      createdAt: new Date().toISOString(),
    };

    try {
      const storageKey = `shopzone_orders_${user.id}`;
      const storedOrders = localStorage.getItem(storageKey);
      const savedOrders: unknown = JSON.parse(storedOrders || '[]');

      if (!Array.isArray(savedOrders)) {
        throw new Error('Invalid saved orders data');
      }

      localStorage.setItem(storageKey, JSON.stringify([...savedOrders, order]));

      dispatch(clearCart());

      // OrderSuccess.tsx has been removed, so return to Products.
      navigate('/products', {
        replace: true,
        state: { orderPlaced: true, orderId: order.id },
      });
    } catch {
      setError('root', {
        type: 'manual',
        message:
          'Unable to save your order. Please check your browser storage and try again.',
      });
    }
  };

  const inputClass =
    'mt-2 w-full rounded-xl border border-[#343740] bg-[#101114] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

  const labelClass = 'mb-1 block text-sm font-medium text-gray-300';

  const errorClass = 'mt-2 text-xs text-red-400';

  // 6. Login guard
  if (!user) {
    return (
      <main className="min-h-screen bg-[#101114] px-4 py-16 text-center text-gray-200">
        <h1 className="text-2xl font-bold text-white">Please log in</h1>
        <p className="mt-3 text-gray-400">
          You need to log in before placing an order.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  // 7. Empty cart guard
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#101114] px-4 py-16 text-center text-gray-200">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#17191e] p-8">
          <h1 className="text-2xl font-bold text-white">Your Cart Is Empty</h1>
          <p className="mt-3 text-gray-400">
            Add some products to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // 8. Checkout UI
  return (
    <main className="min-h-screen bg-[#101114] px-4 py-10 text-gray-200 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-sm text-gray-400 transition hover:text-blue-400"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your delivery details to place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {/* Delivery form and order items */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-white/10 bg-[#17191e] p-5 sm:p-8">
              <h2 className="text-xl font-semibold text-white">
                Delivery Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div className="min-w-0">
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={inputClass}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className={errorClass}>{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="min-w-0">
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={inputClass}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="min-w-0">
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="10-digit phone number"
                    {...register('phone', {
                      onChange: (event) => {
                        event.target.value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10);
                      },
                    })}
                    className={inputClass}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p className={errorClass}>{errors.phone.message}</p>
                  )}
                </div>

                {/* City */}
                <div className="min-w-0">
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Enter your city"
                    {...register('city')}
                    className={inputClass}
                    aria-invalid={Boolean(errors.city)}
                  />
                  {errors.city && (
                    <p className={errorClass}>{errors.city.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Full Address
                  </label>
                  <textarea
                    id="address"
                    autoComplete="street-address"
                    rows={3}
                    placeholder="House number, street, area, landmark..."
                    {...register('address')}
                    className={`${inputClass} resize-y`}
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && (
                    <p className={errorClass}>{errors.address.message}</p>
                  )}
                </div>

                {/* PIN code */}
                <div className="min-w-0">
                  <label htmlFor="pincode" className={labelClass}>
                    PIN Code
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    placeholder="6-digit PIN code"
                    {...register('pincode', {
                      onChange: (event) => {
                        event.target.value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6);
                      },
                    })}
                    className={inputClass}
                    aria-invalid={Boolean(errors.pincode)}
                  />
                  {errors.pincode && (
                    <p className={errorClass}>{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              {(orderError || errors.root) && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {orderError || errors.root?.message}
                </div>
              )}
            </section>

            {/* Order items */}
            <section className="rounded-2xl border border-white/10 bg-[#17191e] p-5 sm:p-8">
              <h2 className="text-xl font-semibold text-white">
                Items in Your Order
              </h2>

              <div className="mt-5 divide-y divide-white/10">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 sm:h-20 sm:w-20">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-medium text-gray-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="min-w-0 rounded-2xl border border-white/10 bg-[#17191e] p-5 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-white">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-200">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-gray-200">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-white sm:text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#17191e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Placing Order...'
                : `Place Order · ${formatPrice(total)}`}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              This demo stores your order in your browser. No real payment will
              be processed.
            </p>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm text-gray-400 transition hover:text-blue-400"
            >
              Return to Cart
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
