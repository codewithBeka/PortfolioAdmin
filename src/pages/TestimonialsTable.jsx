// frontend/src/TestimonialsTable.js
import React, { useState } from 'react';
import { useGetAllTestimonialsQuery, useDeleteTestimonialMutation } from '../redux/api/testimonialsApi';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/common/Header";

const TestimonialsTable = () => {
    const { data: testimonials = [], error: fetchError, isLoading } = useGetAllTestimonialsQuery();
    const [deleteTestimonial] = useDeleteTestimonialMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredTestimonials = testimonials.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm)
    );

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            await deleteTestimonial(id);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`text-yellow-500 ${index < rating ? 'fas fa-star' : 'far fa-star'}`}>
                ★
            </span>
        ));
    };

    return (
        <>
            <Header title='Testimonials' />

            <div className="min-h-screen bg-gray-900 p-10 mt-5">
                <button
                    onClick={() => navigate('/createTestimonial')}
                    className="mt-5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Create Testimonial
                </button>
                <div className='relative mb-4 mt-7'>
                    <input
                        type='text'
                        placeholder='Search testimonials...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>

                {isLoading && <div className="text-white">Loading testimonials...</div>}
                {fetchError && <div className="text-red-500">Error loading testimonials!</div>}

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Image</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Quote</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Title</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Rating</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700'>
                            {filteredTestimonials.map(({ _id, quote, name, title, rating, profileImage }) => (
                                <motion.tr
                                    key={_id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {profileImage && <img src={profileImage} alt={name} className="w-10 h-10 rounded-full" />}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-gray-300'>{quote.length > 50 ? `${quote.slice(0, 50)}...` : quote}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-300'>{name}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-300'>{title}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            {renderStars(rating)}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            onClick={() => navigate(`/editTestimonial/${_id}`)}
                                            className='text-indigo-400 hover:text-indigo-300 mr-2'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(_id)}
                                            className='text-red-400 hover:text-red-300'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TestimonialsTable;