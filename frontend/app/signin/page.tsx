'use client';
import React, { useContext, useEffect, useState } from "react";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import UseAppContext from "@/ContextApi/UseContext";
export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

  console.log(currentUser, "currentUser")

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (success != "") {
      enqueueSnackbar(success, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        variant: 'success'
      })
      setSuccess('');
    }
    else if (error != "") {
      enqueueSnackbar(error, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        variant: 'error'
      })
      setError('');
    }

  }, [success, error])



  const handleLogin = async () => {
    const tEmail = email.trim().toLowerCase();
    const tPassword = password.trim();
    if (!tEmail || !tPassword) {
      setError("Please provide login credentials");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(process.env.apiUrl + `/signin`, {
        email: tEmail,
        password: tPassword
      });

      // Check if the response status is 200
      if (res.status === 200) {
        setSuccess(res.data.message);
        router.push("/dashboard");
        // Store the user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(res.data?.userData));
        sessionStorage.setItem('token', res.data?.token);
        setLoggedIn(true);
        setCurrentUser(res.data.userData);
        setLoadingData(false);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false); // Ensure submitting state is reset on error
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Something went wrong ${error}`);
      }
    }
  };

  return (
    <>

      <div className="w-[50%] mt-20 mx-auto border border-gray-100">
        <div className="p-5 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold">
            Sign in to Task App
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium"
              >
                Password
              </label>
              <span className=" relative flex">

                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={!show ? "password" : "text"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                  required
                />{!show ? <RemoveRedEye className=" absolute right-2 top-2" onClick={() => { setShow(!show) }} /> : <VisibilityOff className="absolute right-2 top-2" onClick={() => { setShow(!show) }} />}
              </span>

            </div>
            <div className="flex justify-end">
              <p>Didn't have an account yet?</p>
              <span className="ms-1 underline text-blue-500 cursor-pointer" onClick={() => router.push("/signup")}>Singup</span>
            </div>
            <button
              disabled={loading}
              onClick={handleLogin}
              // type="button"
              className="bg-[#279eff] w-full py-1.5 text-white rounded-lg cursor-pointer"
            >
              {!loading ? "Signin" : "Please wait..."}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
