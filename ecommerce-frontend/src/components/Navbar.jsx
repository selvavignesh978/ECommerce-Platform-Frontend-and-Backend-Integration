import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?keyword=${encodeURIComponent(search)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl font-semibold text-ink tracking-tight shrink-0">
          Market <span className="text-clay">&</span> Co.
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center border border-ink/15 rounded-full px-4 py-2 bg-white">
          <FiSearch className="text-ink/40 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-ink/40"
          />
        </form>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/80">
          <Link to="/" className="hover:text-clay transition-colors">Shop</Link>
          <Link to="/contact" className="hover:text-clay transition-colors">Contact</Link>
          {user && <Link to="/orders" className="hover:text-clay transition-colors">Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" className="hover:text-clay transition-colors">Admin</Link>}

          <Link to="/cart" className="relative flex items-center">
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-clay text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-ink/60 flex items-center gap-1"><FiUser /> {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="text-clay hover:underline">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="bg-ink text-paper px-4 py-2 rounded-full hover:bg-plum transition-colors">
              Login
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <form onSubmit={handleSearch} className="flex items-center border border-ink/15 rounded-full px-4 py-2 bg-white">
            <FiSearch className="text-ink/40 mr-2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-transparent outline-none" />
          </form>
          <Link to="/" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          {user && <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left text-clay">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-clay">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
