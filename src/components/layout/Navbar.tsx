import { useState, useEffect } from "react";
import { Menu, X, Heart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { name: "หน้าแรก", href: "/" },
  { name: "เกี่ยวกับ", href: "/#about" },
  { name: "ผลงาน", href: "/#works" },
  { name: "กิจกรรม", href: "/#activities" },
  { name: "เกียรติบัตร", href: "/#certificates" },
  { name: "ประเมิน PA", href: "/performance-evaluation" },
  { name: "ติดต่อ", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a nav item is active
  const isActive = (href: string) => {
    // For non-hash routes (like /performance-evaluation)
    if (!href.startsWith("/#") && href !== "/") {
      return location.pathname === href;
    }
    
    // Not on home page
    if (location.pathname !== "/") {
      return false;
    }
    
    // For home page without hash
    if (href === "/") {
      return activeHash === "home";
    }
    
    // For hash links on home page
    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");
      return activeHash === hash;
    }
    
    return false;
  };

  // Track scroll position to update active section
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const handleScroll = () => {
      const sections = ["home", "about", "works", "activities", "certificates", "contact"];
      const marker = window.scrollY + window.innerHeight * 0.33;

      // Check if at top (home section)
      if (window.scrollY < 120) {
        setActiveHash("home");
        return;
      }

      // If at very bottom, treat as contact (footer area)
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActiveHash("#contact");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;
        if (marker >= top && marker < bottom) {
          setActiveHash(section === "home" ? "home" : "#" + section);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Handle hash scrolling after navigation
  useEffect(() => {
    if (location.hash && location.pathname === "/") {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else if (location.pathname === "/" && !location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    setIsOpen(false);
    
    if (href === "/") {
      // Navigate to home and scroll to top
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveHash("");
      }
      return;
    }
    
    // If it's a hash link
    if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.replace("/", "");
      
      if (location.pathname === "/") {
        // Already on home page, just scroll
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home first, then scroll (handled by useEffect)
        navigate("/" + hash);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center group-hover:animate-wiggle">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Teacher<span className="text-primary">Portfolio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/#contact" onClick={(e) => handleNavClick(e, "/#contact")}>
              <Button className="bg-gradient-primary hover:opacity-90 rounded-full gap-2">
                <Heart className="w-4 h-4" />
                ติดต่อครู
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/#contact" onClick={(e) => handleNavClick(e, "/#contact")}>
              <Button className="w-full bg-gradient-primary hover:opacity-90 rounded-full gap-2 mt-4">
                <Heart className="w-4 h-4" />
                ติดต่อครู
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
