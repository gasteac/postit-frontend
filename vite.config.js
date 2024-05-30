import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   // haceme un proxy de todas las peticiones del cliente que comiencen con ${import.meta.env.VITE_BACKEND_URL}/api al servidor (api)
    //   // osea que si el cliente por ejemplo corriendo el localhost:5770 se dirige al link localhost:5770${import.meta.env.VITE_BACKEND_URL}/api/user/register
    //   // el proxy lo redirige al servidor que esta corriendo en localhost:3000${import.meta.env.VITE_BACKEND_URL}/api/user/register
    //   "${import.meta.env.VITE_BACKEND_URL}/api": {
    //     ///url del servidor
    //     target: "http://localhost:4000/",
    //     //quiero que sea solo http
    //     // "A backend server running on HTTPS with an invalid certificate will not be accepted by default. You can bypass this security check by setting the secure option to false."
    //     secure: false,
    //   },
    // },
  },
  plugins: [react()],
});
