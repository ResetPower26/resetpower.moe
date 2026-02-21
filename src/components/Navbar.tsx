import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "主页", href: "/" },
    { name: "文章", href: "/articles" },
    { name: "项目", href: "/projects" },
    { name: "链接", href: "/links" },
    { name: "关于我", href: "/about" },
  ];

  function handleAdminClick() {
    navigate(isLoggedIn ? "/admin" : "/admin/login");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-slate-800">
              ResetPower
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold [box-shadow:0_2px_0_0_theme(colors.blue.600)] transition-colors"
                    : "text-slate-600 hover:text-blue-600 font-medium transition-colors"
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-sm"
              onClick={handleAdminClick}
            >
              后台登录
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end
                className={({ isActive }) =>
                  isActive
                    ? "block px-3 py-2 rounded-md text-base font-semibold text-blue-600 bg-blue-50 transition-colors"
                    : "block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 px-3">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={handleAdminClick}
              >
                后台登录
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
