import React from 'react';
import RadarChart from './RadarChart';
import { ComparisonData, RadarChartData } from '../types/types';
import { criteriaLabels } from '../data/evaluationCriteria';

interface ComparisonViewProps {
    data: ComparisonData;
    userName: string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ data, userName }) => {
    const { self, leader } = data;

    // Prepare radar chart data
    const radarData: RadarChartData[] = [];
    
    if (self) {
        radarData.push({
            name: 'Self-Evaluation',
            technical_knowledge: self.technical_knowledge,
            system_design: self.system_design,
            problem_solving: self.problem_solving,
            code_quality: self.code_quality,
            collaboration: self.collaboration,
            technical_leadership: self.technical_leadership,
            impact_scope: self.impact_scope,
        });
    }

    if (leader) {
        radarData.push({
            name: 'Leader Evaluation',
            technical_knowledge: leader.technical_knowledge,
            system_design: leader.system_design,
            problem_solving: leader.problem_solving,
            code_quality: leader.code_quality,
            collaboration: leader.collaboration,
            technical_leadership: leader.technical_leadership,
            impact_scope: leader.impact_scope,
        });
    }

    // Calculate averages
    const calculateAverage = (evaluation: any) => {
        const values = [
            evaluation.technical_knowledge,
            evaluation.system_design,
            evaluation.problem_solving,
            evaluation.code_quality,
            evaluation.collaboration,
            evaluation.technical_leadership,
            evaluation.impact_scope,
        ].filter(v => v !== null && v !== undefined);
        
        return values.length > 0 ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1) : 'N/A';
    };

    const selfAverage = self ? calculateAverage(self) : 'N/A';
    const leaderAverage = leader ? calculateAverage(leader) : 'N/A';

    // Prepare comparison data
    const comparisonRows = Object.entries(criteriaLabels).map(([key, label]) => {
        const selfValue = self?.[key as keyof typeof criteriaLabels] || 0;
        const leaderValue = leader?.[key as keyof typeof criteriaLabels] || 0;
        const gap = Math.abs(selfValue - leaderValue);
        const hasSignificantGap = gap > 1;

        return {
            criterion: label,
            self: selfValue,
            leader: leaderValue,
            gap,
            hasSignificantGap,
        };
    });

    const exportData = () => {
        // Simple CSV export
        const csvData = [
            ['Criterion', 'Self-Evaluation', 'Leader Evaluation', 'Gap'],
            ...comparisonRows.map(row => [row.criterion, row.self, row.leader, row.gap])
        ];
        
        const csvString = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userName.replace(/\s+/g, '_')}_evaluation_comparison.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!self && !leader) {
        return (
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Evaluations Found</h2>
                    <p className="text-gray-600">Complete at least one evaluation to see the comparison.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{userName} - Evaluation Comparison</h1>
                        <p className="text-gray-600 mt-2">
                            Compare self-evaluation with leader evaluation results
                        </p>
                    </div>
                    <button
                        onClick={exportData}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <RadarChart
                        data={radarData}
                        title="Evaluation Comparison"
                        showLegend={radarData.length > 1}
                    />
                    
                    {/* Summary Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{selfAverage}</div>
                            <div className="text-sm text-gray-600">Self Average</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{leaderAverage}</div>
                            <div className="text-sm text-gray-600">Leader Average</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Comparison Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 font-semibold text-gray-900">Criterion</th>
                                    <th className="text-center py-3 font-semibold text-purple-600">Self</th>
                                    <th className="text-center py-3 font-semibold text-blue-600">Leader</th>
                                    <th className="text-center py-3 font-semibold text-gray-600">Gap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, index) => (
                                    <tr 
                                        key={index}
                                        className={`border-b transition-colors ${
                                            row.hasSignificantGap 
                                                ? 'bg-red-50 hover:bg-red-100' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <td className="py-3 font-medium text-gray-900">
                                            {row.criterion}
                                            {row.hasSignificantGap && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                    Significant Gap
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">
                                                {row.self}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                                                {row.leader}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                                                row.hasSignificantGap 
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {row.gap.toFixed(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Gap Analysis Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Gap Analysis</h4>
                        <div className="text-sm text-gray-600">
                            {comparisonRows.filter(row => row.hasSignificantGap).length > 0 ? (
                                <>
                                    <p className="mb-2">
                                        <strong>{comparisonRows.filter(row => row.hasSignificantGap).length}</strong> criteria 
                                        have significant gaps ({'>'}1 point difference):
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {comparisonRows
                                            .filter(row => row.hasSignificantGap)
                                            .map((row, index) => (
                                                <li key={index}>
                                                    <strong>{row.criterion}</strong>: {row.gap.toFixed(1)} point difference
                                                </li>
                                            ))}
                                    </ul>
                                </>
                            ) : (
                                <p>No significant gaps found. Evaluations are well-aligned!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonView; 