import { Outlet, Navigate } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";

const AuthLayout = () => {
  const { token } = useAuthContext();
  const isAuthenticated = !!token;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10 bg-gradient-to-b from-[#271744]">
            <Outlet />
          </section>

          <img
            src="/assets/images/dreamscape_side_img.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  )
}

export default AuthLayout;