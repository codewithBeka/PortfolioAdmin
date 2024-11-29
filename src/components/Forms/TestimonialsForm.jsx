import React, { useState, useEffect } from 'react';
import { useGetAllTestimonialsQuery, useCreateTestimonialMutation, useUpdateTestimonialMutation } from '../../redux/api/testimonialsApi';
import { useUploadMediaMutation, useDeleteMediaMutation } from '../../redux/api/mediaApiSlice';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const TestimonialsForm = () => {
    const { id } = useParams(); // Get testimonial ID from URL parameters
    const { data: testimonials = [], isLoading } = useGetAllTestimonialsQuery();
    const [createTestimonial] = useCreateTestimonialMutation();
    const [updateTestimonial] = useUpdateTestimonialMutation();
    const [uploadMedia] = useUploadMediaMutation();
    const [deleteMedia] = useDeleteMediaMutation(); // Add delete media mutation
    const navigate = useNavigate();

    const [testimonial, setTestimonial] = useState({
        quote: '',
        name: '',
        title: '',
        rating: 1,
        profileImage: '',
        publicId: '', // Ensure publicId is part of the state
    });

    useEffect(() => {
        if (id) {
            const existingTestimonial = testimonials.find((t) => t._id === id);
            if (existingTestimonial) {
                setTestimonial(existingTestimonial);
            }
        }
    }, [id, testimonials]);

    const handleChange = ({ target: { name, value } }) => {
        setTestimonial((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('media', file);
                const response = await uploadMedia(formData).unwrap();
                if (response.length > 0) {
                    setTestimonial((prev) => ({
                        ...prev,
                        profileImage: response[0].url,
                        publicId: response[0].publicId, // Set publicId from the response
                    }));
                    toast.success('Image uploaded successfully!');
                } else {
                    toast.error('Error uploading image.');
                }
            } catch (error) {
                console.error('Error uploading media:', error);
                toast.error('Error uploading image.');
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!testimonial.publicId) {
            console.log('No publicId available to delete image.');
            return; // No publicId means no image to delete
        }

        try {
            console.log("testimonial.publicId",testimonial.publicId)
            await deleteMedia({ publicId: testimonial.publicId, resourceType: 'image' }).unwrap();
            setTestimonial((prev) => ({
                ...prev,
                profileImage: '',
                publicId: '', // Clear publicId after deletion
            }));
            toast.success('Image deleted successfully!');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Error deleting image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Update existing testimonial
                await updateTestimonial({ id, testimonial }).unwrap();
                toast.success('Testimonial updated successfully!');
            } else {
                // Create new testimonial
                await createTestimonial(testimonial).unwrap();
                toast.success('Testimonial added successfully!');
            }
            // Reset form after submission
            setTestimonial({ quote: '', name: '', title: '', rating: 1, profileImage: '', publicId: '' });
            navigate('/'); // Redirect to the testimonials list or desired page
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error('Error saving testimonial.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-10">
            <h1 className="text-3xl text-white mb-5">{id ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-5 rounded-lg shadow-md mb-5">
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="quote">Quote</label>
                    <textarea
                        name="quote"
                        placeholder="Enter testimonial quote"
                        value={testimonial.quote}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="name">Client Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Client Name"
                        value={testimonial.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="title">Client Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Client Title"
                        value={testimonial.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="rating">Rating</label>
                    <select
                        name="rating"
                        value={testimonial.rating}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>{star}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="profileImage">Upload Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                {testimonial.profileImage && (

                    <div className="mb-4">
                        <img src={testimonial.profileImage} alt="Profile" className="w-32 h-32 object-cover mb-2" />
                        <button 
                            type="button" 
                            onClick={handleDeleteImage}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        >
                            Delete Image
                        </button>
                    </div>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    {id ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
            </form>
        </div>
    );
};

export default TestimonialsForm;