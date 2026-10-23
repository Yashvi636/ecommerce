import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { getUsers, setCurrentUser } from '../utils/auth';
import { loadUserCart } from '../redux';

// 1. Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [error, setError] = useState('');

  // 2. React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 3. Redirect to the originally requested page
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || '/';

  // 4. Handle login
  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      const users = getUsers();
      const normalizedEmail = data.email.trim().toLowerCase();

      const user = users.find(
        (item) =>
          typeof item.email === 'string' &&
          item.email.trim().toLowerCase() === normalizedEmail &&
          item.password === data.password,
      );

      if (!user) {
        setError('Incorrect email or password. Please try again.');
        return;
      }

      // Save logged-in user
      setCurrentUser(user);
      localStorage.setItem('isLoggedIn', 'true');

      // Load this user's shopping cart
      dispatch(loadUserCart());

      // Redirect after successful login
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#343740] bg-[#111318] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#666a75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';

  const labelClass =
    'mb-2 block text-sm font-medium text-[#c4c7d0]';

  const errorClass = 'mt-2 text-xs text-red-400';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101114] px-4 py-10 text-[#ececf0]">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-extrabold tracking-tight text-white"
        >
          ShopZone<span className="text-blue-500">.</span>
        </Link>

        {/* Login card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#303137] bg-[#17191e] p-7 shadow-2xl shadow-black/20 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full .bg-blue-500/[0.08] blur-3xl" />

          <div className="relative mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#343a48] bg-[#20232b] text-2xl text-blue-400">
              ✦
            </div>

            <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-[#858994]">
              Welcome to ShopZone
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#9699a3]">
              Log in to continue shopping with ShopZone.
            </p>
          </div>

          {/* Login error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Login form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative space-y-5"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                onChange={(event) => {
                  register('email').onChange(event);
                  setError('');
                }}
                className={inputClass}
                aria-invalid={Boolean(errors.email)}
              />

              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register('password')}
                onChange={(event) => {
                  register('password').onChange(event);
                  setError('');
                }}
                className={inputClass}
                aria-invalid={Boolean(errors.password)}
              />

              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Signup link */}
          <div className="relative mt-7 border-t border-[#303137] pt-6 text-center">
            <p className="text-sm text-[#9699a3]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#666a75]">
          ShopZone. — Made for your everyday finds.
        </p>
      </div>
    </main>
  );
}

export default Login;
