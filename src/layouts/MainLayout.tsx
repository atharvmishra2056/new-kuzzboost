import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 md:pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
