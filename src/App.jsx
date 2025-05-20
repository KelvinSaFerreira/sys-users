import React, { useState } from "react";
import style from "./App.module.scss";
import UserForm from "./pages/UserForm/UserForm";
import UsersList from "./pages/UsersList/UsersList";
import LayoutHeader from "./components/LayoutHeader/LayoutHeader";
function App() {
  const [showForm, setShowForm] = useState(true);

  return (  
    <main className={style.app}>
      <LayoutHeader showForm={showForm} setShowForm={() => setShowForm(!showForm)} />
      {showForm ? <UserForm /> : <UsersList />}
    </main>
  );
}

export default App;
