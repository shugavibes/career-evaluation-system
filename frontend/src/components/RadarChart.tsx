import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { RadarChartData } from '../types/types';
import { criteriaLabels } from '../data/evaluationCriteria';

interface RadarChartProps {
    data: RadarChartData[];
    title?: string;
    showLegend?: boolean;
}

const formatLabel = (key: string): string => {
    return criteriaLabels[key as keyof typeof criteriaLabels] || key;
};

const RadarChart: React.FC<RadarChartProps> = ({ data, title = "Evaluation Results", showLegend = true }) => {
    // Transform data for the chart
    const chartData = Object.keys(criteriaLabels).map(key => {
        const item: any = { criterion: formatLabel(key) };
        data.forEach((dataset, index) => {
            item[dataset.name] = dataset[key as keyof RadarChartData];
        });
        return item;
    });

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsRadarChart data={chartData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                        <PolarGrid 
                            gridType="polygon" 
                            stroke="#e5e7eb" 
                            strokeWidth={1}
                        />
                        <PolarAngleAxis 
                            dataKey="criterion" 
                            tick={{ fontSize: 12, fontWeight: 500, fill: '#374151' }}
                            tickFormatter={(value) => {
                                // Split long labels into multiple lines
                                if (value.length > 15) {
                                    const words = value.split(' ');
                                    const mid = Math.ceil(words.length / 2);
                                    return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ');
                                }
                                return value;
                            }}
                        />
                        <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 5]} 
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            tickCount={6}
                        />
                        {data.map((dataset, index) => (
                            <Radar
                                key={dataset.name}
                                name={dataset.name}
                                dataKey={dataset.name}
                                stroke={index === 0 ? '#9333ea' : '#3b82f6'}
                                fill={index === 0 ? '#9333ea' : '#3b82f6'}
                                fillOpacity={0.3}
                                strokeWidth={2}
                                dot={{ fill: index === 0 ? '#9333ea' : '#3b82f6', strokeWidth: 2, r: 4 }}
                            />
                        ))}
                        {showLegend && (
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />
                        )}
                    </RechartsRadarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
                <p>Scale: 0 (Beginner) to 5 (Expert)</p>
            </div>
        </div>
    );
};

export default RadarChart; 