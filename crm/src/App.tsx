import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Chat from "@/page/ChatPage";
import ContactsPage from "./page/ContactsPage";
import TasksPage from "./page/TasksPage";
import SettingsPage from "./page/SettingsPage";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="tray" element={<Chat />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
