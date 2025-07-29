// app/dashboard/page.jsx
"use client"; // This component must be a client component

import React, { useState } from 'react';
import { ForYouSidebar } from '../modules/components/For You/Sidebar';  // Make sure to use named import if you exported it as 'export const'
import useAuthStatus from '@/hooks/use-auth-status'; // Your custom hook

// --- Placeholder Content Components ---
// You would replace these with your actual page content for each section
const ForYouContent = () => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome to your personalized feed!</h2>
        <p className="text-gray-700">This is where you&apos;ll find content tailored just for you based on your preferences and activity.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Recommended Article</h3>
                <p className="text-gray-700 text-sm">Discover the latest advancements in AI and machine learning. Dive deep into new research papers and practical applications.</p>
                <button className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Read More</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-green-600">New Course Alert!</h3>
                <p className="text-gray-700 text-sm">Master Next.js with our comprehensive course covering App Router, Server Components, and more.</p>
                <button className="mt-4 px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">Enroll Now</button>
            </div>
        </div>
    </div>
);

const MyLibraryContent = () => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Your Personal Library</h2>
        <p className="text-gray-700">Access all your saved articles, books, and resources here. Organize them into collections for easy retrieval.</p>
        <ul className="list-disc pl-8 mt-6 text-gray-800">
            <li className="mb-2">Article: &quot;The Future of Quantum Computing&quot;</li>
            <li className="mb-2">Book: &quot;Clean Code: A Handbook of Agile Software Craftsmanship&quot;</li>
            <li className="mb-2">Video Series: &quot;Understanding React Hooks&quot;</li>
        </ul>
    </div>
);

const HighlightsContent = () => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-500">Highlights (Coming Soon!)</h2>
        <p className="text-gray-600">This section will allow you to revisit all your highlighted passages and notes from articles and books. Stay tuned!</p>
    </div>
);

const SearchContent = () => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-500">Search (Coming Soon!)</h2>
        <p className="text-gray-600">Find anything across your content with powerful search capabilities.</p>
    </div>
);

const SettingsPageContent = () => (
    <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
        <p className="text-gray-700">Manage your profile, preferences, and security settings.</p>
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Profile Information</h3>
            <div className="space-y-3">
                <p><span className="font-medium">Name:</span> John Doe</p>
                <p><span className="font-medium">Email:</span> john.doe@example.com</p>
            </div>
            <button className="mt-5 px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Edit Profile</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Privacy Settings</h3>
            <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-blue-600 h-5 w-5" checked />
                <span className="text-gray-700">Enable personalized recommendations</span>
            </label>
            <label className="flex items-center space-x-2 mt-3">
                <input type="checkbox" className="form-checkbox text-blue-600 h-5 w-5" />
                <span className="text-gray-700">Receive email notifications</span>
            </label>
        </div>
    </div>
);
// --- End Placeholder Content Components ---


const DashboardPage = () => {
    // Use the custom hook to get the user's authentication status
    const { user, loading } = useAuthStatus();
    // State to manage which content is currently displayed in the main area
    const [activeContentId, setActiveContentId] = useState('for-you'); // Default to 'for-you'

    // Display a loading state while authentication status is being determined
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-2xl animate-pulse">
                Loading dashboard...
            </div>
        );
    }

    // If 'user' is null after loading, redirect or show a login message
    if (!user) {
        // In a real app, you'd likely use `router.push('/login')` here
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex-col text-center p-4">
                <p className="text-4xl font-extrabold text-blue-800 mb-4">Access Denied</p>
                <p className="text-lg text-gray-700 mb-6">Please log in to view the dashboard content.</p>
                {/* You might want a button/link to your actual login page here */}
                {/* Example of a Next.js Link to a login page */}
                {/* <Link href="/login" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Go to Login
                </Link> */}
            </div>
        );
    }

    // Function to render the correct content component based on activeContentId state
    const renderContent = () => {
        switch (activeContentId) {
            case 'for-you':
                return <ForYouContent />;
            case 'my-library':
                return <MyLibraryContent />;
            case 'highlights':
                return <HighlightsContent />;
            case 'search':
                return <SearchContent />;
            case 'settings':
                return <SettingsPageContent />;
            // Add more cases for other items if they trigger content changes
            default:
                return <ForYouContent />; // Fallback to 'For you'
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Pass the 'user' object and the state setter to the sidebar */}
            <ForYouSidebar onSelect={setActiveContentId} activeItem={activeContentId} user={user} />
            <main className="flex-1 overflow-y-auto"> {/* Main content area, allows scrolling */}
                {renderContent()}
            </main>
        </div>
    );
}

export default DashboardPage;