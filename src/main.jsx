import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
// Provider es un componente de React que provee la store de Redux a la aplicación.
import { Provider } from "react-redux";
//como ahora usamos redux-persist, traemos tmb el persistor de nuestra store
import { store, persistor } from "./redux/store.js";
//y también tenes que importar el gate de persist que cubre TODO con el persistor (persiste en el navegador)
//persistente se encarga de manejar la lógica relacionada con la carga del estado persistido antes de que la aplicación se renderice.
//esto es lo que lo diferencia de un simple localstorage
import { PersistGate } from "redux-persist/integration/react";
//importamos flowbite para el tema de la app
import { Flowbite } from "flowbite-react";
ReactDOM.createRoot(document.getElementById("root")).render(
  // {/* PersistGate: envuelve a todo el árbol de componentes de la aplicación que
  // dependan del estado persistido. Al pasarle el persistor, PersistGate se encarga de manejar
  // la lógica relacionada con la carga del estado persistido, antes de q se renderice en el cliente*/}
  <PersistGate persistor={persistor}>
    {/* Provider: envuelve a la aplicación y le proporciona acceso a la store de Redux. */}
    <Provider store={store}>
      {/* ThemeProvider es un componente que envuelve a la aplicación y le proporciona acceso al tema. */}
      <Flowbite>
        <div className="bg-[rgb(234,234,234)] text-rgb(16,23,42) dark:bg-gray-900 dark:text-white">
          <App />
        </div>
      </Flowbite>
    </Provider>
  </PersistGate>
);
