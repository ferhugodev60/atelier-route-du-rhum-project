// client/src/components/admin/AdminPagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function AdminPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-10 font-sans">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
                Page <span className="text-rhum-gold">{currentPage}</span> sur {totalPages}
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 border border-white/10 text-rhum-gold disabled:opacity-10 hover:bg-white/5 transition-all"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => onPageChange(idx + 1)}
                            className={`w-10 h-10 text-[10px] font-black transition-all border ${
                                currentPage === idx + 1
                                    ? 'bg-rhum-gold text-rhum-green border-rhum-gold'
                                    : 'border-white/10 text-white/40 hover:border-rhum-gold/40'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 border border-white/10 text-rhum-gold disabled:opacity-10 hover:bg-white/5 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}