import { motion } from "framer-motion";
import { Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllProjectsQuery , useDeleteProjectMutation } from '../../redux/api/projectService';
import toast from 'react-hot-toast';

const ProjectsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isError } = useGetAllProjectsQuery ();
    const projects = data?.projects || []; // Adjusted to reflect the API response structure
    const [deleteProject] = useDeleteProjectMutation();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.category.name.toLowerCase().includes(searchTerm)
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading projects.</div>;

    const handleEdit = (project) => {
        navigate('/editProject/' + project._id);
    };

    const handleDelete = async (projectId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (confirmDelete) {
            try {
                await deleteProject(projectId).unwrap();
                toast.success('Project deleted successfully');
            } catch (error) {
                toast.error('Error deleting project');
            }
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >   
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-100">Portfolio Projects</h2>

        <input
            type="text"
            placeholder="Search projects..."
            className="w-full md:w-auto bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
        />
        </div>


            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Title</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Technologies</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Media</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredProjects.map((project) => (
                            <motion.tr
                                key={project._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                    {project.title}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    {project.technologies.map(tech => tech.name).join(', ')}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    {project.media.length > 0 && (
                                        <img 
                                            src={project.media[0].url}
                                            alt='Project media'
                                            className='w-16 h-16 object-cover rounded'
                                        />
                                    )}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    <button 
                                        className='text-indigo-400 hover:text-indigo-300 mr-2'
                                        onClick={() => handleEdit(project)} 
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        className='text-red-400 hover:text-red-300'
                                        onClick={() => handleDelete(project._id)}
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
    );
};

export default ProjectsTable;

