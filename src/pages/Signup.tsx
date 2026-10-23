import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { getUsers, saveUsers, type User } from '../utils/auth';

const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function Signup() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const users = getUsers();
      const email = data.email.trim().toLowerCase();

      const alreadyExists = users.some(
        (user) => user.email.toLowerCase() === email,
      );

      if (alreadyExists) {
        setSuccessMessage('');
        alert('This email is already registered. Please log in.');
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        email,
        password: data.password,
      };

      saveUsers([...users, newUser]);

      setSuccessMessage(
        'Account created successfully! Redirecting to login...',
      );

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch {
      alert(
        'Unable to create your account. Please check your browser storage and try again.',
      );
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#343740] bg-[#111318] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#666a75] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';

  const labelClass = 'mb-2 block text-sm font-medium text-[#c4c7d0]';

  const errorClass = 'mt-1.5 text-sm text-red-300';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101114] px-4 py-10 text-[#ececf0]">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-extrabold tracking-tight text-white"
        >
          ShopZone<span className="text-blue-500">.</span>
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-[#303137] bg-[#17191e] p-7 shadow-2xl shadow-black/20 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full .bg-blue-500/[0.08] blur-3xl" />

          <div className="relative mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#343a48] bg-[#20232b] text-2xl text-blue-400">
              ✦
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#858994]">
              Join ShopZone
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#9699a3]">
              Discover something you love and make shopping yours.
            </p>
          </div>

          {successMessage && (
            <div
              role="status"
              aria-live="polite"
              className="relative mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              <span className="mr-2">✓</span>
              {successMessage}

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-emerald-900/60">
                <div className="h-full w-full origin-left animate-pulse rounded-full bg-emerald-400" />
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative space-y-5"
          >
            <div>
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                {...register('name')}
                className={inputClass}
              />

              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

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
                className={inputClass}
              />

              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                {...register('password')}
                className={inputClass}
              />

              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                {...register('confirmPassword')}
                className={inputClass}
              />

              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Boolean(successMessage)}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {successMessage
                ? 'Account Created ✓'
                : isSubmitting
                  ? 'Creating account...'
                  : 'Create account'}
            </button>
          </form>

          <div className="relative mt-7 border-t border-[#303137] pt-6 text-center">
            <p className="text-sm text-[#9699a3]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#666a75]">
          ShopZone. — Your shopping journey starts here.
        </p>
      </div>
    </main>
  );
}

export default Signup;
