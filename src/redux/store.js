import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./user/userSlice";
//de aca para abajo es todo para utilizar redux persist, una especie de local storage
//nos guarda basicamente toda la store en localStorage para que no se pierda al recargar la pagina
//lo que tiene de diferente es que no se guarda todo, sino solo lo que le digamos que guarde
//ademas, espera a que se cargue lo que este en el persit antes de renderizar la app
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

//creamos un combinador de reducers para dsp pasarle a la store como 1 solo reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
});

//creamos la configuración del persist, la key seria con el nombre que se guarda en el navegador
const persistConfig = {
  key: "root",
  storage, //storage es de la librería de redux persist
  version: 1,
};

//y aca al persistReducer (que va a perseverar en el tiempo de ahi su nombre)
//le pasamos lo q configuramos antes, la conf, y el rootReducer q combina todos los reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  //en vez de pasarle reducer por reducer
  //le pasamos el persistReducer que engloba todos los reducers y perdura en el tiempo
  reducer: persistedReducer,

  //requerimos este middleware para prevenir errores utilizando react toolkit, ni idea xD
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

//exportamos el persistor que contiene a la store.
export const persistor = persistStore(store);
