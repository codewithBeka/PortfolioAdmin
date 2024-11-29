import React, { useRef, useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../../redux/api/categoryService';
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from '../../redux/api/projectService';
import { useUploadMediaMutation, useDeleteMediaMutation } from '../../redux/api/mediaApiSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ProjectForm = () => {
    const { id } = useParams();
    const { data: categories } = useGetCategoriesQuery();
    const { data: projectData, isLoading, isError } = useGetProjectByIdQuery(id, { skip: !id });

    const [createProject] = useCreateProjectMutation();
    const [updateProject] = useUpdateProjectMutation();
    const [uploadMedia] = useUploadMediaMutation();
    const [deleteMedia] = useDeleteMediaMutation();
    const quillRef = useRef(null);

    const [project, setProject] = useState({
        title: '',
        description: '',
        simpleDescription: '',
        technologies: [],
        media: [],
        category: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        videoUrl: '',

    });

    // Log projectData and project state for debugging
    console.log("projectData", projectData);
    console.log("project", project);

    // Effect to update project state when projectData changes
    useEffect(() => {
        if (projectData) {
            console.log("Fetched projectData:", projectData);
            setProject({
                title: projectData.title,
                description: projectData.description,
                simpleDescription: projectData.simpleDescription || '',
                technologies: projectData.technologies || [],
                media: projectData.media || [],
                category: projectData.category ? projectData.category._id : '',
                liveUrl: projectData.liveUrl|| '',
                githubUrl: projectData.githubUrl || '',
                featured: projectData.featured || false,
                videoUrl: '', // Reset video URL for editing
            });
        }
    }, [projectData]);

    // Log the updated project state
    useEffect(() => {
        console.log("Updated project state:", project);
    }, [project]);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2,3,4,5,6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
            ['clean'],
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setProject(prev => ({ ...prev, description: value }));
    };

    const handleTechnologyChange = (e, index) => {
        const { name, value } = e.target;
        setProject(prev => {
            const updatedTechnologies = [...prev.technologies];
            updatedTechnologies[index][name] = value;
            return { ...prev, technologies: updatedTechnologies };
        });
    };

    const handleTechnologyImageUpload = async (e, index) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append('media', file);

            try {
                const [uploadResult] = await uploadMedia(formData).unwrap();
                if (uploadResult) {
                    setProject(prev => {
                        const updatedTechnologies = [...prev.technologies];
                        updatedTechnologies[index] = {
                            ...updatedTechnologies[index],
                            image: uploadResult.url,
                            publicId: uploadResult.publicId,
                        };
                        return { ...prev, technologies: updatedTechnologies };
                    });
                    toast.success('Technology image uploaded successfully');
                }
            } catch (error) {
                toast.error('Error uploading technology image');
                console.error('Image upload failed:', error);
            }
        }
    };

    const deleteTechnologyImage = async (index) => {
        const { publicId } = project.technologies[index];
        if (publicId) {
            try {
                await deleteMedia({ publicId, resourceType: 'image' });
                setProject(prev => ({
                    ...prev,
                    technologies: prev.technologies.filter((_, i) => i !== index),
                }));
                toast.success('Technology image deleted successfully');
            } catch (error) {
                toast.error('Error deleting technology image');
                console.error('Delete media failed:', error);
            }
        }
    };

    const addTechnologyField = () => {
        setProject(prev => ({
            ...prev,
            technologies: [...prev.technologies, { name: '', image: '', publicId: '' }],
        }));
    };

    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('media', file);
            try {
                const [uploadResult] = await uploadMedia(formData).unwrap();
                return uploadResult;
            } catch (err) {
                toast.error('Error uploading media file');
                console.error('Upload failed:', err);
                return null;
            }
        });

        const uploadedMedia = await Promise.all(uploadPromises);
        const validMedia = uploadedMedia.filter(mediaItem => {
            return mediaItem?.url && mediaItem?.type && mediaItem?.publicId;
        });

        setProject(prev => ({
            ...prev,
            media: [...prev.media, ...validMedia.map(item => ({ url: item.url, type: item.type, publicId: item.publicId }))],
        }));
        toast.success('Media uploaded successfully');
    };

    const deleteMediaFile = async (index) => {
        const publicId = project.media[index]?.publicId;
        if (publicId) {
            try {
                await deleteMedia({ publicId, resourceType: 'image' });
                setProject(prev => ({
                    ...prev,
                    media: prev.media.filter((_, i) => i !== index),
                }));
                toast.success('Media file deleted successfully');
            } catch (error) {
                toast.error('Error deleting media file');
                console.error('Delete media failed:', error);
            }
        }
    };
    const addVideoUrl = () => {
        if (project.videoUrl) {
            setProject(prev => ({
                ...prev,
                media: [...prev.media, { url: project.videoUrl, type: 'video' }],
                videoUrl: '', // Reset input after adding
            }));
            toast.success('Video URL added successfully');
        } else {
            toast.error('Please enter a valid video URL');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (projectData) {
                await updateProject({ id: projectData._id, ...project }).unwrap();
                toast.success('Project updated successfully');
            } else {
                await createProject(project).unwrap();
                toast.success('Project created successfully');
                     // Reset the form state
            setProject({
              title: '',
              description: '',
              technologies: [],
              media: [],
              category: '',
              liveUrl: '',
              githubUrl: '',
              featured: false,
          });
            }
        } catch (error) {
            toast.error('Error saving project');
            console.error('Project save failed:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading project data.</div>;

    return (
        <div className="mb-4 p-12 bg-gray-800 bg-opacity-50 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">{projectData ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={project.title}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                />
                <ReactQuill
                    ref={quillRef}
                    value={project.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    className="border mb-4 "
                    placeholder="Write your project description here..."
                />       
                <input
                    type="text"
                    name="simpleDescription" // Added simple description input
                    placeholder="Simple Description"
                    value={project.simpleDescription}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                />
                <select
                    name="category"
                    value={project.category}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                >
                    <option value="">Select Category</option>
                    {categories && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <input
                    type="url"
                    name="liveUrl"
                    placeholder="Live URL"
                    value={project.liveUrl}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                />
                <input
                    type="url"
                    name="githubUrl"
                    placeholder="GitHub URL"
                    value={project.githubUrl}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                />
                <label className="border p-4 mb-4 cursor-pointer">
                    <input
                        type="file"
                        onChange={handleMediaUpload}
                        multiple
                        className="hidden"
                    />
                    Upload Media
                </label>
                <div className="mb-4">
                    {project.media.map((file, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <img src={file.url} alt={`media-${index}`} className="h-20 w-20 object-cover mr-2" />
                            <button type="button" onClick={() => deleteMediaFile(index)} className="text-red-500 ml-2">Delete</button>
                        </div>
                    ))}
                </div>
                <label className="mb-4">
                    Video URL:
                    <input
                        type="url"
                        value={project.videoUrl}
                        onChange={handleChange}
                        name="videoUrl"
                        placeholder="Enter video URL"
                        className="border p-2 mb-2 bg-gray-800 bg-opacity-50 w-full"
                    />
                    <button type="button" onClick={addVideoUrl} className="bg-blue-500 text-white p-2">Add Video</button>
                </label>
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={() => setProject(prev => ({ ...prev, featured: !prev.featured }))}
                        className="mr-2"
                    />
                    Featured Project
                </label>

                {/* Technologies Section */}
                <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                {project.technologies.map((tech, index) => (
                    <div key={index} className="flex mb-4 items-center">
                        <input
                            type="text"
                            name="name"
                            placeholder="Technology Name"
                            value={tech.name}
                            onChange={(e) => handleTechnologyChange(e, index)}
                            className="border p-2 mr-2 flex-1 bg-gray-800 bg-opacity-50"
                            required
                        />
                        <input
                            type="file"
                            onChange={(e) => handleTechnologyImageUpload(e, index)}
                            className="border p-2 mr-2"
                        />
                        {tech.image && (
                            <div className="flex items-center">
                                <img src={tech.image} alt={`Technology ${index}`} className="h-10 w-10 object-cover mr-2" />
                                <button type="button" onClick={() => deleteTechnologyImage(index)} className="text-red-500">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addTechnologyField} className="bg-blue-500 bg-opacity-50 p-2 mb-4">
                    Add Technology
                </button>

                <button type="submit" className="bg-blue-500 text-white p-2">{projectData ? 'Update Project' : 'Add Project'}</button>
            </form>
        </div>
    );
};

export default ProjectForm;