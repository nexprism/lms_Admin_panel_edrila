import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AddFilter from "./components/filters/AddFilter";
import FilterList from "./components/filters/FilterList";
import AddCourse from "./pages/courses/AddCourse";
import CourseList from "./pages/courses/CourseList";
import { Edit } from "lucide-react";
import EditCourse from "./pages/courses/EditCourse";
import AddBundle from "./pages/bundles/AddBundle";
import BundleList from "./pages/bundles/bundleList";
import EditBundleForm from "./pages/bundles/EditBundle";
import QuizList from "./pages/Quiz/QuizList";
import AssignmentList from "./pages/Assignmets/AssignmentList";
import TextLessonPage from "./pages/courses/TextLesson";

// Lazy load pages
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const AddCategory = lazy(() => import("./pages/AddCategory"));
const CategoryList = lazy(() => import("./pages/CategoryList"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/categories" element={<CategoryList />} />
              {/* Add more protected routes here if needed */}
              <Route path="/filters/add" element={<AddFilter />} />
              <Route path="/filters/all" element={<FilterList />} />
              <Route path="/courses/add" element={<AddCourse/>} />
              <Route path="/courses/all/courses" element={<CourseList />} />
                <Route path="/courses/edit/:courseId" element={<EditCourse/>} />
                <Route path="/bundles/create" element={<AddBundle/>} />
              <Route path="/bundles/all" element={<BundleList />} />
              <Route path="/bundles/:bundleId" element={<EditBundleForm/>} />
              <Route path="/quiz/all" element={<QuizList/>} />
              <Route path="/assignments/all" element={<AssignmentList/>} />
              <Route path="/courses/all/text-courses" element={<TextLessonPage/>} />


              {/* Nested Routes */}

              {/* Dashboard */}

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* UI Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
