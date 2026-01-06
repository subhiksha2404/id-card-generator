import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import CreateCardPage from './components/CreateCard/CreateCardPage';
import EditCardPage from './components/CreateCard/EditCardPage';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={!session ? <LoginPage /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/signup"
                    element={!session ? <SignupPage /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/"
                    element={session ? <Dashboard /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/create"
                    element={session ? <CreateCardPage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/edit/:id"
                    element={session ? <EditCardPage /> : <Navigate to="/login" replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
