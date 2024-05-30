import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  signInFailure,
  signInInProcess,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { OAuth } from "../components";
import { ScrollToTop } from "../components/ScrollToTop";

export const SignIn = () => {

  // useDispatch es un hook que nos permite disparar acciones al store de Redux.
  const dispatch = useDispatch();

  // Obtengo error e isLoading del estado global de user
  const { error: credentialErrorMsg, isLoading } = useSelector(
    (state) => state.user
  );

  //utilizamos formik para manejar el formulario
  const formik = useFormik({
    //le damos los valores iniciales del formulario
    initialValues: {
      email: "",
      password: "",
    },
    //Utilizamos Yup para hacer las validaciones
    validationSchema: Yup.object({
      email: Yup.string().required("Required!"),
      password: Yup.string()
        .required("Required!")
        .min(6, "Must be 6 characters or more"),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        // Cuando el usuario envía el formulario, se dispara la acción SignInStart, que cambia el estado isLoading a true.
        dispatch(signInStart());
        // Hacemos una petición POST a la ruta ${import.meta.env.VITE_BACKEND_URL}/api/auth/signin con los datos del formulario. 
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
          email: email.toLowerCase(),
          password,
        }, { withCredentials: true });
        // Si la petición es exitosa, se dispara la acción SignInSuccess, que guarda el usuario en el estado global y redirige al usuario a la página principal.
        if (res.status !== 200) {
          //en data estan los datos del usuario
          dispatch(signInFailure());
        }
        if (res.status === 200) {
          //en data estan los datos del usuario
          dispatch(signInSuccess(res.data));
        }
      } catch (error) {
        // Si hay un error en la petición, se dispara la acción SignInFailure, que guarda el mensaje de error en el estado global.
        dispatch(signInFailure(error.response.data.message));

      }
    },
  });

  return (
    <div className="mt-20 min-h-screen ">
      <ScrollToTop />
      <div className="flex p-3 max-w-lg mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            {/* // Si hay un error en la autenticación, se muestra un mensaje de error, traido de redux */}
            {/* {credentialErrorMsg ? (
              <div role="alert" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{credentialErrorMsg}</span>
              </div>
            ) : null} */}


            <div className="group relative">
              <label value="Email" className="input input-bordered flex items-center gap-2">
                Email
                <input type="email" className="grow" placeholder="luke@tyson.com" id="email"
                  name="email"
                  onChange={(e) => {
                    formik.handleChange(e), dispatch(signInInProcess());
                  }}
                  value={formik.values.email} />
              </label>
              {formik.touched.email && formik.errors.email ? (
                <h6 className="absolute top-[50%] right-2 ml-2 text-red-300 text-[1rem] phone:text-[1.2rem] tablet:text-[1.5rem]">
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
                    formik.handleChange(e), dispatch(signInInProcess());
                  }}
                  value={formik.values.password} />
              </label>
              {formik.touched.password && formik.errors.password ? (
                <h6 className="absolute top-[50%] right-2 ml-2 text-red-300 text-[1rem] phone:text-[1.2rem] tablet:text-[1.5rem]">
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
                <span>Sign In</span>
              )}
            </Button>
            <OAuth></OAuth>
          </form>
          <div className="flex gap-2 justify-end px-1 text-sm mt-3">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-primary font-bold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
