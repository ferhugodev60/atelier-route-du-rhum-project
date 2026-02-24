import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

interface ProfileFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (v: string) => void;
    placeholder?: string;
    readOnly?: boolean;
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
            setStatus({ type: 'success', msg: "Le dossier de membre a été mis à jour avec succès dans le registre." });
            setIsEditing(false);
        } catch (err: any) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.error || "Une erreur est survenue lors de la synchronisation avec le registre central."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl font-sans">
            <header className="mb-16 flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">Dossier de membre</h2>
                    <p className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-black mt-3 opacity-60">Identité certifiée au sein de l'établissement</p>
                </div>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setStatus(null);
                    }}
                    className={`text-[10px] uppercase tracking-[0.2em] px-8 py-3 font-black rounded-sm transition-all border ${
                        isEditing
                            ? 'border-red-500 text-red-500 bg-red-500/5 hover:bg-red-500/10'
                            : 'border-rhum-gold text-rhum-gold hover:bg-rhum-gold/10'
                    }`}
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-20">
                {/* 🏺 Identifiant immuable du Cursus */}
                <ProfileField
                    label="Code Passeport"
                    value={user?.memberCode || "Non assigné"}
                    isEditing={false}
                    readOnly={true}
                    onChange={() => {}}
                />
                <ProfileField
                    label="Email de référence"
                    value={formData.email}
                    isEditing={isEditing}
                    readOnly={true}
                    onChange={() => {}}
                />
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
                    label="Téléphone"
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, phone: v})}
                    placeholder="Ex: 06 00 00 00 00"
                />
                <div className="flex flex-col gap-3 border-b border-white/10 pb-6 opacity-40">
                    <label className="text-rhum-gold text-[9px] uppercase tracking-[0.3em] font-black">Palier technique</label>
                    <div className="h-10 flex items-center">
                        <span className="font-serif text-xl tracking-tight leading-none text-white">
                            Niveau {user?.conceptionLevel || 0} validé
                        </span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {(status || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="mt-16 space-y-8"
                    >
                        {status && (
                            <p className={`text-[11px] uppercase tracking-[0.2em] font-bold p-5 border text-center rounded-sm ${
                                status.type === 'success' ? 'text-rhum-gold border-rhum-gold/30 bg-rhum-gold/10' : 'text-red-500 border-red-500/30 bg-red-500/10'
                            }`}>
                                {status.msg}
                            </p>
                        )}

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-6 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white transition-all shadow-2xl disabled:opacity-50 active:scale-[0.99] rounded-sm"
                            >
                                {loading ? "Mise à jour du registre..." : "Enregistrer les modifications"}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProfileField({ label, value, isEditing, onChange, placeholder = "", readOnly = false }: ProfileFieldProps) {
    const shouldShowInput = isEditing && !readOnly;

    return (
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6 group">
            <label className="text-rhum-gold text-[9px] uppercase tracking-[0.3em] font-black group-hover:opacity-100 opacity-60 transition-opacity">
                {label}
            </label>
            <div className="h-10 flex items-center">
                {shouldShowInput ? (
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/10 px-4 py-3 text-white font-sans text-lg lg:text-xl outline-none focus:border-rhum-gold transition-all placeholder:text-white/10"
                    />
                ) : (
                    <span className={`font-serif text-xl tracking-tight leading-none ${readOnly ? 'text-white/40' : 'text-white'}`}>
                        {value || <span className="text-white/10 font-sans text-xs uppercase tracking-[0.2em] font-black">Donnée non renseignée</span>}
                    </span>
                )}
            </div>
        </div>
    );
}