import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/database';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Loader2, CreditCard } from 'lucide-react';
import IDCardPreview from '../IDCard/IDCardPreview';

export default function Dashboard() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const data = await db.getCards();
            setCards(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ID card? This action cannot be undone.')) {
            try {
                await db.deleteCard(id);
                setCards(cards.filter(card => card.id !== id));
            } catch (err) {
                alert('Failed to delete card: ' + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900">ID Generator</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your ID Cards</h2>
                        <p className="text-slate-500 mt-1">Manage and view your generated identity cards</p>
                    </div>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Card
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        Error loading cards: {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : cards.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No cards created yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            Get started by creating your first professional ID card using our easy generator.
                        </p>
                        <Link
                            to="/create"
                            className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                        >
                            Create your first card <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card) => (
                            <div key={card.id} className="group relative">
                                <div className="transform transition-transform group-hover:-translate-y-1">
                                    <IDCardPreview data={card} />
                                </div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <Link
                                        to={`/edit/${card.id}`}
                                        className="bg-white hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
