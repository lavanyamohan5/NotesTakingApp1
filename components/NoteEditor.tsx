import React, { useRef } from 'react';
import { Image as ImageIcon, X, Save } from 'lucide-react';
import { Note, NoteImage } from '../types';

interface NoteEditorProps {
  note: Note;
  updateNote: (updatedNote: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, updateNote }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote({
      ...note,
      title: e.target.value,
      updatedAt: Date.now(),
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote({
      ...note,
      content: e.target.value,
      updatedAt: Date.now(),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImage: NoteImage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        data: base64String,
        name: file.name,
        timestamp: Date.now(),
      };

      updateNote({
        ...note,
        images: [...note.images, newImage],
        updatedAt: Date.now(),
      });
    };

    reader.readAsDataURL(file);
    // Reset input so same file can be selected again if deleted
    e.target.value = '';
  };

  const removeImage = (imageId: string) => {
    updateNote({
      ...note,
      images: note.images.filter((img) => img.id !== imageId),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700"
        />
        <div className="flex items-center gap-2">
           <span className="text-xs text-green-500 flex items-center gap-1 animate-pulse">
             <Save className="w-3 h-3" />
             Saved
           </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors py-1 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ImageIcon className="w-4 h-4" />
          Add Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start typing your note here... (Supports Tamil, Hindi, English)"
          className="w-full h-[60vh] resize-none bg-transparent border-none focus:outline-none text-lg leading-relaxed text-gray-800 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 font-sans"
        />

        {/* Image Gallery within Note */}
        {note.images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
            {note.images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <img
                  src={img.data}
                  alt={img.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(img.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/50 p-2 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;