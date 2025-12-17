import React from 'react';
import FAQ from '@/components/FAQ'; // Usa el alias '@' para ir directo a src

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20"> {/* Agregué pt-20 para separar del navbar */}
            <FAQ />
        </div>
    );
}