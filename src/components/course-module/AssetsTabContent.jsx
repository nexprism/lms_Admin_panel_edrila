import React from 'react';
import { Package } from 'lucide-react';

const AssetsTabContent = () => {
    return (
        <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Course Assets</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Manage all your course files, images, videos, and downloadable resources.
            </p>
            <div className="text-sm text-gray-500">
                Content will be added here - coming soon!
            </div>
        </div>
    );
};

export default AssetsTabContent;