import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess, signUpFailure } from "../redux/user/userSlice";

//OAuth es un componente que se encarga de manejar la autenticación con Google
export const OAuth = () => {
  const dispatch = useDispatch();
  //Obtenemos el objeto auth de firebase pasándole la app importada de firebase (ahi esta la configuración de firebase de este proyecto)
  //Basicamente le decimos que vamos a usar la autenticación de firebase
  const auth = getAuth(app);

  //Este es el manejador del click en el botón de Google
  const handleGoogleClick = async () => {
    //Creamos un objeto de autenticación de Google
    const provider = new GoogleAuthProvider();
    //Para que el usuario siempre pueda elegir la cuenta de gmail con la cual ingresar
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      //Abrimos un popup para que el usuario pueda loguearse con Google
      //Le pasamos el objeto de autenticación de firebase y el objeto de autenticación de Google definidos previamente
      const resultFromGoogle = await signInWithPopup(auth, provider);

      //Le avisamos a la store que comenzó el proceso de autenticación
      dispatch(signInStart());
      //Hacemos un post a la ruta de autenticación con Google que creamos en el backend
      const res = await axios.post(`/api/auth/google`, {
        //Le pasamos los datos que nos devolvió la auth de Google
        //Password y username no se lo pasamos porque lo generamos en el backend
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      }, { withCredentials: true });
      const { data } = res;

      //Si todo salió bien, redirigimos al usuario a la home y le pasamos los datos del usuario a la store
      if (res.status === 200) {
        //Le pasamos los datos del usuario a la store, rest = datos usuario sin la password
        dispatch(signInSuccess(data));

      }
    } catch (error) {
      dispatch(signInSuccess(null))
      dispatch(signInFailure(error))
      dispatch(signUpFailure(error));
    }
  };

  return (
    <button
    type="button"
      onClick={handleGoogleClick}
      className="btn btn-outline btn-accent"
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </button>
  );
};
