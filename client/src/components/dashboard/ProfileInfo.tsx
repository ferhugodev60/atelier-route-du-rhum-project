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

    const isPro = user?.role === 'PRO';
    const hasInstitutionalProfile = isPro || user?.isEmployee;

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        companyName: user?.companyName || "",
        siret: user?.siret || ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                companyName: user.companyName || "",
                siret: user.siret || ""
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
            setStatus({ type: 'success', msg: "Le dossier de membre a été mis à jour avec succès." });
            setIsEditing(false);
        } catch (err: any) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.error || "Erreur de synchronisation avec le registre."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto font-sans px-2 sm:px-0">
            {/* 🏺 HEADER : Harmonisé avec les autres sections */}
            <header className="mb-10 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-rhum-gold/10 pb-6 md:pb-8 gap-6">
                <div>
                    <h2 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tight leading-none">Dossier de membre</h2>
                    <p className="text-rhum-gold text-[8px] md:text-[9px] uppercase tracking-[0.4em] mt-3 font-black">
                        {isPro ? "Identité Institutionnelle" : user?.isEmployee ? "Bénéficiaire de Comité d'Entreprise" : "Identité certifiée"}
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setStatus(null);
                    }}
                    className={`w-full sm:w-auto text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 font-black rounded-sm transition-all border ${
                        isEditing
                            ? 'border-red-500 text-red-500 bg-red-500/5'
                            : 'border-rhum-gold text-rhum-gold hover:bg-rhum-gold/10'
                    }`}
                >
                    {isEditing ? "Annuler" : "Modifier"}
                </button>
            </header>

            {/* 🏺 GRILLE : Espacement réduit sur mobile pour la fluidité */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 md:gap-y-16 gap-x-20">
                <ProfileField
                    label="Code Client"
                    value={user?.memberCode || "Non assigné"}
                    isEditing={false}
                    readOnly={true}
                    onChange={() => {}}
                />
                <ProfileField
                    label="Email"
                    value={formData.email}
                    isEditing={isEditing}
                    readOnly={true}
                    onChange={() => {}}
                />

                {!isPro && (
                    <>
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
                    </>
                )}

                <ProfileField
                    label="Téléphone"
                    value={formData.phone}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({...formData, phone: v})}
                    placeholder="Ex: 06 00 00 00 00"
                />

                {hasInstitutionalProfile && (
                    <>
                        <ProfileField
                            label="Entreprise"
                            value={formData.companyName}
                            isEditing={isEditing}
                            onChange={(v) => setFormData({...formData, companyName: v})}
                            placeholder="Nom de la structure"
                        />
                        <ProfileField
                            label="Numéro SIRET"
                            value={formData.siret}
                            isEditing={isEditing}
                            onChange={(v) => setFormData({...formData, siret: v})}
                            placeholder="14 chiffres"
                        />
                    </>
                )}
            </div>

            <AnimatePresence>
                {(status || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="mt-12 md:mt-16 space-y-6 md:space-y-8"
                    >
                        {status && (
                            <p className={`text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold p-5 border text-center rounded-sm ${
                                status.type === 'success' ? 'text-rhum-gold border-rhum-gold/30 bg-rhum-gold/10' : 'text-red-500 border-red-500/30 bg-red-500/10'
                            }`}>
                                {status.msg}
                            </p>
                        )}

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-5 md:py-6 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] hover:bg-white transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98] rounded-sm"
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
            {/* 🏺 Opacité supprimée sur le label */}
            <label className="text-rhum-gold text-[8px] md:text-[9px] uppercase tracking-[0.25em] md:tracking-[0.3em] font-black">
                {label}
            </label>
            <div className="min-h-10 flex items-center">
                {shouldShowInput ? (
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        /* 🏺 Placeholder : Visibilité fixée à 30% / text-base sur mobile pour éviter le zoom */
                        className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white font-sans text-base md:text-xl outline-none focus:border-rhum-gold transition-all placeholder:text-white/30 rounded-sm"
                    />
                ) : (
                    <span className={`font-serif text-lg md:text-xl tracking-tight leading-tight ${readOnly ? 'text-white/40' : 'text-white'}`}>
                        {value || (
                            /* 🏺 Visibilité augmentée pour le texte fallback */
                            <span className="text-white/20 font-sans text-[10px] uppercase tracking-[0.15em] font-black">
                                Donnée non renseignée
                            </span>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}