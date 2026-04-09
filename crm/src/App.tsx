import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DashboardPage from "@/page/DashboardPage";
import Chat from "@/page/ChatPage";
import ContactsPage from "./page/ContactsPage";
import ContactProfilePage from "./page/ContactProfilePage";
import TasksPage from "./page/TasksPage";
import SettingsPage from "./page/SettingsPage";
import { ContactsProvider } from "@/context/ContactsContext";

function App() {
  return (
    <ContactsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tray" element={<Chat />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="contacts/:id" element={<ContactProfilePage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContactsProvider>
  );
}

export default App;
