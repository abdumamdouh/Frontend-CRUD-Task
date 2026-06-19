import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="uae-app-layout flex min-h-screen flex-col bg-whitely-50 text-aeblack-800">
      <Header />

      <main className="uae-app-main mx-auto w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
