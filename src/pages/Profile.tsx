import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  getCurrentUser,
  getUsers,
  saveUsers,
  setCurrentUser,
} from '../utils/auth';

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success',
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const [profile, setProfile] = useState<ProfileFormData>({
    name: '',
    email: '',
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    const userData = {
      name: currentUser.name,
      email: currentUser.email,
    };

    setProfile(userData);
    reset(userData);
  }, [navigate, reset]);

  const initial = profile.name.trim().charAt(0).toUpperCase() || 'U';

  function startEditing() {
    reset(profile);
    setMessage('');
    setIsEditing(true);
  }

  function cancelEditing() {
    reset(profile);
    setMessage('');
    setIsEditing(false);
  }

  function onSubmit(data: ProfileFormData) {
    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        navigate('/login', { replace: true });
        return;
      }

      const name = data.name.trim();
      const email = data.email.trim().toLowerCase();
      const users = getUsers();

      const emailAlreadyUsed = users.some(
        (existingUser) =>
          existingUser.id !== currentUser.id &&
          existingUser.email.trim().toLowerCase() === email,
      );

      if (emailAlreadyUsed) {
        setMessageType('error');
        setMessage('This email is already used by another account.');
        return;
      }

      const updatedUsers = users.map((existingUser) =>
        existingUser.id === currentUser.id
          ? { ...existingUser, name, email }
          : existingUser,
      );

      const updatedUser = updatedUsers.find(
        (existingUser) => existingUser.id === currentUser.id,
      );

      if (!updatedUser) {
        setMessageType('error');
        setMessage('Unable to update your profile. Please try again.');
        return;
      }

      saveUsers(updatedUsers);
      setCurrentUser(updatedUser);

      const updatedProfile = { name, email };

      setProfile(updatedProfile);
      reset(updatedProfile);
      setIsEditing(false);
      setMessageType('success');
      setMessage('Your profile has been updated successfully.');
    } catch {
      setMessageType('error');
      setMessage('Something went wrong while saving your profile.');
    }
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';

  const labelClass =
    'text-xs font-semibold uppercase tracking-[0.12em] text-slate-400';

  const errorClass = 'mt-2 text-xs text-red-400';

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#080d16] text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Page heading */}
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
              SHOPZONE / ACCOUNT
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Manage your account information and personal details.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-blue-500/50 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Continue shopping
          </Link>
        </header>

        {/* Full-width account overview */}
        <section className="relative mb-7 overflow-hidden rounded-2xl border border-slate-800 ,bg-gradient-to-r from-[#111c30] to-[#0d1421] p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-2xl font-bold text-blue-300 sm:h-20 sm:w-20 sm:text-3xl">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Account overview
                </p>

                <h2 className="mt-2 .break-words text-xl font-bold text-white sm:text-2xl">
                  {profile.name || 'Welcome to ShopZone'}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-400">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Signed in
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-1 gap-3 border-t border-slate-700/70 pt-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs text-slate-500">Full name</p>
              <p className="mt-2 .break-words text-sm font-semibold text-slate-200">
                {profile.name || 'Not provided'}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs text-slate-500">Email address</p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-200">
                {profile.email || 'Not provided'}
              </p>
            </div>
          </div>
        </section>

        {/* Full-width personal information card */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1421]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <h2 className="text-xl font-bold text-white">
                Personal Information
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Update your name and contact details.
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="w-fit rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-500/10"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-7 lg:gap-8 lg:p-8">
              {/* Name field */}
              <div className="min-w-0">
                <label htmlFor="profile-name" className={labelClass}>
                  Full Name
                </label>

                {isEditing ? (
                  <>
                    <input
                      id="profile-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      {...register('name')}
                      onChange={(event) => {
                        register('name').onChange(event);
                        setMessage('');
                      }}
                      className={inputClass}
                      aria-invalid={Boolean(errors.name)}
                    />

                    {errors.name && (
                      <p className={errorClass}>{errors.name.message}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 min-h-12 .break-words border-b border-slate-800 py-3 text-sm text-slate-200">
                    {profile.name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="min-w-0">
                <label htmlFor="profile-email" className={labelClass}>
                  Email Address
                </label>

                {isEditing ? (
                  <>
                    <input
                      id="profile-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      onChange={(event) => {
                        register('email').onChange(event);
                        setMessage('');
                      }}
                      className={inputClass}
                      aria-invalid={Boolean(errors.email)}
                    />

                    {errors.email && (
                      <p className={errorClass}>{errors.email.message}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 min-h-12 break-all border-b border-slate-800 py-3 text-sm text-slate-200">
                    {profile.email || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-wrap gap-3 border-t border-slate-800 p-5 sm:px-7 sm:py-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`border-t border-slate-800 px-5 py-4 text-sm sm:px-7 ${
                messageType === 'success' ? 'text-emerald-300' : 'text-red-400'
              }`}
            >
              {message}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold tracking-wide text-slate-300">
            ShopZone.
          </span>

          <span>Made for your everyday finds.</span>
        </footer>
      </div>
    </main>
  );
}

export default Profile;
