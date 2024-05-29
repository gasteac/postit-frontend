import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
  Progress,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScrollToTop } from "../components/ScrollToTop";

export const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [postUploadSuccess, setPostUploadSuccess] = useState(false);
  // Estado para almacenar los errores en la actualizacion de usuario
  const [uploadImgError, setUploadImgError] = useState(null);
  // Estado para almacenar los errores en el relleno del formulario de post
  const [uploadPostError, setUploadPostError] = useState(null);
  // Estado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState(null);
  // Estado para almacenar la URL de la imagen seleccionada
  const [imageFileUrl, setImageFileUrl] = useState(null);
  // Estado para almacenar si se está subiendo una imagen
  const [imageFileUploading, setImageFileUploading] = useState(false);
  // Estado para almacenar el progreso de la carga de la imagen
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  // Estado para almacenar la URL de la imagen seleccionada
  const handleImageChange = (e) => {
    //Se sube una sola imagen asi que se selecciona la primera posición
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      // setImageFileUrl(URL.createObjectURL(file)); lo hacia de forma local
      setUploadImgError(null);
    }
  };

  // Efecto para limpiar el estado `imageFileUploadProgress` cuando la carga de la imagen llega al 100%
  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }, 1500);
    }
  }, [imageFileUploadProgress]);
  // Función asíncrona para cargar la imagen en el almacenamiento storage de firebase
  const uploadImage = async (title, content, category) => {
    //Seteo el estado de subida de la imagen a true para que el usuario no pueda hacer nada mientras se sube
    setImageFileUploading(true);
    //Obtengo el storage de firebase, le paso la conf mediante app que exporte en el archivo firebase.js
    const storage = getStorage(app);
    //Creo un nombre para la imagen que se va a subir, en este caso la fecha en milisegundos y el nombre de la imagen
    const fileName = new Date().getTime() + imageFile.name;
    //Creo una referencia al storage de firebase con el nombre de la imagen, para poder acceder a ella, es como un indice.
    const storageRef = ref(storage, fileName);
    //Subo la imagen al storage de firebase, con la referencia y el archivo de imagen
    //uploadBytesResumable es una promesa que me devuelve un objeto con información constante de la carga de la imagen
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    //Agrego un listener
    //uploadTask es un objeto que tiene un evento llamado state_changed que se dispara cada vez que cambia el estado de la carga de la imagen
    uploadTask.on(
      //Este evento se dispara cada vez que cambia el estado de la carga de la imagen
      "state_changed",
      //snapshot es un objeto que tiene información de la carga de la imagen
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //Ahora guardo el progreso de la carga de la imagen (se guarda constantemente hasta que llega a 100%)
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        //Si hay un error al subir la imagen, lo guardo en el estado para mostrarlo en el componente
        setImageFileUploadProgress(null);
        //Reseteo el estado de subida de la imagen
        setImageFileUploading(false);
        //Reseteo el archivo de imagen y la URL de la imagen
        setImageFile(null);
        //Reseteo la URL de la imagen
        setImageFileUrl(null);
        //Guardo el error en el estado para mostrarlo en el componente
        setUploadImgError("Image must be less than 2mb");
      },
      () => {
        //Cuando la imagen se sube correctamente, obtengo la URL de descarga de la imagen de firebase
        //Le paso la referencia de la imagen que se subió
        //Es una promesa que me devuelve la URL de la imagen en firebase
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //Reseteo los errores y la subida de la imagen
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
          setUploadImgError(null);
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/api/post/create`, {
              title,
              content,
              category,
              image: downloadURL ? downloadURL : undefined,
            }, { withCredentials: true })
            .then((response) => {
              if (response.status === 201) {
                formik.resetForm();
                setUploadPostError(null);
                setPostUploadSuccess(null);
                navigate(`/post/${response.data.slug}`);
               
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  };
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: undefined,
      image: imageFileUrl,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title of the post is required!")
        .min(4, "Must be 4 characters or more")
        .max(40, "Must be 40 characters or less"),
      content: Yup.string()
        .required("Content of the post is required!")
        .min(4, "Must be 4 characters or more")
        .max(2000, "Must be 2000 characters or less"),
      category: Yup.string(),
    }),
    onSubmit: async ({ title, content, category }) => {
      try {
        if (imageFile) {
          return uploadImage(title, content, category);
        }
        const postSaved = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/post/create`, {
          title,
          content,
          category,
          image: imageFileUrl ? imageFileUrl : undefined,
        }, { withCredentials: true });
        if (postSaved.status === 201) {
          setUploadPostError(null);
          formik.resetForm();
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
          navigate(
            currentUser.isAdmin
              ? "/dashboard?tab=posts"
              : "/userDashboard?tab=posts"
          );
          // setPostUploadSuccess(true);
          // setTimeout(() => {
          //   setPostUploadSuccess(null);
          // }, 3000);
        }
      } catch (error) {
        const { message } = error.response.data;
        setUploadPostError(message);
        setTimeout(() => {
          setUploadPostError(null);
        }, 4500);
      }
    },
  });
  return (
    <>
      <ScrollToTop />
      {!currentUser ? (
        <div className="min-h-screen w-screen flex flex-col gap-5 items-center justify-start mt-12">
          <h1 className="text-5xl mb-2 text-center">
            <span className="hiText capitalize font-bold">ERROR</span>
          </h1>

          {!currentUser ? (
            <>
              <h1 className="text-3xl">You need an account for this</h1>
            </>
          ) : (
            ""
          )}
          {currentUser ? (
            <span
              className="cursor-pointer text-2xl rounded-lg hiText font-semibold"
              onClick={() => navigate("/dashboard?tab=profile")}
            >
              Go to profile
            </span>
          ) : (
            <span
              className="cursor-pointer text-2xl rounded-lg hiText font-semibold"
              onClick={() => navigate("/signup")}
            >
              {" "}
              Sign Up!
            </span>
          )}
        </div>
      ) : (
        <div className="min-h-screen  p-3 max-w-3xl mx-auto">
          <h1 className="text-center text-3xl font-semibold my-7">
            Create a post
          </h1>
          {uploadPostError && (
            <Alert
              color="failure"
              className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
            >
              Error: Duplicated title
            </Alert>
          )}
          {postUploadSuccess && (
            <Alert
              color="success"
              className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
            >
              Post created successfully!
            </Alert>
          )}
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            {formik.touched.title && formik.errors.title ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {formik.errors.title}
              </h6>
            ) : null}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <TextInput
                value={formik.values.title}
                type="text"
                placeholder="Title"
                className="flex-1"
                id="title"
                name="title"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              <Select
                id="category"
                name="category"
                value={formik.values.category}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              >
                <option value="unselected">Select Category</option>
                <option value="tech-gadgets">Technology & Gadgets</option>
                <option value="animals-nature">Animals and Nature</option>
                <option value="travel-adventure">Travel & Adventure</option>
                <option value="cooking-recipes">Cooking & Recipes</option>
                <option value="books-literature">Books & Literature</option>
                <option value="health-wellness">Health & Wellness</option>
                <option value="movies-tv">Movies & TV</option>
                <option value="fashion-style">Fashion & Style</option>
                <option value="art-design">Art & Design</option>
                <option value="music-concerts">Music & Concerts</option>
                <option value="history-culture">History & Culture</option>
                <option value="photography-videography">
                  Photography & Videography
                </option>
                <option value="science-discoveries">
                  Science & Discoveries
                </option>
                <option value="education-learning">Education & Learning</option>
                <option value="environment-ecology">
                  Environment & Ecology
                </option>
                <option value="entrepreneurship-business">
                  Entrepreneurship & Business
                </option>
                <option value="sports-fitness">Sports & Fitness</option>
                <option value="automobiles-vehicles">
                  Automobiles & Vehicles
                </option>
                <option value="relationships-family">
                  Relationships & Family
                </option>
                <option value="games-videogames">Games & Videogames</option>
                <option value="news-current-events">
                  News & Current Events
                </option>
                <option value="other">Other...</option>
              </Select>
            </div>
            <div className="flex items-center gap-4 justify-between border-2 border-teal-400 border-dashed p-3">
              <FileInput
                // value={postUploadSuccess ? 'Image uploaded successfully!' : 'Upload Image'}
                disabled={imageFileUploading}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
            </div>
            {imageFileUploadProgress && (
              <Progress progress={imageFileUploadProgress} />
            )}
            {uploadImgError
              ? (setTimeout(() => {
                  setUploadImgError(null);
                }, 4500),
                (
                  <Alert
                    color="failure"
                    className="font-semibold h-1 text-clip flex items-center justify-center"
                  >
                    {uploadImgError}
                  </Alert>
                ))
              : imageFileUrl && (
                  <div className="max-w-full h-32 hover:h-52 overflow-y-scroll transition-all duration-30 ease-in-out">
                    <img
                      src={imageFileUrl}
                      alt="Post"
                      className="w-full object-cover "
                    />
                  </div>
                )}
            {formik.touched.content && formik.errors.content ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {formik.errors.content}
              </h6>
            ) : null}
            <Textarea
              placeholder="Write something"
              className="h-32 resize-none"
              id="content"
              name="content"
              value={formik.values.content}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            />
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              size="lg"
              disabled={imageFileUploading}
            >
              Create Post
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
