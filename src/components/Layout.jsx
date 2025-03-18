import { Outlet } from "react-router";
import AuthProvider from "../context/AuthContext";
import Navbar from "../components/Navbar";
function Layout() {
    return (
        <AuthProvider>
            <Navbar />
            <Outlet />
        </AuthProvider>
    );
}

export default Layout;
