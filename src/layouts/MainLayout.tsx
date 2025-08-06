import { Outlet } from "react-router-dom";
import EnhancedNavigation from "../components/EnhancedNavigation";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
