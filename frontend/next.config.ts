import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    apiUrl: "http://localhost:9000/api"
  }
};

export default withFlowbiteReact(nextConfig);