import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../redux';

function Home() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const featuredProducts = products?.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#101114] text-[#ececf0]">
      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Your everyday shopping destination
          </p>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find your next favorite.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#a4a7b0] sm:text-lg">
            Discover clothing, accessories, and everyday essentials. Explore our
            collection and find something you love.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Shop collection <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#a4a7b0]">
            <span>✓ Quality picks</span>
            <span>✓ Easy shopping</span>
            <span>✓ Simple checkout</span>
          </div>
        </div>

        {/* Dark hero visual */}
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-[#303137] bg-[#17191e] p-8 .sm:min-h-[420px]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full .bg-blue-500/[0.12] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full .bg-slate-400/[0.08] blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl border border-[#343a48] bg-[#20232b] text-7xl shadow-2xl shadow-black/20 sm:h-40 sm:w-40 sm:text-8xl">
              🛍️
            </div>

            <p className="mt-7 text-2xl font-semibold text-white">
              A little something for you.
            </p>

            <p className="mt-2 text-sm text-[#9699a3]">
              Discover something new today.
            </p>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-blue-500" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-[#303137] bg-[#141519]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:grid-cols-3 sm:px-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#343a48] bg-[#20232b] text-blue-400">
              <span aria-hidden="true">✦</span>
            </div>
            <p className="font-semibold text-white">Quality products</p>
            <p className="mt-2 text-sm text-[#9699a3]">
              Browse our curated collection
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#343a48] bg-[#20232b] text-blue-400">
              <span aria-hidden="true">◇</span>
            </div>
            <p className="font-semibold text-white">Easy shopping</p>
            <p className="mt-2 text-sm text-[#9699a3]">
              Add favourites to your cart
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#343a48] bg-[#20232b] text-blue-400">
              <span aria-hidden="true">◎</span>
            </div>
            <p className="font-semibold text-white">Your profile</p>
            <p className="mt-2 text-sm text-[#9699a3]">
              Manage your account details
            </p>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Handpicked for you
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Featured products
            </h2>

            <p className="mt-3 text-sm text-[#9699a3]">
              A few favourites to get you started.
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading && (
          <p className="py-12 text-center text-[#9699a3]">
            Loading products...
          </p>
        )}

        {isError && (
          <p role="alert" className="py-12 text-center text-red-300">
            Could not load products. Please try again later.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group overflow-hidden rounded-2xl border border-[#303137] bg-[#17191e] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#454b59] hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="flex h-56 items-center justify-center rounded-xl border border-[#252830] bg-[#111318] p-5">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-4 text-xs capitalize text-[#858994]">
                      {product.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-12 font-medium leading-6 text-[#ececf0] transition group-hover:text-white">
                      {product.title}
                    </h3>

                    <p className="mt-3 text-lg font-semibold text-white">
                      ${product.price.toFixed(2)}
                    </p>

                    <span className="mt-4 block rounded-lg border border-[#41434c] py-2.5 text-center text-sm font-semibold text-[#d5d7de] transition group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white">
                      View product <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-[#9699a3]">
                No featured products are available right now.
              </p>
            )}
          </>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Explore all products <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#303137] bg-[#141519]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-sm text-[#858994] sm:flex-row sm:items-center sm:px-8">
          <Link to="/" className="font-bold tracking-tight text-white">
            ShopZone<span className="text-blue-500">.</span>
          </Link>

          <p>Find your next favorite.</p>

          <p>© 2026 ShopZone. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
