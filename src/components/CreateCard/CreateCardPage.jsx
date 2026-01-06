import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import IDCardPreview from '../IDCard/IDCardPreview';

export default function CreateCardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        phoneNumber: '',
        email: '',
        organizationName: '',
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('File size must be less than 2MB');
                return;
            }
            setPhotoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
        }
    };

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('File size must be less than 2MB');
                return;
            }
            setSignatureFile(file);
            const objectUrl = URL.createObjectURL(file);
            setSignaturePreview(objectUrl);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!photoFile) {
            setError('Profile photo is required');
            setLoading(false);
            return;
        }

        try {
            await db.createCard(formData, photoFile, signatureFile);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to create card');
        } finally {
            setLoading(false);
        }
    };

    // Construct preview data
    const previewData = {
        full_name: formData.fullName,
        dob: formData.dob,
        phone_number: formData.phoneNumber,
        email: formData.email,
        photo_url: photoPreview,
        id_number: 'ID-PREVIEW-001',
        organization_name: formData.organizationName,
        signature_url: signaturePreview
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Link to="/" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900 mb-8">Create New ID Card</h1>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Form Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer relative">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                            <div className="flex text-sm text-slate-600">
                                                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload a file</span>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Company/Institution Name</label>
                                        <input
                                            type="text"
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Gemini Corp"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Authorized Signature (Image)</label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer relative">
                                                    <div className="space-y-1 text-center">
                                                        <div className="flex text-sm text-slate-600 justify-center">
                                                            <span className="font-medium text-blue-600 hover:text-blue-500">Upload Signature</span>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                accept="image/*"
                                                                onChange={handleSignatureChange}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-slate-500">PNG (Transparent recommended)</p>
                                                    </div>
                                                </label>
                                            </div>
                                            {signaturePreview && (
                                                <div className="h-20 w-32 border border-slate-200 rounded-lg p-2 bg-white flex items-center justify-center">
                                                    <img src={signaturePreview} alt="Sig Preview" className="max-h-full max-w-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                required
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                required
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate ID Card'}
                                        {!loading && <Save className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Section */}
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <h3 className="text-lg font-medium text-slate-900">Live Preview</h3>
                            <div className="flex justify-center bg-slate-200 p-8 rounded-xl border border-slate-300">
                                <IDCardPreview data={previewData} />
                            </div>
                            <p className="text-sm text-slate-500 text-center">
                                This is how the ID card will look. The ID number and Issue Date were auto-generated.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
