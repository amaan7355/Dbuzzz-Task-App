
'use client';
import React, { useContext, useEffect, useState } from "react";
import { RemoveRedEye, VisibilityOff } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
export default function Page() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [cnfPassword, setCnfPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false)
    const [cnfShow, setCnfShow] = useState<boolean>(false)
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



    const handleSignup = async () => {
        let tName = name.trim();
        let tEmail = email.trim().toLowerCase();
        let tPassword = password.trim();
        let tCnfPassword = cnfPassword.trim();
        if (!tEmail || !tPassword || !tName || !tCnfPassword) {
            setError("All fields are required");
            return;
        }

        if(tPassword != tCnfPassword){
            setError("Password doesn't match");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(process.env.apiUrl + `/signup`, {
                name: tName,
                email: tEmail,
                password: tPassword
            })
            setSuccess(res?.data?.message);
            setEmail("");
            setName("");
            setPassword("");
            setCnfPassword("");
            setLoading(false);
            setTimeout(() => {
                router.push("/signin")
            }, 1000);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <>
            <div className="w-full h-screen  flex justify-center content-center bg-[#f1f1f1] items-center">
                <section className="bg-[#279EFF] w-4/5 px-7 py-12 content-center rounded shadow-xl  ">
                    <div className="py-8 px-4 mx-auto lg:py-4 grid lg:grid-cols-3 gap-4">
                        <div className="flex flex-col justify-center">
                            {/* <img src="/icon.png" style={{ width: "70%", height: "90%" }} alt="logo" /> */}
                            <img src="https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg?semt=ais_items_boosted&w=740" style={{ width: "100%", height: "" }} alt="logo" className="rounded-lg" />
                        </div>
                        <div className="w-[100%] col-span-2">

                            <div className="p-8 bg-white rounded-lg shadow-xl">
                                <h2 className="text-2xl font-bold">
                                    Sign up to Task App
                                </h2>
                                <div className="mt-5 space-y-6 grid grid-cols-2 gap-x-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium"
                                        >
                                            Name
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 "
                                            placeholder="John Doe"
                                        />
                                    </div>
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
                                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 "
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
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  "
                                                required
                                            />{!show ? <RemoveRedEye className=" absolute right-2 top-2" onClick={() => { setShow(!show) }} /> : <VisibilityOff className="absolute right-2 top-2" onClick={() => { setShow(!show) }} />}
                                        </span>

                                    </div>
                                    <div>
                                        <label
                                            htmlFor="cnfpassword"
                                            className="block mb-2 text-sm font-medium"
                                        >
                                            Confirm Password
                                        </label>
                                        <span className=" relative flex">

                                            <input
                                                value={cnfPassword}
                                                onChange={(e) => {
                                                    setCnfPassword(e.target.value);
                                                }}
                                                type={!cnfShow ? "password" : "text"}
                                                name="cnfpassword"
                                                id="cnfpassword"
                                                placeholder="••••••••"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  "
                                                required
                                            />{!cnfShow ? <RemoveRedEye className=" absolute right-2 top-2" onClick={() => { setCnfShow(!cnfShow) }} /> : <VisibilityOff className="absolute right-2 top-2" onClick={() => { setCnfShow(!cnfShow) }} />}
                                        </span>

                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <p>Already have an account?</p>
                                    <span className="ms-1 underline text-blue-500 cursor-pointer" onClick={() => router.push("/signin")}>Singin</span>
                                </div>
                                <button
                                    disabled={loading}
                                    onClick={handleSignup}
                                    // type="button"
                                    className="bg-[#279eff] w-full py-1.5 text-white rounded-lg cursor-pointer mt-4"
                                >
                                    {!loading ? "Signup" : "Please wait..."}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
