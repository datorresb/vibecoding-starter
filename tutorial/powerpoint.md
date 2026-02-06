# Generate PowerPoint Presentations with Agent Skills

**Skills** are folders of instructions that teach AI agents how to perform specialized tasks. Anthropic publishes ready-to-use skills at [github.com/anthropics/skills](https://github.com/anthropics/skills).

## 1. Copy the PPTX skill

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/skills.git /tmp/skills
cd /tmp/skills && git sparse-checkout set skills/pptx
cp -r skills/pptx .claude/skills/engineering/
```


## Ask the agent to create a presentation

> "Create a short slide deck about spec-driven development from https://github.com/github/spec-kit/blob/main/spec-driven.md"

## Links

- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills) · [Create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills) · [Agent Skills spec](https://agentskills.io)
- [anthropics/skills repo](https://github.com/anthropics/skills) · [PPTX skill](https://github.com/anthropics/skills/tree/main/skills/pptx) · [PptxGenJS](https://github.com/gitbrent/PptxGenJS)
