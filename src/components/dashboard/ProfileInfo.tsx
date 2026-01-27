import { useState } from 'react';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function ProfileInfo() {
    const [userData] = useState<UserProfile>({
        firstName: "Hugo",
        lastName: "Frr",
        email: "hugo@exemple.com",
        phone: "06 12 34 56 78"
    });

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Mon Profil</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Identifiants pour le retrait</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <ProfileItem label="Prénom" value={userData.firstName} />
                <ProfileItem label="Nom" value={userData.lastName} />
                <ProfileItem label="Adresse Email" value={userData.email} />
                <ProfileItem label="Téléphone" value={userData.phone} />
            </div>

            <div className="mt-16 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <p className="text-[9px] uppercase tracking-widest text-rhum-gold font-black mb-2">Note Importante</p>
                <p className="text-xs text-white/40 italic leading-relaxed">
                    Ces informations permettent à notre équipe de vérifier votre identité lors du retrait de vos bouteilles à l'Atelier.
                </p>
            </div>
        </div>
    );
}

function ProfileItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
            <span className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">{label}</span>
            <span className="text-white font-serif text-lg lg:text-xl tracking-tight">{value}</span>
        </div>
    );
}