"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { Provider } from "@/ContextApi/UseContext";
import AppNavbar from "@/components/Navbar";


const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // console.log(children, "children -----");

  return (
    <html>
      <head>
        <title>
          Task App
        </title>
        <link rel="icon" href="/images/Favicon.png" type="image/x-icon"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"></link>
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Livvic:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap" rel="stylesheet"></link>
      </head>
      <body className={`${inter.className} livvic-light`}>
        <SnackbarProvider>
          <Provider>
            <AppNavbar/>
            {children}
          </Provider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
