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
        .required("Required!")
        .min(4, "Must be 4 characters or more"),
      email: Yup.string().required("Required!"),
      password: Yup.string()
        .required("Required!")
        .min(5, "Must be 5 characters or more"),
    }),
    onSubmit: async ({ username, email, password }) => {
      try {
        // Cuando el usuario envía el formulario, se dispara la acción SignUpStart, que cambia el estado isLoading a true.
        dispatch(signUpStart());
        // Hacemos una petición POST a la ruta /api/auth/signup con los datos del formulario. (trim saca los espacios en blanco al principio y al final de un string)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
          username: username,
          email: email,
          password: password,
        }, { withCredentials: true });
        if (res.status !== 200){
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
        {/* right side */}
        <div className="flex-1">
          {/* // Si hay un error en la autenticación, se muestra un mensaje de error, traido de redux */}
          {signUpErrorMsg ? (
            <Alert className=" text-red-500 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
              {signUpErrorMsg}
            </Alert>
          ) : null}
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="group">
              <Label
                value="Username"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                name="username"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <h6 className="ml-2 text-red-500 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.username}
                </h6>
              ) : null}
            </div>
            <div className="group">
              <Label
                value="Email"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                name="email"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <h6 className="ml-2 text-red-500 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.email}
                </h6>
              ) : null}
            </div>
            <div className="group">
              <Label
                value="Password"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <h6 className="ml-2 text-red-500 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.password}
                </h6>
              ) : null}
            </div>
            <Button
              className="bg-[linear-gradient(135deg,_#9c77f3,_#5d55f6)] text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-3">Loading..</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
            <OAuth></OAuth>
          </form>
          <div className="flex gap-2 justify-end px-1 text-sm mt-3">
            <span>Have an account?</span>
            <Link to="/signin" className="hiText font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
