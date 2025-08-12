import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "../Breadcrumbs";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Хедер */}
      <Header />

      {/* Хлебные крошки */}
      <Breadcrumbs />

      {/* Основной контент */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Футер */}
      <Footer />
    </div>
  );
};

export default Layout;
