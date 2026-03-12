# Jak navázat v novém chatu

Soubory paměti jsou v repozitáři (AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md). Aby agent měl kontext, na **začátku nového chatu** napiš třeba:

- **„Pročti si AGENTS.md a docs/working-memory.md a shrň mi stav projektu.“**
- nebo: **„Načti AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md a docs/decisions.md a řekni, co je hotové a co doporučuješ jako další krok.“**

Agent pak načte paměť a může navázat. Po dokončení práce by měl sám aktualizovat docs/working-memory.md (a při arch. rozhodnutích docs/decisions.md).

## Uložení do repozitáře

Aby se nic neztratilo, **commitni a pushni** tyto soubory do GitHubu:

```bash
git add AGENTS.md .cursor/rules/project.mdc docs/
git status
git commit -m "Add agent memory: AGENTS.md, cursor rules, docs/working-memory, decisions"
git push
```

Od té chvíle jsou pravidla a paměť součástí repozitáře a platí pro každého (i pro tebe na jiném počítači nebo v novém chatu).
