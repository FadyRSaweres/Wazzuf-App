import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/main";
import AllJobs from "../pages/home";
import JobDetails from "../pages/job";
import SearchPage from "../pages/search";
import SkillDetails from "../pages/skill";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <AllJobs />,
        index: true,
        path: "/",
      },
      {
        element: <SearchPage />,
        path: "/search",
      },
      {
        element: <JobDetails />,
        path: "/job/:id",
      },
      {
        element: <SkillDetails />,
        path: "/skill/:id",
      },
    ],
  },
]);

export default router;
