import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({ currentPage, totalPages, onPageChange }: any) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t-2 border-slate-100 pt-8 mt-10 font-sans">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">
                Page <span className="text-emerald-700 text-sm">{currentPage}</span> sur <span className="text-black">{totalPages}</span>
            </p>

            <div className="flex gap-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl disabled:opacity-20 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm"
                >
                    <ChevronLeft size={20} strokeWidth={3} />
                </button>

                <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => onPageChange(idx + 1)}
                            className={`w-12 h-12 rounded-xl text-[11px] font-black transition-all border-2 shadow-sm ${
                                currentPage === idx + 1
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl disabled:opacity-20 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm"
                >
                    <ChevronRight size={20} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}