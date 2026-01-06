import { format } from 'date-fns';
import { Phone, Mail, Calendar } from 'lucide-react';

export default function IDCardPreview({ data, preview }) {
    // data: { fullName, dob, phoneNumber, email, photo_url, id_number }
    // preview: boolean (if true, simplified view or use local object URL for photo if passed as raw file?)
    // Actually, for preview before upload, we might pass a blob URL as photo_url.

    if (!data) return null;

    return (
        <div className="w-[350px] h-[220px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative print:shadow-none print:border-slate-800">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400 z-0"></div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="px-4 pt-4 pb-2 text-white flex justify-between items-start">
                    <div>
                        <h3 className="text-xs font-medium opacity-90 uppercase tracking-wider">Identity Card</h3>
                        <div className="font-bold text-lg leading-tight mt-0.5">GEMINI CORP</div>
                    </div>
                    {/* Logo placeholder or chip */}
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-white/80"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 flex gap-4 mt-2">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-white shadow-md overflow-hidden relative">
                            {data.photo_url ? (
                                <img
                                    src={data.photo_url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <span className="text-xs">No Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pt-2">
                        <h2 className="font-bold text-slate-800 truncate text-lg">{data.full_name || 'Your Name'}</h2>
                        <div className="text-xs text-slate-500 font-medium mb-2">{data.role || 'Employee'}</div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <span className="font-bold text-[8px]">ID</span>
                                </div>
                                <span className="font-mono">{data.id_number || 'ID-XXXXXXXX'}</span>
                            </div>

                            {data.dob && (
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                    <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Calendar className="w-2.5 h-2.5" />
                                    </div>
                                    <span>DOB: {format(new Date(data.dob), 'MMM dd, yyyy')}</span>
                                </div>
                            )}

                            {data.phone_number && (
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                    <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Phone className="w-2.5 h-2.5" />
                                    </div>
                                    <span className="truncate">{data.phone_number}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
                    <span>Issue Date: {format(new Date(), 'MMM dd, yyyy')}</span>
                    <span>Authorized Signature</span>
                </div>
            </div>
        </div>
    );
}
