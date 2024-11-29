import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedLayout from './components/ProtectedRoute';
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import TestimonialsTable from "./pages/TestimonialsTable";
import CategoryForm from './components/Forms/CategoryForm';
import ProjectForm from './components/Forms/ProjectForm';
import SkillsForm from './components/Forms/SkillsForm';
import CategoriesTable from './components/Forms/CategoriesTable';
import TestimonialsForm from './components/Forms/TestimonialsForm';


function App() {

  return (
    <>
    	<div className='  bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
	
       <Toaster />
      <Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />

        <Route element={<ProtectedLayout />}>
        
          <Route path='/' element={<OverviewPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/createProduct' element={<ProjectForm />} />
          <Route path="/editProject/:id" element={<ProjectForm />} />
          <Route path='/catagory' element={<CategoriesTable />} />
          <Route path='/createCatagory' element={<CategoryForm />} />
          <Route path='/editCategory/:id' element={<CategoryForm />} />
          <Route path='/reviews' element={<TestimonialsTable />} />
          <Route path='/createTestimonial' element={<TestimonialsForm />} />
          <Route path='/editTestimonial/:id' element={<TestimonialsForm />} />
          <Route path='/skills' element={<SkillsForm />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Route>

			</Routes>
      </div>
    </>
  )
}

export default App
