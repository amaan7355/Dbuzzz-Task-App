'use client'
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { ChangeCircle, ExitToApp, HowToReg, LockOpen, PeopleAlt, Person } from "@mui/icons-material";
import Image from "next/image";
import { Button, Avatar, Dropdown, Navbar, DropdownHeader, DropdownItem, NavbarToggle, NavbarCollapse } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import UseAppContext from "@/ContextApi/UseContext";
export default function AppNavbar() {

    const { loggedIn, setLoggedIn, logout, currentUser } = UseAppContext();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Navbar fluid className="bg-primary text-white">
            <div className="inline-flex">
                <>
                    <span className="lg:text-3xl md:text-xl text-lg cursor-pointer" onClick={() => router.push("/")}>
                        {/* <img src="Esport logo.png" alt="Logo" className="md:w-full md:h-20 w-32 h-14" /> */}
                        Task Management
                    </span>
                </>
            </div>
            <div className="flex md:order-2">
                {
                    loggedIn ? (
                        <>
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={
                                    <Avatar alt="User settings" img="/avatar.png" rounded className="me-3">
                                        <div className="space-y-1 font-medium text-white">
                                            <div>{currentUser?.name}</div>
                                            <div className="text-sm text-white">{currentUser?.email?.substring(0, 10)}...</div>
                                        </div>
                                    </Avatar>
                                }
                            >
                                <DropdownHeader className="p-4 cursor-pointer" 
                                // onClick={() => router.push("/user-profile")}
                                >
                                    <span className="block text-lg text-center">Hi, {currentUser?.name}</span>
                                    <span className="text-center block text-sm">{currentUser?.email}</span>
                                </DropdownHeader>
                                <DropdownItem>
                                    <div onClick={logout}><ExitToApp className='me-2' /><span>Logout</span></div>
                                </DropdownItem>
                            </Dropdown>
                        </>
                    ) : <>
                        <div>
                            <button className="py-2 rounded-lg px-3 me-3 inline-flex border border-gray-100 hover:bg-white hover:text-black cursor-pointer" onClick={() => router.push("/signin")}>
                                <LockOpen className="me-2" />Get Started
                            </button>
                        </div>
                    </>
                }
                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <button className={pathname == "/" ? "active cursor-pointer" : "cursor-pointer"} onClick={() => router.push("/")}  >
                    <p className='text-lg'>Home</p>
                </button>
                <button className={pathname == "/add-task" ? 'active cursor-pointer' : "cursor-pointer"} onClick={() => router.push("/add-task")}  >
                    <p className='text-lg'>Add new task</p>
                </button>
                <button className={pathname == "/dashboard" ? 'active cursor-pointer' : "cursor-pointer"} onClick={() => router.push("/dashboard")}  >
                    <p className='text-lg'>Dashboard</p>
                </button>

            </NavbarCollapse>
        </Navbar>
    )

}