import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

// 1. DÉFINITION DU CONTRAT (Interface)
interface ProfileFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (v: string) => void; // On précise que 'v' est une string
    placeholder?: string;
}

export default function ProfileInfo() {
    const { user, setAuth, token } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        setStatus(null);

        try {
            const response = await api.patch('/users/me', formData);

            if (user && token) {
                setAuth(response.data, token);
            }

            setStatus({ type: 'success', msg: "Vos parchemins ont été mis à jour." });
            setIsEditing(false);
        } catch (err: any) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.error || "La plume a glissé. Erreur de synchronisation."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-serif text-white tracking-tight">Informations Personnelles</h2>
                    <div className="h-1 w-12 bg-rhum-gold/30 mt-4" />
                </div>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setStatus(null);
                    }}
                    className={`text-[9px] uppercase tracking-[0.2em] px-6 py-2.5 font-black rounded-sm transition-all border ${
                        isEditing
                            ? 'border-red-500/20 text-red-400 hover:bg-red-500/5'
                            : 'border-rhum-gold/20 text-rhum-gold hover:bg-rhum-gold/5'
                    }`}
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
                {/* L'erreur TS7006 disparaît car ProfileField sait maintenant que 'v' est une string */}
                <ProfileField
                    label="Prénom"
                    value={formData.firstName}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, firstName: v})}
                />
                <ProfileField
                    label="Nom"
                    value={formData.lastName}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, lastName: v})}
                />
                <ProfileField
                    label="Email"
                    value={formData.email}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, email: v})}
                />
                <ProfileField
                    label="Téléphone"
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, phone: v})}
                    placeholder="Ex: 06 12 34 56 78"
                />
            </div>

            <AnimatePresence>
                {(status || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-12 space-y-6"
                    >
                        {status && (
                            <p className={`text-[10px] uppercase tracking-widest p-4 border text-center ${
                                status.type === 'success' ? 'text-rhum-gold border-rhum-gold/20 bg-rhum-gold/5' : 'text-red-400 border-red-400/20 bg-red-400/5'
                            }`}>
                                {status.msg}
                            </p>
                        )}

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? "Signature des registres..." : "Enregistrer les modifications"}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 2. APPLICATION DE L'INTERFACE AU SOUS-COMPOSANT
function ProfileField({ label, value, isEditing, onChange, placeholder = "" }: ProfileFieldProps) {
    return (
        <div className="flex flex-col gap-2 border-b border-white/5 pb-4 group">
            <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black group-hover:text-rhum-gold transition-colors">
                {label}
            </label>
            <div className="h-8 flex items-center">
                {isEditing ? (
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-transparent text-white font-serif text-lg outline-none italic placeholder:opacity-10"
                    />
                ) : (
                    <span className="text-white font-serif text-lg tracking-wide">
                        {value || <span className="text-white/10 font-sans text-xs uppercase tracking-widest">Non renseigné</span>}
                    </span>
                )}
            </div>
        </div>
    );
}