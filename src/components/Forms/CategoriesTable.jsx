import { motion } from "framer-motion";
import { Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '../../redux/api/categoryService'; // Adjust the import based on your API setup
import toast from 'react-hot-toast';
import Header from "../common/Header";

const CategoriesTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredCategories = categories.filter(
        (category) => category.name.toLowerCase().includes(searchTerm)
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading categories.</div>;

    const handleEdit = (category) => {
        navigate('/editCategory/' + category._id);
    };

    const handleDelete = async (categoryId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
                await deleteCategory(categoryId).unwrap();
                toast.success('Category deleted successfully');
            } catch (error) {
                toast.error('Error deleting category');
            }
        }
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <Header title='Catagorys' />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Categories</h2>
                <button 
                    onClick={() => navigate('/createCatagory')}
                    className='bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center'
                >
                    <Plus size={16} className="mr-2" /> Add Category
                </button>
                <input
                    type='text'
                    placeholder='Search categories...'
                    className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={handleSearch}
                />
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredCategories.map((category) => (
                            <motion.tr
                                key={category._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                    {category.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    <button 
                                        className='text-indigo-400 hover:text-indigo-300 mr-2'
                                        onClick={() => handleEdit(category)} 
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        className='text-red-400 hover:text-red-300'
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
        </main>
        </div>
    );
};

export default CategoriesTable;