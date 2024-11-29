import React, { useState, useEffect } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useGetCategoryByIdQuery } from '../../redux/api/categoryService';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../common/Header';

const CategoryForm = () => {
    const { id } = useParams();
    const { data: categoryData, isLoading, isError } = useGetCategoryByIdQuery(id, { skip: !id });
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();

    const [category, setCategory] = useState({ name: '' });

    useEffect(() => {
        if (categoryData) {
            setCategory({ name: categoryData.name });
        }
    }, [categoryData]);

    const handleChange = (e) => {
        setCategory({ name: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateCategory({ id, ...category }).unwrap();
                toast.success('Category updated successfully');
            } else {
                await createCategory(category).unwrap();
                toast.success('Category created successfully');
            }
            setCategory({ name: '' }); // Reset form
        } catch (error) {
            toast.error('Error saving category');
            console.error('Category save failed:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading category data.</div>;

    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <Header title='Create Catagorys' />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className="mb-4 p-12 bg-gray-800 bg-opacity-50 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">{id ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={category.name}
                    onChange={handleChange}
                    className="border p-2 mb-4 bg-gray-800 bg-opacity-50"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2">{id ? 'Update Category' : 'Add Category'}</button>
            </form>
        </div>
        </main>
        </div>
    );
};

export default CategoryForm;