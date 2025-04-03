import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';

export default function ResourceLibrary() {
  const [resources, setResources] = useState([
    {
      id: '1',
      name: 'React Best Practices.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2024-03-15',
    },
    {
      id: '2',
      name: 'JavaScript Tutorial.mp4',
      type: 'Video',
      size: '45 MB',
      uploadedAt: '2024-03-14',
    },
  ]);

  const handleUpload = () => {
    // Implement file upload logic
    console.log('Upload clicked');
  };

  const handleDownload = (id) => {
    // Implement file download logic
    console.log('Download clicked', id);
  };

  const handleDelete = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{resource.name}</p>
                <p className="text-sm text-gray-500">
                  {resource.type} • {resource.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(resource.id)}
                className="p-1 text-blue-500 hover:text-blue-600"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(resource.id)}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}