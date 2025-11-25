import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Note, Theme } from './types';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import Chatbot from './components/Chatbot';
import ThemeToggle from './components/ThemeToggle';
import { DEFAULT_NOTE_TITLE } from './constants';

const App: React.FC = () => {
  // --- State Management ---
  const [notes, setNotes] = useLocalStorage<Note[]>('simple-notes-data', []);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('simple-notes-theme', Theme.LIGHT);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  // --- Effects ---
  
  // Initialize theme
  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Set initial current note
  useEffect(() => {
    if (notes.length > 0 && !currentNoteId) {
      setCurrentNoteId(notes[0].id);
    }
  }, [notes, currentNoteId]);

  // --- Handlers ---

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: DEFAULT_NOTE_TITLE,
      content: '',
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    // Sort by updated recently
    // Optional: Only sort if you want the list to jump. For now, keep order static unless created.
    // Let's keep the order based on creation or just map update to prevent jumping while typing.
    setNotes(updatedNotes);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (currentNoteId === id) {
      setCurrentNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  const getCurrentNote = () => notes.find((n) => n.id === currentNoteId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Mobile Header Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-20 justify-between">
         <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)}>
               <Menu className="text-gray-600 dark:text-gray-300 w-6 h-6" />
            </button>
            <span className="font-bold text-gray-800 dark:text-white">Simple Notes</span>
         </div>
         <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <Sidebar
        notes={notes}
        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}
        addNote={addNote}
        deleteNote={deleteNote}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col relative pt-14 md:pt-0">
         {/* Desktop Theme Toggle positioned absolutely or in a header */}
         <div className="hidden md:block absolute top-4 right-6 z-10">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
         </div>

        {currentNoteId && getCurrentNote() ? (
          <NoteEditor
            note={getCurrentNote()!}
            updateNote={updateNote}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
               <Menu className="w-10 h-10 opacity-20" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-500 dark:text-gray-400">No Note Selected</h2>
            <p>Select a note from the sidebar or create a new one to get started.</p>
            <button 
               onClick={addNote}
               className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-indigo-600 transition-colors"
            >
               Create New Note
            </button>
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default App;