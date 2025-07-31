// app/dashboard/page.jsx
"use client"; // This component must be a client component

import React from 'react';
// Removed useAuthStatus and useRouter imports as they are handled by the layout.
// Removed Dice1 import as it was unused.
import { ForYouContent } from '@/app/modules/components/For You/for-you-content'; // Correctly import ForYouContent

// --- Placeholder Content Components (These would typically be in their own page files) ---
// If you intend for /dashboard/my-library and /dashboard/settings to be distinct routes,
// you would create separate page.jsx files for them (e.g., app/dashboard/my-library/page.jsx).

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

// This page now directly renders the ForYouContent.
// The layout (app/dashboard/layout.tsx) handles authentication, sidebar, and routing.
const ForYouPage = () => {
    // All state and hooks related to global layout and auth are removed
    // as they are handled by the parent DashboardLayout.

    return (
        // The content is directly rendered here.
        // The `SidebarInset` from the layout provides the correct spacing and overflow.
        <ForYouContent />
    );
}

export default ForYouPage;
