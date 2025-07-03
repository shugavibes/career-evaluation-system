# 🔐 Atlas Career Evaluation System - Team Credentials

## 📋 Managers

| Name | Email | Password | Role |
|------|-------|----------|------|
| **Fede Cano** | `fedecano@heyatlas.com` | `Atlas2024@FC` | Tech Lead |
| **Alton Bell** | `alton@heyatlas.com` | `Atlas2024@AB` | Tech Lead |
| **Nicolas Alvarez** | `shuga@heyatlas.com` | `Atlas2024@NA` | Engineering Manager |

## 👥 Team Members

| Name | Email | Password | Role |
|------|-------|----------|------|
| **Leo Paini** | `leo@heyatlas.com` | `Atlas2024@LP` | Senior Engineer |
| **Javi Mermet** | `javier@heyatlas.com` | `Atlas2024@JM` | Senior Engineer |
| **Santi Musso** | `santi@heyatlas.com` | `Atlas2024@SM` | Junior Engineer |
| **Fede Miranda** | `fede@heyatlas.com` | `Atlas2024@FM` | Semi-Senior Engineer |
| **Jose Biskis** | `josebiskis@heyatlas.com` | `Atlas2024@JB` | Senior Engineer |
| **Ale Schon** | `alejo@heyatlas.com` | `Atlas2024@AS` | Senior Engineer |

## 🌍 Environment Access

### **Local Development:**
- **URL**: http://localhost:3000
- **Database**: SQLite (career-evaluation.db)

### **Production:**
- **URL**: https://career-evaluation-system-3z1ye65pq-shugavibes-projects.vercel.app
- **Database**: Supabase (PostgreSQL)

## 🚀 Getting Started

1. **Development Setup:**
   ```bash
   npm run dev-sqlite
   ```

2. **Access the Application:**
   - Visit http://localhost:3000/login
   - Use any of the credentials above

3. **Manager Features:**
   - View all team members
   - Create and manage evaluations
   - Set expectations for team members
   - Compare evaluation results

4. **Team Member Features:**
   - Self-evaluation
   - View personal evaluation history
   - Compare with expectations

## 🔒 Security Notes

- **Passwords are unique** for each team member
- **Format**: `Atlas2024@XX` (where XX are initials)
- **Production uses Supabase** (PostgreSQL database)
- **Development uses SQLite** (local database)

---

**Last Updated**: $(date +"%B %d, %Y")
**System Version**: 1.0
**Contact**: System Administrator for any issues 