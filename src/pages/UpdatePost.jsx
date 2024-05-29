import {
  deleteObject,
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
  Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export const UpdatePost = () => {
  const navigate = useNavigate();
  const storage = getStorage();
  const { currentUser } = useSelector((state) => state.user);
  const postId = useParams().postId;
  const [postData, setPostData] = useState({});
  const [uploadPostSuccess, setUploadPostSuccess] = useState(false);
  const [uploadImgError, setUploadImgError] = useState(null);
  const [updatePostError, setUpdatePostError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [oldImagePost, setOldImagePost] = useState(null);
  const [postOwnerId, setPostOwnerId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState("");
  const [postTitletoDelete, setPostTitletoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);

const handleDelete = async () => {
    try {
      console.log(postIdtoDelete, currentUser._id);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/deletepost/${postIdtoDelete}/${postOwnerId}`
      );
      if (response.status === 200) {
        navigate(
          currentUser.isAdmin
            ? "/dashboard?tab=posts"
            : "/userDashboard?tab=posts"
        );
        // Crear una referencia no raíz utilizando child
        const fileRef = ref(storage, imageToDelete);
        if (imageToDelete === null) {
          return;
        } else {
          // Eliminar el archivo utilizando la referencia no raíz
          await deleteObject(fileRef);
        }
      }
    } catch (error) {
      console.log(error);
      // Manejar el error de forma adecuada
    }}

  useEffect(() => {
    try {
      const getPostById = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?postId=${postId}`);
        if (res.status !== 200) setUpdatePostError(res.data.message);
        if (res.status === 200) {
          setPostData(res.data.posts[0]);
          setPostOwnerId(res.data.posts[0].userId);
          setOldImagePost(res.data.posts[0].image);
        }
      };
      getPostById();
      setTimeout(() => {
        setUpdatePostError(null);
      }, 3000);
    } catch (error) {
      setUpdatePostError(error.response.data.message);
    }
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setUploadImgError(null);
    }
  };

  const handleDeleteImage = async () => {
    const fileRef = ref(storage, oldImagePost);
    if (oldImagePost === null) {
      return;
    } else {
      // Eliminar el archivo utilizando la referencia no raíz
      await deleteObject(fileRef);
      setOldImagePost(null);
    }
  };

  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }, 1500);
    }
  }, [imageFileUploadProgress]);

  const uploadImage = async (title, content, category) => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
        setImageFile(null);
        setImageFileUrl(null);
        setUploadImgError("Image must be less than 2mb");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
          setUploadImgError(null);
          axios
            .put(`${import.meta.env.VITE_BACKEND_URL}/api/post/updatepost/${postId}/${postOwnerId}`, {
              title,
              content,
              category,
              image: downloadURL ? downloadURL : undefined,
            })
            .then((response) => {
              if (response.status === 200) {
                setUpdatePostError(null);
                setUploadPostSuccess(true);
                handleDeleteImage();
                setTimeout(() => {
                  setUploadPostSuccess(null);
                  navigate(
                    currentUser.isAdmin
                      ? "/dashboard?tab=posts"
                      : "/userDashboard?tab=posts"
                  );
                }, 2000);

                // setImageFileUploadProgress(null);
                // setImageFileUploading(false);
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
    //si no pongo lo de abajo el form se carga antes q los valores traidos de axios asique no me muestra nada
    enableReinitialize: true,
    initialValues: {
      title: postData.title ? postData.title : "",
      content: postData.content ? postData.content : "",
      category: postData.category ? postData.category : "",
      image: postData.image ? postData.image : "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(4, "Must be 4 characters or more")
        .max(30, "Must be 30 characters or less"),
      content: Yup.string()
        .min(4, "Must be 4 characters or more")
        .max(2000, "Must be 2000 characters or less"),
      category: Yup.string(),
    }),
    onSubmit: async ({ title, content, category }) => {
      if (
        title === postData.title &&
        content === postData.content &&
        category === postData.category &&
        !imageFile
      ) {
        setUpdatePostError("No changes detected :)");
        return;
      }
      setUpdatePostError(null);
      setUploadPostSuccess(false);
      try {
        if (imageFile) {
          return uploadImage(title, content, category);
        }

        const postSaved = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/updatepost/${postId}/${postOwnerId}`,
          {
            title,
            content,
            category,
          }
        );
        if (postSaved.status === 200) {
          setUpdatePostError(null);
          setUploadPostSuccess(true);
          setTimeout(() => {
            setUploadPostSuccess(null);
          }, 2000);
          setImageFile(null);
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
        }
      } catch (error) {
        const { message } = error.response.data;
        setUpdatePostError(message);
        setTimeout(() => {
          setUpdatePostError(null);
        }, 2000);
      }
    },
  });

  useEffect(() => {
    try {
      const getPostById = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?postId=${postId}`);
        if (res.status !== 200) setUpdatePostError(res.data.message);
        if (res.status === 200) {
          setPostData(res.data.posts[0]);
          // setUpdatePostError(null);
          setOldImagePost(postData.image);
        }
      };
      getPostById();
      setTimeout(() => {
        setUpdatePostError(null);
      }, 3000);
    } catch (error) {
      setUpdatePostError(error.response.data.message);
    }
  }, [postId, formik.isSubmitting, oldImagePost]);

  return (
    <div className="p-3 mt-10 max-w-3xl mx-auto min-h-screen">
      {updatePostError && (
        <Alert
          color="failure"
          className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
        >
          {updatePostError}
        </Alert>
      )}
      {uploadPostSuccess && (
        <Alert
          color="success"
          className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
        >
          Post updated successfully!
        </Alert>
      )}
      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        {formik.touched.title && formik.errors.title ? (
          <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
            {formik.errors.title}
          </h6>
        ) : null}
        <div className="flex sm:flex-row justify-between gap-4">
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
            <option value="science-discoveries">Science & Discoveries</option>
            <option value="education-learning">Education & Learning</option>
            <option value="environment-ecology">Environment & Ecology</option>
            <option value="entrepreneurship-business">
              Entrepreneurship & Business
            </option>
            <option value="sports-fitness">Sports & Fitness</option>
            <option value="automobiles-vehicles">Automobiles & Vehicles</option>
            <option value="relationships-family">Relationships & Family</option>
            <option value="games-videogames">Games & Videogames</option>
            <option value="news-current-events">News & Current Events</option>
            <option value="other">Other...</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-2 border-teal-400 border-dashed p-3">
          <FileInput
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
          : (postData.image || imageFileUrl) && (
              <img
                src={imageFileUrl ? imageFileUrl : postData.image}
                alt="Post"
                className="w-full h-32 object-cover rounded-lg shadow-lg"
              />
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
        <div className="flex  gap-5 px-4 justify-evenly align-middle items-center">
          <Button
            className="text-nowrap hover:brightness-90 dark:hover:brightness-115 p-1 self-center "
            type="button"
            gradientDuoTone="purpleToPink"
            size="lg"
            onClick={() => {
              setShowModal(true);
              setPostIdtoDelete(postData._id);
              setPostTitletoDelete(postData.title);
              setImageToDelete(
                postData.image.includes(
                  "video-tutoriales-sobre-email-marketing"
                )
                  ? null
                  : postData.image
              );
            }}
          >
            Delete Post
          </Button>
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            size="lg"
            disabled={imageFileUploading}
            className="w-full hover:brightness-90 dark:hover:brightness-115 p-1  self-center "
          >
            Update Post
          </Button>
        </div>
      </form>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        dismissible
        size="md"
      >
        <Modal.Header />
        <Modal.Body className="flex items-center justify-center flex-col gap-3">
          <HiOutlineExclamationCircle className="text-red-500 text-6xl" />
          <h1 className="text-center text-2xl font-semibold dark:text-white">
            Delete "{postTitletoDelete}" ?
          </h1>
          <div className="flex justify-between gap-5">
            <Button
              color="failure"
              onClick={() => {
                handleDelete();
                setShowModal(false);
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              gradientDuoTone="greenToBlue"
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
