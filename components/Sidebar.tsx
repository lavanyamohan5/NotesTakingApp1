import React from 'react';
import { Plus, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { Note } from '../types';
import SearchBar from './SearchBar';

interface SidebarProps {
  notes: Note[];
  currentNoteId: string | null;
  setCurrentNoteId: (id: string) => void;
  addNote: () => void;
  deleteNote: (id: string, e: React.MouseEvent) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNoteId,
  setCurrentNoteId,
  addNote,
  deleteNote,
  searchTerm,
  setSearchTerm,
  isMobileOpen,
  setIsMobileOpen
}) => {
  // Filter notes based on search term
  const filteredNotes = notes.filter((note) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(term);
    const contentMatch = note.content.toLowerCase().includes(term);
    const imageMatch = note.images.some(img => img.name.toLowerCase().includes(term));
    return titleMatch || contentMatch || imageMatch;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Simple Notes
            </h1>
          </div>
          
          <button
            onClick={() => {
              addNote();
              if (window.innerWidth < 768) setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-medium mb-4"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
              <p className="text-sm">No notes found.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setCurrentNoteId(note.id);
                  if (window.innerWidth < 768) setIsMobileOpen(false);
                }}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border
                  ${currentNoteId === note.id
                    ? 'bg-white dark:bg-gray-800 border-primary shadow-md ring-1 ring-primary'
                    : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold truncate pr-6 ${currentNoteId === note.id ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                    {note.title || "Untitled Note"}
                  </h3>
                  <button
                    onClick={(e) => deleteNote(note.id, e)}
                    className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {note.content || "No additional text"}
                </p>
                {note.images.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <ImageIcon className="w-3 h-3" />
                    <span>{note.images.length} image{note.images.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="text-[10px] text-gray-400 mt-2 text-right">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;