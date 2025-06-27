export interface User {
    id: number;
    name: string;
    slug: string;
    role: string;
    created_at: string;
}

export interface Evaluation {
    id: number;
    user_id: number;
    evaluator_type: 'self' | 'leader';
    technical_knowledge: number;
    system_design: number;
    problem_solving: number;
    code_quality: number;
    collaboration: number;
    technical_leadership: number;
    impact_scope: number;
    created_at: string;
    updated_at: string;
    name?: string;
    slug?: string;
    role?: string;
}

export interface CriterionLevel {
    level: number;
    title: string;
    bullets: string[];
}

export interface EvaluationCriterion {
    id: string;
    name: string;
    description: string;
    levels: CriterionLevel[];
}

export interface EvaluationData {
    technical_knowledge: number;
    system_design: number;
    problem_solving: number;
    code_quality: number;
    collaboration: number;
    technical_leadership: number;
    impact_scope: number;
}

export interface ComparisonData {
    self: Evaluation | null;
    leader: Evaluation | null;
}

export interface RadarChartData {
    name: string;
    technical_knowledge: number;
    system_design: number;
    problem_solving: number;
    code_quality: number;
    collaboration: number;
    technical_leadership: number;
    impact_scope: number;
}

export interface ToastProps {
    type: 'success' | 'error' | 'info';
    message: string;
    isVisible: boolean;
    onClose: () => void;
} 