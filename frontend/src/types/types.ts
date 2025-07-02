export interface User {
    id: number;
    name: string;
    slug: string;
    email: string;
    role: 'team_member' | 'manager';
    position: string;
    created_at: string;
    expectations?: UserExpectations;
}

export interface AuthUser extends User {
    token?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: 'manager' | 'team_member';
    requireSelfOrManager?: boolean;
}

export interface UserExpectations {
    actions: {
        technical_knowledge: string[];
        system_design: string[];
        problem_solving: string[];
        impact_scope: string[];
    };
    leadership: string[];
    competencies: {
        ownership: string[];
        quality: string[];
        honesty: string[];
        kindness: string[];
    };
    results: string[];
}

export interface Evaluation {
    id: number;
    user_id: number;
    evaluator_type: 'self' | 'manager';
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
    manager: Evaluation | null;
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