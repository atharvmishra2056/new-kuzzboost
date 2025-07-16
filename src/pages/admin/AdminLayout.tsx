import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, List, Users } from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-background flex">
            <aside className="w-64 bg-secondary p-6">
                <h1 className="font-clash text-2xl font-bold text-primary mb-10">KuzzBoost Admin</h1>
                <nav className="flex flex-col space-y-4">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                            }`
                        }
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </NavLink>
                    <NavLink
                        to="/admin/services"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                            }`
                        }
                    >
                        <List className="w-5 h-5" />
                        Services
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                            }`
                        }
                    >
                        <Users className="w-5 h-5" />
                        Users
                    </NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;