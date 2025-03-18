import { getDatasets } from '@/lib/state/main/slice';
import { RootState } from '@/lib/state/store';
import React from 'react';
import { useSelector } from 'react-redux';

const Table: React.FC = () => {
    const { selectedData } = useSelector((state: RootState) => state.main);

    const datasets = useSelector(getDatasets);

    // TODO: ensure property order and call getHeaderValue
    return (
        <div className="h-[100svh] overflow-x-auto f-full bg-white">
            <table className="min-w-full bg-white border border-gray-200 text-black text-sm">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Site Name</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">
                            Variable Measured
                        </th>
                        <th className="py-2 px-4 border-b">Variable Unit</th>
                        <th className="py-2 px-4 border-b">
                            Measurement Technique
                        </th>
                        <th className="py-2 px-4 border-b">
                            Temporal Coverage
                        </th>
                        <th className="py-2 px-4 border-b">
                            Monitoring Location
                        </th>
                        <th className="py-2 px-4 border-b">
                            Dataset Description
                        </th>
                        <th className="py-2 px-4 border-b">
                            Distribution Format
                        </th>
                        <th className="py-2 px-4 border-b">
                            Distribution Name
                        </th>
                        <th className="py-2 px-4 border-b">Distribution URL</th>
                        <th className="py-2 px-4 border-b">URL</th>
                    </tr>
                </thead>
                <tbody>
                    {datasets.features.map((feature, index) => (
                        <tr
                            key={index}
                            className={`${
                                selectedData?.variableMeasured ===
                                    feature.properties.variableMeasured &&
                                selectedData?.distributionName ===
                                    feature.properties.distributionName &&
                                'bg-blue-100'
                            }`}
                        >
                            <td className="py-2 px-4 border-b">
                                {feature.properties.siteName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.type}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.variableMeasured}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.variableUnit}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.measurementTechnique}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.temporalCoverage}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <a
                                    href={feature.properties.monitoringLocation}
                                    className="text-blue-500 hover:underline"
                                >
                                    Link
                                </a>
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.datasetDescription}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.distributionFormat}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {feature.properties.distributionName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <a
                                    href={feature.properties.distributionURL}
                                    className="text-blue-500 hover:underline"
                                >
                                    Link
                                </a>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <a
                                    href={feature.properties.url}
                                    className="text-blue-500 hover:underline"
                                >
                                    Link
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
