const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
const db = {
    // Test connection
    async testConnection() {
        try {
            const { data, error } = await supabase.from('users').select('count').limit(1);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase connection test failed:', error.message);
            throw error;
        }
    },

    // User operations
    async getUserBySlug(slug) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            throw error;
        }
        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        return data;
    },

    async getAllUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, slug, email, role, position, created_at')
            .eq('role', 'team_member')
            .order('position, name');
        
        if (error) throw error;
        return data;
    },

    async createUser(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // Evaluation operations
    async getLatestEvaluations(userId) {
        const { data, error } = await supabase
            .from('evaluations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Group by evaluator_type and return latest of each
        const latestSelf = data.find(e => e.evaluator_type === 'self');
        const latestManager = data.find(e => e.evaluator_type === 'manager');
        
        return {
            self: latestSelf || null,
            manager: latestManager || null
        };
    },

    async saveEvaluation(evaluation) {
        const { data, error } = await supabase
            .from('evaluations')
            .insert([{
                ...evaluation,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async getAllEvaluations(userId) {
        const { data, error } = await supabase
            .from('evaluations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Expectations operations
    async getUserExpectations(userId) {
        const { data, error } = await supabase
            .from('user_expectations')
            .select('expectations')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        return data ? data.expectations : null;
    },

    async updateUserExpectations(userId, expectations, updatedBy) {
        const { data, error } = await supabase
            .from('user_expectations')
            .upsert({
                user_id: userId,
                expectations: expectations,
                updated_by: updatedBy,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // Session operations for local auth (Supabase has built-in auth but keeping for compatibility)
    async cleanExpiredSessions() {
        const { error } = await supabase
            .from('sessions')
            .delete()
            .lt('expires_at', new Date().toISOString());
        
        if (error) throw error;
    },

    // Generic query methods
    async query(sql, params = []) {
        // Note: Supabase doesn't support raw SQL queries directly
        // This is a placeholder for compatibility
        throw new Error('Raw SQL queries not supported with Supabase. Use specific methods instead.');
    },

    async all(table, conditions = {}) {
        let query = supabase.from(table).select('*');
        
        Object.entries(conditions).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async run(table, operation, data) {
        let result;
        switch (operation) {
            case 'insert':
                result = await supabase.from(table).insert([data]).select().single();
                break;
            case 'update':
                result = await supabase.from(table).update(data).select().single();
                break;
            case 'delete':
                result = await supabase.from(table).delete().eq('id', data.id);
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
        
        if (result.error) throw result.error;
        return result.data;
    }
};

module.exports = { supabase, db }; 