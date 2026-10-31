import {
    Navigate
} from "react-router-dom";

const DashboardRedirect = () => {

    const role =
        localStorage.getItem("role");

    if (role === "ORGANIZER") {

        return (
            <Navigate
                to="/organizer"
            />
        );
    }

    return (
        <Navigate
            to="/dashboard"
        />
    );
};

export default DashboardRedirect;