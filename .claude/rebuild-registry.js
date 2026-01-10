#!/usr/bin/env node
/**
 * rebuild-registry.js v1.1.0
 * 
 * Scans skills from multiple locations and rebuilds:
 *   - skills.json       (full registry for tools/validation)
 *   - skills-index.json (compact index for LLMs)
 * 
 * Supports: .claude/skills/ and .github/skills/
 * Categories: auto-detected from folder structure
 * 
 * Usage: node rebuild-registry.js
 */

const fs = require('fs');
const path = require('path');

// Version
const REGISTRY_VERSION = '1.1.0';

// Find project root (go up from .claude/ to project root)
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.dirname(SCRIPT_DIR);

// Skills can exist in multiple locations
const SKILLS_LOCATIONS = [
    { base: path.join(PROJECT_ROOT, '.claude', 'skills'), prefix: '.claude' },
    { base: path.join(PROJECT_ROOT, '.github', 'skills'), prefix: '.github' }
];

// Output files (always in .claude/)
const REGISTRY_PATH = path.join(SCRIPT_DIR, 'skills.json');
const INDEX_PATH = path.join(SCRIPT_DIR, 'skills-index.json');

// Category sort order (categories not in list go at the end alphabetically)
const CATEGORY_PRIORITY = ['core', 'engineering', 'devops', 'documentation', 'research'];

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim();
            const value = line.slice(colonIdx + 1).trim();
            frontmatter[key] = value;
        }
    });
    return frontmatter;
}

function extractTriggers(content) {
    const whenToUse = content.match(/## When to Use[\s\S]*?(?=\n## |$)/);
    if (!whenToUse) return [];

    const triggers = [];
    const lines = whenToUse[0].split('\n');
    lines.forEach(line => {
        const match = line.match(/^[-*]\s+(.+)/);
        if (match) {
            const phrase = match[1]
                .toLowerCase()
                .replace(/when |use |for |to |you |need |want /gi, '')
                .replace(/[^\w\s-]/g, '')
                .trim()
                .slice(0, 50);
            if (phrase.length > 3 && phrase.length < 50) {
                triggers.push(phrase);
            }
        }
    });
    return [...new Set(triggers)].slice(0, 5);
}

function extractTags(description, id) {
    const stopWords = ['when', 'with', 'this', 'that', 'from', 'using', 'used', 'for', 'the', 'and', 'use'];
    const words = description
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.includes(w));

    const tags = [id, ...new Set(words)].slice(0, 6);
    return tags;
}

function toTitleCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Format index JSON with readable structure but compact skill entries
 * Each skill on one line, but overall structure is indented
 */
function formatIndexJson(index) {
    const lines = ['{'];
    lines.push(`  "v": "${index.v}",`);
    lines.push(`  "n": ${index.n},`);
    lines.push('  "skills": {');

    const categories = Object.keys(index.skills);
    categories.forEach((cat, catIdx) => {
        const isLastCat = catIdx === categories.length - 1;
        lines.push(`    "${cat}": [`);

        const skills = index.skills[cat];
        skills.forEach((skill, skillIdx) => {
            const isLastSkill = skillIdx === skills.length - 1;
            const skillJson = JSON.stringify(skill);
            lines.push(`      ${skillJson}${isLastSkill ? '' : ','}`);
        });

        lines.push(`    ]${isLastCat ? '' : ','}`);
    });

    lines.push('  }');
    lines.push('}');
    return lines.join('\n');
}

/**
 * Discover categories dynamically from a skills directory
 */
function discoverCategories(skillsBase) {
    if (!fs.existsSync(skillsBase)) return [];

    try {
        return fs.readdirSync(skillsBase, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);
    } catch {
        return [];
    }
}

/**
 * Scan a single skills location (.claude/skills or .github/skills)
 */
function scanLocation(location) {
    const skills = [];
    const errors = [];
    const { base, prefix } = location;

    if (!fs.existsSync(base)) {
        return { skills, errors, categories: [] };
    }

    const categories = discoverCategories(base);

    categories.forEach(category => {
        const categoryPath = path.join(base, category);

        let folders;
        try {
            folders = fs.readdirSync(categoryPath, { withFileTypes: true })
                .filter(d => d.isDirectory());
        } catch (err) {
            errors.push(`Cannot read ${categoryPath}: ${err.message}`);
            return;
        }

        folders.forEach(folder => {
            const skillPath = path.join(categoryPath, folder.name, 'SKILL.md');

            if (!fs.existsSync(skillPath)) {
                errors.push(`Missing SKILL.md: ${prefix}/${category}/${folder.name}`);
                return;
            }

            try {
                const content = fs.readFileSync(skillPath, 'utf-8');
                const frontmatter = parseFrontmatter(content);

                if (!frontmatter) {
                    errors.push(`No frontmatter: ${folder.name}`);
                    return;
                }

                if (!frontmatter.name) {
                    errors.push(`Missing 'name': ${folder.name}`);
                    return;
                }

                if (!frontmatter.description) {
                    errors.push(`Missing 'description': ${folder.name}`);
                    return;
                }

                if (frontmatter.name !== folder.name) {
                    errors.push(`Name mismatch: ${frontmatter.name} ≠ ${folder.name}`);
                }

                const skill = {
                    id: frontmatter.name,
                    name: toTitleCase(frontmatter.name),
                    description: frontmatter.description.slice(0, 300),
                    category: category,
                    tags: extractTags(frontmatter.description, frontmatter.name),
                    triggers: extractTriggers(content),
                    path: `${prefix}/skills/${category}/${folder.name}/SKILL.md`,
                    dependencies: []
                };

                skills.push(skill);
                console.log(`  ✓ ${skill.id} (${prefix})`);

            } catch (err) {
                errors.push(`Error parsing ${folder.name}: ${err.message}`);
            }
        });
    });

    return { skills, errors, categories };
}

function scanAllSkills() {
    const allSkills = [];
    const allErrors = [];
    const allCategories = new Set();
    const scannedLocations = [];

    SKILLS_LOCATIONS.forEach(location => {
        if (fs.existsSync(location.base)) {
            scannedLocations.push(location.prefix);
            const { skills, errors, categories } = scanLocation(location);
            allSkills.push(...skills);
            allErrors.push(...errors);
            categories.forEach(c => allCategories.add(c));
        }
    });

    // Deduplicate by id (first found wins)
    const seen = new Set();
    const uniqueSkills = allSkills.filter(skill => {
        if (seen.has(skill.id)) {
            allErrors.push(`Duplicate skill ignored: ${skill.id}`);
            return false;
        }
        seen.add(skill.id);
        return true;
    });

    return {
        skills: uniqueSkills,
        errors: allErrors,
        categories: [...allCategories],
        locations: scannedLocations
    };
}

function main() {
    console.log('╔════════════════════════════════════╗');
    console.log(`║   Skills Registry Rebuild v${REGISTRY_VERSION}   ║`);
    console.log('╚════════════════════════════════════╝\n');

    // Check at least one skills location exists
    const existingLocations = SKILLS_LOCATIONS.filter(loc => fs.existsSync(loc.base));
    if (existingLocations.length === 0) {
        console.error('❌ No skills directories found.');
        console.error('   Looked in:');
        SKILLS_LOCATIONS.forEach(loc => console.error(`     - ${loc.base}`));
        process.exit(1);
    }

    console.log('Scanning locations:');
    existingLocations.forEach(loc => console.log(`  📁 ${loc.prefix}/skills/`));
    console.log('');

    const { skills, errors, categories, locations } = scanAllSkills();

    // Sort skills: by category priority, then alphabetically by id
    const sortedSkills = skills.sort((a, b) => {
        const aPriority = CATEGORY_PRIORITY.indexOf(a.category);
        const bPriority = CATEGORY_PRIORITY.indexOf(b.category);
        const aOrder = aPriority === -1 ? 999 : aPriority;
        const bOrder = bPriority === -1 ? 999 : bPriority;

        if (aOrder !== bOrder) return aOrder - bOrder;
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.id.localeCompare(b.id);
    });

    const timestamp = new Date().toISOString();

    // ═══════════════════════════════════════════════════════════
    // 1. FULL REGISTRY (skills.json) - for tools and validation
    // ═══════════════════════════════════════════════════════════
    const registry = {
        version: REGISTRY_VERSION,
        updated_at: timestamp,
        locations: locations,
        skills: sortedSkills
    };
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');

    // ═══════════════════════════════════════════════════════════
    // 2. COMPACT INDEX (skills-index.json) - optimized for LLMs
    // ═══════════════════════════════════════════════════════════
    // Group by category for easier scanning
    const byCategory = {};
    sortedSkills.forEach(s => {
        if (!byCategory[s.category]) byCategory[s.category] = [];
        // Compact format: only essential fields
        byCategory[s.category].push({
            id: s.id,
            desc: s.description.slice(0, 120), // Truncate for LLM efficiency
            path: s.path
        });
    });

    const index = {
        v: REGISTRY_VERSION,
        n: sortedSkills.length,
        skills: byCategory
    };

    // Custom formatting: structure readable, but each skill on one line
    const indexJson = formatIndexJson(index);
    fs.writeFileSync(INDEX_PATH, indexJson + '\n');

    // ═══════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════
    const fullSize = fs.statSync(REGISTRY_PATH).size;
    const indexSize = fs.statSync(INDEX_PATH).size;

    console.log('\n────────────────────────────────────');
    console.log(`✅ Registry updated: ${skills.length} skills`);
    console.log('');
    console.log('📄 Generated files:');
    console.log(`   skills.json       ${(fullSize / 1024).toFixed(1)}KB (full)`);
    console.log(`   skills-index.json ${(indexSize / 1024).toFixed(1)}KB (LLM-optimized)`);

    // Category breakdown
    console.log('\n📊 By category:');
    const categoryCounts = {};
    skills.forEach(s => {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });
    Object.keys(categoryCounts).sort().forEach(cat => {
        console.log(`   ${cat}: ${categoryCounts[cat]}`);
    });

    // Errors
    if (errors.length > 0) {
        console.log(`\n⚠️  Warnings (${errors.length}):`);
        errors.forEach(e => console.log(`   - ${e}`));
    }

    console.log('\n────────────────────────────────────');
}

main();
