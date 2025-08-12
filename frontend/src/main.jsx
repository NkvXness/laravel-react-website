import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Проверяем, что элемент root существует
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Не найден элемент с id="root"');
}

// Создаем корневой элемент React 18
const root = ReactDOM.createRoot(rootElement);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
