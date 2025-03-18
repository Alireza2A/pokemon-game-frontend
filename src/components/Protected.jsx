import { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

function Protected() {
    const { loading, user } = useContext(AuthContext);

    return <>{!loading && <>{user ? <Outlet /> : <Navigate to="/login" />}</>}</>;
}

export default Protected;
