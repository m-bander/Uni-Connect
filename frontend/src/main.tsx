import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";

import Calendar from "@/components/common/calendar/calendar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import GlobalLayout from "./layouts/GlobalLayout";
import CreateAdminPage from "./pages/admin/CreateAdminPage";
import MyStudentCourses from "./pages/student/my-courses";
import { MyInstructorCourses } from "./pages/instructor/my-courses";
import { StudentCoursePage } from "./pages/student/student-course-page";
import { InstructorCoursePage } from "./pages/instructor/instructor-course-page";
import AssignmentSubmission from "./components/common/course/assignments/AssignmentSubmission";
import AssignmentSubmissionProfessor from "./components/common/course/assignments/AssignmentSubmissionProfessor";
import Dashboard from "./pages/student/dashboard";
import Group from "./pages/student/group";
import Materials from "./pages/student/materials";
import { PersonalProfilePage } from "./pages/profile";
import LoginPage from "./pages/user/login";
import SignupPage from "./pages/user/signup";
import AuthProvider from "./providers/AuthProvider";
import ModalProvider from "./providers/ModalProvider";
import { AuthGuard } from "./components/guards/AuthGuard";
import { ClassMembers } from "./pages/student/class-members";
import { Unauthorized } from "./pages/Unauthorized";
import { UnAuthGuard } from "./components/guards/UnAuthGuard";
import ProfilePage from "./pages/user/profile";
import ClassAnnouncementsPage from "./pages/student/class-announcements-page";
import CoursesPage from "./pages/admin/CoursesPage";
import UsersPage from "./pages/admin/UsersPage";
import PendingUsersPage from "./pages/admin/PendingUsersPage";
import { StatisticsPage } from "./pages/admin/StatisticsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/user/landing-page";
import Catalog from "./pages/user/catalog";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/providers/ThemeProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route element={<UnAuthGuard />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                <Route path="/profiles/:profile_id" element={<ProfilePage />} />
                <Route element={<GlobalLayout />}>
                  <Route
                    element={
                      <AuthGuard
                        allowedRoles={[
                          "student",
                          "class_representative",
                          "course_head",
                        ]}
                      />
                    }
                  >
                    <Route path="/student">
                      <Route path="calendar" element={<Calendar />} />
                      <Route path="groups/:id" element={<Group />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="courses" element={<MyStudentCourses />} />
                      <Route
                        path="courses/:id"
                        element={<StudentCoursePage />}
                      />
                      <Route
                        path="courses/:id/assignment/:assignmentId"
                        element={<AssignmentSubmission />}
                      />
                      <Route
                        path="materials/:id/:category"
                        element={<Materials />}
                      />
                      <Route path="profile" element={<PersonalProfilePage />} />
                      <Route path="class-members" element={<ClassMembers />} />
                      <Route
                        path="class-announcements"
                        element={<ClassAnnouncementsPage />}
                      />
                    </Route>
                  </Route>

                  <Route
                    element={<AuthGuard allowedRoles={["professor/ta"]} />}
                  >
                    <Route path="/instructor">
                      <Route path="profile" element={<PersonalProfilePage />} />
                      <Route
                        path="courses/:id"
                        element={<InstructorCoursePage />}
                      />
                      <Route path="courses" element={<MyInstructorCourses />} />
                      <Route
                        path="courses/:id/assignment/:assignmentId"
                        element={<AssignmentSubmissionProfessor />}
                      />
                      <Route
                        path="materials/:id/:category"
                        element={<Materials />}
                      />
                      <Route path="calendar" element={<Calendar />} />
                      <Route path="groups/:id" element={<Group />} />
                    </Route>
                  </Route>

                  <Route
                    path="/admin"
                    element={<AuthGuard allowedRoles={["system_admin"]} />}
                  >
                    <Route path="profile" element={<PersonalProfilePage />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="create-admin" element={<CreateAdminPage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route
                      path="pending-users"
                      element={<PendingUsersPage />}
                    />
                    <Route path="statistics" element={<StatisticsPage />} />
                  </Route>
                </Route>

                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-center" />
            </BrowserRouter>
          </ModalProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
