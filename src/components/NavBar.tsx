import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logoutUser } from '../utils/auth';
import type { RootState } from '../redux';

function NavBar() {
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const cartCount = cart.length;

  function handleLogout() {
    logoutUser();
    navigate('/login', { replace: true});
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-[#a4a7b0] hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#303137] bg-[#101114]/95 text-[#ececf0] backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="shrink-0 text-2xl font-extrabold tracking-tight text-white"
        >
          ShopZone<span className="text-blue-500">.</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-3 sm:gap-x-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            <span className="inline-flex items-center gap-1.5">
              Cart
            {
              cartCount > 0 && (
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )
            }
            </span>
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#343a48] bg-[#20232b] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 sm:px-5"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
