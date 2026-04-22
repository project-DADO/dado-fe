import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuthStore } from "@/store/auth-store";

function ThemeToggleButton() {
  return (
    <button
      className="p-2 hover:bg-secondary rounded-lg transition-colors"
      aria-label="테마 변경"
    >
      <Sun className="w-6 h-6 dark:hidden" />
      <Moon className="w-6 h-6 hidden dark:block" />
    </button>
  );
}

export default function GlobalLayout() {
  const { isLoggedIn, userAvatar, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* 로고 */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="DADO 로고" className="w-12 h-12 rounded-full object-cover" />
              <span className="text-2xl font-bold tracking-tight">DADO</span>
            </Link>

            {isLoggedIn ? (
              <>
                {/* 프로필 아바타 (중앙) */}
                <Link to="/profile" className="absolute left-1/2 -translate-x-1/2">
                  <img
                    src={userAvatar ?? logo}
                    alt="프로필 이미지"
                    className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-lg"
                  />
                </Link>

                {/* 테마 변경 + 햄버거 메뉴 */}
                <div className="flex items-center gap-1">
                  <ThemeToggleButton />
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="메뉴 열기"
                  >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                  </button>
                </div>
              </>
            ) : (
              /* 테마 변경 + 로그인/회원가입 버튼 */
              <div className="flex items-center gap-3">
                <ThemeToggleButton />
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-all border border-border"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 드롭다운 메뉴 (로그인 상태) */}
        {isLoggedIn && isMenuOpen && (
          <div className="bg-background border-b border-border">
            <nav className="container mx-auto px-6 lg:px-12 py-4 flex flex-col gap-2">
              <Link to="/calendar" className="px-4 py-3 rounded-lg hover:bg-secondary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                내 캘린더
              </Link>
              <Link to="/diary" className="px-4 py-3 rounded-lg hover:bg-secondary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                일기장
              </Link>
              <Link to="/settings" className="px-4 py-3 rounded-lg hover:bg-secondary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                설정
              </Link>
              <div className="border-t border-border my-2" />
              <button
                className="px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive font-medium text-left"
                onClick={() => { logout(); setIsMenuOpen(false); }}
              >
                로그아웃
              </button>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
