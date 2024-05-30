import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { OAuth } from "../components";
import { ScrollToTop } from "../components/ScrollToTop";

export const SignUp = () => {
  // useDispatch es un hook que nos permite disparar acciones al store de Redux.
  const dispatch = useDispatch();

  const [signUpErrorMsg, setSignUpErrorMsg] = useState(null)

  // isLoading es una propiedad del estado global que nos dice si la petición de registro/login está en curso.
  const { isLoading } = useSelector((state) => state.user);

  // navigate es una función que nos permite redirigir al usuario a otra ruta.
  const navigate = useNavigate();
  // useFormik es un hook que nos permite manejar formularios de una manera más sencilla. Utilizamos yup para validar los campos del formulario.
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("*")
        .min(4, "Must be 4 characters or more"),
      email: Yup.string().required("*"),
      password: Yup.string()
        .required("*")
        .min(5, "Must be 5 characters or more"),
    }),
    onSubmit: async ({ username, email, password }) => {
      try {
        // Cuando el usuario envía el formulario, se dispara la acción SignUpStart, que cambia el estado isLoading a true.
        dispatch(signUpStart());
        // Hacemos una petición POST a la ruta ${import.meta.env.VITE_BACKEND_URL}/api/auth/signup con los datos del formulario. (trim saca los espacios en blanco al principio y al final de un string)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
          username: username,
          email: email,
          password: password,
        }, { withCredentials: true });
        if (res.status !== 200) {
          dispatch(signUpFailure());
        }
        if (res.status === 201) {
          // Si la petición es exitosa, se dispara la acción SignUpSuccess, que guarda el usuario en el estado global y redirige al usuario a la página principal.
          dispatch(signUpSuccess(res.data));
          //redirijo al usuario a la página principal
          navigate("/");
        }
      } catch (error) {
        console.log(error)
        setSignUpErrorMsg(error.response.data.message);

        // Si la petición falla, se dispara la acción SignUpFailure, que cambia el estado isLoading a false y muestra un mensaje de error al usuario.
        dispatch(signUpFailure());
      }
    },
  });

  return (
    <div className="mt-20 min-h-screen ">
      <ScrollToTop />
      <div className="flex p-3 max-w-lg mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          {/* // Si hay un error en la autenticación, se muestra un mensaje de error, traido de redux */}
          {signUpErrorMsg ? (
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span> {signUpErrorMsg}</span>
            </div>
          ) : null}
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="group relative">
              <label value="Username" className="input input-bordered flex items-center gap-2">
                Name
                <input type="text" className="grow" placeholder="Luke Tyson" id="username"
                  name="username"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  value={formik.values.username} />
              </label>
              {formik.touched.username && formik.errors.username ? (
                <h6 className="absolute top-[50%] right-2 ml-2 text-red-300 text-[0.9rem]">
                  {formik.errors.username}
                </h6>
              ) : null}
            </div>

            <div className="group relative">
              <label value="Email" className="input input-bordered flex items-center gap-2">
                Email
                <input type="email" className="grow" placeholder="luke@tyson.com" id="email"
                  name="email"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  value={formik.values.email} />
              </label>
              {formik.touched.email && formik.errors.email ? (
                <h6 className="absolute top-[50%] right-2 ml-2 text-red-300 text-[0.9rem] ">
                  {formik.errors.email}
                </h6>
              ) : null}
            </div>

            <div className="group relative">
              <label value="Password" className="input input-bordered flex items-center gap-2">
                Password
                <input type="password" className="grow" placeholder="*********" id="password"
                  name="password"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  value={formik.values.password} />
              </label>
              {formik.touched.password && formik.errors.password ? (
                <h6 className="absolute top-[50%] right-2 ml-2 text-red-300 text-[0.9rem]">
                  {formik.errors.password}
                </h6>
              ) : null}
            </div>


            <Button
              className="btn btn-neutral"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <button className="loading loading-spinner">Loading</button>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
            <OAuth></OAuth>
          </form>
          <div className="flex gap-2 justify-end px-1 text-sm mt-3">
            <span>Have an account?</span>
            <Link to="/signin" className="text-primary font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
