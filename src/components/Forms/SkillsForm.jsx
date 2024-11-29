// frontend/src/SkillsForm.js
import React, { useState } from 'react';
import { useGetAllSkillsQuery, useCreateSkillMutation, useDeleteSkillMutation } from '../../redux/api/skillsApi';
import { useUploadMediaMutation, useDeleteMediaMutation } from '../../redux/api/mediaApiSlice';
import toast from 'react-hot-toast';

const SkillsForm = () => {
    const { data: skills = [], error: fetchError, isLoading } = useGetAllSkillsQuery();
    const [newTechnology, setNewTechnology] = useState({ name: '', image: '', publicId: '' });
    const [createSkill] = useCreateSkillMutation();
    const [uploadMedia] = useUploadMediaMutation();
    const [deleteMedia] = useDeleteMediaMutation();
    const [deleteSkill] = useDeleteSkillMutation();
    const handleChange = ({ target: { name, value } }) => {
        setNewTechnology((prevTech) => ({ ...prevTech, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('media', file);
                const response = await uploadMedia(formData).unwrap();
                if (response.length > 0) {
                    setNewTechnology((prevTech) => ({
                        ...prevTech,
                        image: response[0].url,
                        publicId: response[0].publicId,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSkill({ technologies: [newTechnology] }).unwrap();
            toast.success('Technology added successfully!');
            setNewTechnology({ name: '', image: '', publicId: '' });
        } catch (error) {
            console.error('Error adding technology:', error);
            toast.error('Error adding technology.');
        }
    };

    const handleDelete = async (id, publicId) => {
        try {
            await deleteMedia({ publicId, resourceType: 'image' }).unwrap();
            await deleteSkill(id).unwrap();
            toast.success('Technology deleted successfully!');
            // Optionally, you can also update the local state to remove the deleted skill
            newTechnology(skills.filter((skill) => skill._id !== id));
        } catch (error) {
            console.error('Error deleting technology:', error);
            toast.error('Error deleting technology.');
        }
    };

    if (isLoading) return <div className="text-white">Loading...</div>;
    if (fetchError) return <div className="text-red-500">Error loading skills!</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-10">
            <h1 className="text-3xl text-white mb-5">Technologies</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-5 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="name">Technology Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Technology Name"
                        value={newTechnology.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="image">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Add Technology
                </button>
            </form>
            <ul className="mt-5">
                {skills.map(({ _id, technologies }) => (
                    console.log(skills),
                    <li key={_id} className="bg-gray-800 p-4 rounded-lg mt-2">
                        {technologies.map(({ name, image, publicId }, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={image} alt={name} className="w-10 h-10 mr-2" />
                                    <span className="text-white">{name}</span>
                                </div>
                                <button 
                                    onClick={() => handleDelete(_id, publicId)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SkillsForm;