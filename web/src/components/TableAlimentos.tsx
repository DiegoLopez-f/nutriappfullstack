import React from 'react';

// Interfaces (puedes moverlas a un archivo de tipos si prefieres)
interface AlimentoPlan {
    refAlimento: string;
    cantidad: string | number;
}

interface AlimentoBase {
    id: string;
    nombre: string;
    unidad: string;
    cantidadBase: number;
    proteina: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
}

interface Props {
    alimentos: AlimentoPlan[];
    alimentosBase: AlimentoBase[];
}

export default function TableAlimentos({ alimentos, alimentosBase }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                <tr>
                    <th className="px-3 py-2">Alimento</th>
                    <th className="px-3 py-2 text-center">Cant.</th>
                    <th className="px-3 py-2 text-center">Prot</th>
                    <th className="px-3 py-2 text-center">Carb</th>
                    <th className="px-3 py-2 text-center">Gras</th>
                    <th className="px-3 py-2 text-center">Kcal</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {alimentos.map((item, index) => {
                    // Buscamos la info nutricional base usando el ID (refAlimento)
                    const base = alimentosBase.find(a => a.id === item.refAlimento);

                    if (!base) {
                        return (
                            <tr key={index} className="bg-red-50">
                                <td colSpan={6} className="px-3 py-2 text-red-500">
                                    Alimento no encontrado (ID: {item.refAlimento})
                                </td>
                            </tr>
                        );
                    }

                    // Calculamos los macros reales según la cantidad del plan
                    const cantidadNum = parseFloat(item.cantidad.toString());
                    const factor = cantidadNum / base.cantidadBase;

                    return (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium text-gray-800">
                                {base.nombre}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {cantidadNum} {base.unidad}
                            </td>
                            <td className="px-3 py-2 text-center text-blue-600">
                                {(base.proteina * factor).toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center text-orange-600">
                                {(base.carbohidratos * factor).toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center text-yellow-600">
                                {(base.grasas * factor).toFixed(1)}
                            </td>
                            <td className="px-3 py-2 text-center font-bold text-gray-800">
                                {Math.round(base.calorias * factor)}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}