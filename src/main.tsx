import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { store } from "./app/store.ts";
import "./index.css";
import { fetchUsers } from "./features/users/usersSlice";
import { worker } from "./api/server";

async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: "bypass" });
  store.dispatch(fetchUsers());

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

start();
