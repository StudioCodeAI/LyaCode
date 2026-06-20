# NEXT_STEPS.md — Plano de execução para Claude Code

**Contexto:** Lya Cloud v1.0.0 publicado mas com 2 problemas pendentes:
1. ❌ Lista do `/provider` não mudou (eu editei o arquivo errado — `provider.tsx` é legacy, a tela real usa `ProviderManager.tsx` + `integrationArtifacts.generated.ts`)
2. ⚠️ Letras blocky mas com pequenos bugs de alinhamento (algumas linhas têm 11 chars em vez de 10)

Também:
3. 🌐 Estratégia de repo público (só instaladores + docs) + repo privado (código-fonte)

**Modo:** Lean execution (modo eco). Roadmap vivo. Cada bloco valida antes de seguir.

---

## 🗺️ Roadmap

| # | Tarefa | Status |
|---|--------|--------|
| 1 | Corrigir lista de providers (arquivo gerado correto) | ⏳ |
| 2 | Corrigir bugs de bitmap das letras (`a` minúsculo) | ⏳ |
| 3 | Rebuild + smoke test local | ⏳ |
| 4 | Criar repo público `lyacloud-installers` | ⏳ |
| 5 | Workflow que publica artefatos no repo público | ⏳ |
| 6 | Tag v1.0.1 + push | ⏳ |
| 7 | Validar instalação pública | ⏳ |

---

## 1️⃣ Corrigir lista de providers

**Arquivo correto:** `src/integrations/generated/integrationArtifacts.generated.ts`

⚠️ Esse arquivo é **gerado** por `scripts/generate-integrations-artifacts.ts`, mas a regra de ordem (`ORDERED_PROVIDER_PRESETS`) é editável direto — quando rodar `bun run integrations:generate` a ordem pode mudar de novo. Por isso o fix correto é:

**Opção A (rápida):** editar o array direto no arquivo gerado.
**Opção B (definitiva):** descobrir como o gerador ordena (provavelmente alfabético ou ordem de import) e ajustar o script ou um descritor.

Para AGORA, fazer Opção A.

### Edição exata

Em `src/integrations/generated/integrationArtifacts.generated.ts`, **última seção do arquivo**, substituir o array:

```ts
export const ORDERED_PROVIDER_PRESETS = [
  "gitlawb-opengateway",
  "anthropic",
  // ... resto
] as const
```

Pelo novo array (Ollama Local 1º, Anthropic/Claude 2º, Gitlawb Opengateway último):

```ts
export const ORDERED_PROVIDER_PRESETS = [
  "ollama",
  "anthropic",
  "dashscope-cn",
  "dashscope-intl",
  "atlas-cloud",
  "azure-openai",
  "bankr",
  "deepseek",
  "fireworks",
  "gemini",
  "groq",
  "hicap",
  "lmstudio",
  "atomic-chat",
  "minimax",
  "mistral",
  "moonshotai",
  "kimi-code",
  "nearai",
  "nvidia-nim",
  "openai",
  "opencode-go",
  "opencode",
  "openrouter",
  "together",
  "venice",
  "xai",
  "xiaomi-mimo",
  "zai",
  "custom",
  "gitlawb-opengateway"
] as const
```

**Resumo da mudança:** mover `"ollama"` pro topo, mover `"gitlawb-opengateway"` pro fim. Resto idêntico.

### Investigação pra fix definitivo (Opção B)

Depois de validar Opção A funcionando, investigar:

```bash
# Olhar como o gerador ordena
cat scripts/generate-integrations-artifacts.ts | grep -i "ORDERED\|sort\|order"

# Procurar se tem campo "order" nos descritores
grep -rn "order:" src/integrations/gateways/
grep -rn "order:" src/integrations/vendors/
```

Se o gerador ordena por field `order` nos descritores: adicionar `order: 1` em ollama, `order: 999` em gitlawb-opengateway.
Se ordena por nome de arquivo: renomear preview com prefixo numérico.
Se é hardcoded no script: editar lá.

---

## 2️⃣ Corrigir bugs de bitmap (`a` minúsculo)

**Arquivo:** `src/components/StartupScreen.ts`

**Problema:** 3 linhas do bitmap `a` têm 11 caracteres, as outras têm 10. Causa desalinhamento sutil:

```ts
a: [
  '  ######  ',     // 10 ✓
  '  ######  ',     // 10 ✓
  ' ##    ## ',     // 10 ✓
  ' ##    ## ',     // 10 ✓
  ' ##    ## ',     // 10 ✓
  ' ########  ',    // 11 ❌
  ' ########  ',    // 11 ❌
  ' ##    ## ',     // 10 ✓
  ' ##    ## ',     // 10 ✓
  ' ####### ##'     // 11 ❌
],
```

**Substituir por** (todas com 10 chars):

```ts
a: [
  '  ######  ',
  '  ######  ',
  ' ##    ## ',
  ' ##    ## ',
  ' ##    ## ',
  ' ######## ',
  ' ######## ',
  ' ##    ## ',
  ' ##    ## ',
  ' ######## '
],
```

Mudanças: removeu 1 espaço das linhas 6 e 7; trocou a linha 10 pelo padrão simétrico.

**Bug similar no `D` maiúsculo** (não usado em "Lya Cloud" mas latente):

```ts
// ANTES (mistura 9 e 10 chars):
D: ['######## ', '######## ', '##     ##', '##      ##', '##      ##', '##      ##', '##      ##', '##     ##', '######## ', '######## '],

// DEPOIS (todas 10):
D: ['######### ', '######### ', '##      ##', '##      ##', '##      ##', '##      ##', '##      ##', '##      ##', '######### ', '######### '],
```

---

## 3️⃣ Rebuild + smoke local

```powershell
cd E:\GitHub\lyacloud-main

# Limpar restos
Remove-Item -Force "studiocodeai-lyacloud-*.tgz" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist/installer/lyacloud-portable-0.1.0" -ErrorAction SilentlyContinue

# Rebuild
bun run build
bun run smoke

# Testar visualmente
node bin/lyacloud
# Verificar:
#   - Letras "Lya Cloud" estão limpas (sem desalinhamento no 'a')
#   - /provider abre com Ollama 1º, Gitlawb Opengateway último
#   - lyacloud v1.0.0 no rodapé
```

Se algo ficar ruim, voltar pra editar antes de seguir.

---

## 4️⃣ Criar repo público `lyacloud-installers`

**Objetivo:** repo público com SÓ instaladores + docs. Código-fonte fica no privado.

### Passo 4.1 — Criar repo no GitHub

Abrir: https://github.com/organizations/StudioCodeAI/repositories/new (ou no perfil pessoal se preferir)

- **Nome:** `lyacloud-installers`
- **Visibilidade:** Public
- **Descrição:** "Lya Cloud — installers, releases, and public documentation. Source code lives at the private StudioCodeAI/lyacloud repo."
- **NÃO inicialize** com README/gitignore/license (o script faz isso)

### Passo 4.2 — Criar conteúdo do repo público

Vou criar pasta `public-repo-template/` aqui mesmo no repo privado com o conteúdo inicial:

```powershell
mkdir public-repo-template
cd public-repo-template
git init
```

Conteúdo a criar (Claude Code escreve):

**`README.md`** (do repo público):

```markdown
# Lya Cloud — Installers & Releases

CLI agentic terminal by **Studio CodeAI**.

> Este repositório contém apenas **instaladores, documentação de uso e changelog**. 
> O código-fonte vive no repositório privado da Studio CodeAI.

## ⚡ Instalação rápida

### Multi-plataforma via npm

\`\`\`bash
npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/latest/download/studiocodeai-lyacloud-1.0.0.tgz
\`\`\`

### Windows (portable .zip)

\`\`\`powershell
irm https://github.com/StudioCodeAI/lyacloud-installers/releases/latest/download/lyacloud-portable-1.0.0.zip -OutFile lyacloud-portable.zip
Expand-Archive lyacloud-portable.zip -DestinationPath .\lyacloud-portable -Force
cd lyacloud-portable
.\install.cmd
\`\`\`

### Validar

\`\`\`bash
lya --version
# 1.0.0 (Lya Cloud)
\`\`\`

## 🚀 Primeiros passos

\`\`\`bash
lya              # inicia CLI
> /provider      # configura provedor
> /lya           # ativa persona Lya
> /help          # ver todos comandos
\`\`\`

## 🧠 Sobre a Lya

Lya é a engenheira sênior + CEO de projeto da família Studio CodeAI. Arquitetada para combinar **Claude Opus** (decisão) e **Sonnet 4.8** (execução). 

7 sub-agentes especializados: architect, explorer, reviewer, tester, recorder, memory, provider.

## 📦 Releases

Veja todas as versões em [Releases](https://github.com/StudioCodeAI/lyacloud-installers/releases).

## 📜 Changelog

Veja [CHANGELOG.md](./CHANGELOG.md).

## ⚖️ Licença

Veja [LICENSE](./LICENSE).

## 🙌 Créditos

**Luis Cardozo** · `studiocoder.ai@gmail.com` · Studio CodeAI  
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)
```

**`CHANGELOG.md`**:

```markdown
# Changelog

## v1.0.0 — 2026-06-20 (produção estável)

🎉 **Primeira release de produção da Lya Cloud.**

### Adicionado
- Wordmark blocky 10-linhas "Lya Cloud" com gradiente Studio CodeAI no startup
- Persona Lya completa: 7 sub-agentes (architect, explorer, reviewer, tester, recorder, memory, provider)
- Comando \`/lya\` que invoca o system prompt sênior
- Configuração de provedores via \`/provider\`: Ollama Local, Anthropic, Gemini, Mistral, OpenAI-compatible, Codex, e ~30 outros
- Instaladores Windows: \`.exe\`, \`.zip\` portable e \`.tgz\` npm
- 5 aliases do binário: lyacloud, lscloud, lya, lyacode, lscode
- Extensão VS Code em \`vscode-extension/lyacloud-vscode\`

### Política de versionamento
- \`v0.x.y\` = teste (zero na frente)
- \`v1.0.0+\` = produção estável
```

**`LICENSE`** — copiar do repo privado (mesma licença).

### Passo 4.3 — Push inicial

```powershell
cd public-repo-template
git add -A
git commit -m "initial: Lya Cloud installers repo"
git branch -M main
git remote add origin https://github.com/StudioCodeAI/lyacloud-installers.git
git push -u origin main
```

---

## 5️⃣ Workflow que publica no repo público

**Arquivo:** `.github/workflows/release.yml` (no repo privado)

Atualizar pra usar PAT (Personal Access Token) e publicar release no repo público.

### Passo 5.1 — Criar PAT

1. Abrir https://github.com/settings/personal-access-tokens/new
2. Token name: `lyacloud-release-publish`
3. Expiration: 1 ano
4. Repository access: **Only select repositories** → `lyacloud-installers`
5. Permissions:
   - **Contents:** Read and write
   - **Actions:** Read
6. Generate → copiar o token (`github_pat_xxxxxxxxxx`)

### Passo 5.2 — Adicionar PAT como secret no repo PRIVADO

1. Abrir https://github.com/StudioCodeAI/lyacloud/settings/secrets/actions
2. New repository secret
3. Name: `INSTALLERS_REPO_TOKEN`
4. Value: cole o PAT

### Passo 5.3 — Atualizar workflow

Substituir o passo "Create GitHub Release" no `.github/workflows/release.yml` por:

```yaml
      - name: Create GitHub Release in public installers repo
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/')
        with:
          name: Lya Cloud v${{ steps.version.outputs.version }}
          tag_name: ${{ github.ref_name }}
          repository: StudioCodeAI/lyacloud-installers
          token: ${{ secrets.INSTALLERS_REPO_TOKEN }}
          generate_release_notes: false
          fail_on_unmatched_files: false
          files: |
            dist/installer/lyacloud-setup-x64-*.exe
            dist/installer/lyacloud-portable-*.zip
            studiocodeai-lyacloud-*.tgz
          body: |
            ## Lya Cloud v${{ steps.version.outputs.version }}

            Terminal agêntico do Studio CodeAI para workflows de código local e em nuvem.

            ### Instalação multi-plataforma (recomendado)

            ```bash
            npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v${{ steps.version.outputs.version }}/studiocodeai-lyacloud-${{ steps.version.outputs.version }}.tgz
            ```

            ### Windows (portable .zip)

            ```powershell
            irm https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v${{ steps.version.outputs.version }}/lyacloud-portable-${{ steps.version.outputs.version }}.zip -OutFile lyacloud-portable.zip
            Expand-Archive lyacloud-portable.zip -DestinationPath .\lyacloud-portable -Force
            cd lyacloud-portable
            .\install.cmd
            ```

            ### Uso

            ```bash
            lya              # CLI principal
            /provider        # configurar provedor
            /lya             # invocar agente Lya
            ```

            ---
            Studio CodeAI · Luis Cardozo · studiocoder.ai@gmail.com
```

Diferença vs versão atual: `repository:` aponta pra `lyacloud-installers`, e `token:` usa o PAT.

---

## 6️⃣ Tag v1.0.1 + push

Após corrigir 1, 2 e 5:

```powershell
cd E:\GitHub\lyacloud-main

# Bump versão pra 1.0.1 (patch release)
# Editar package.json: "version": "1.0.1"
# Editar .release-please-manifest.json: ".": "1.0.1"
# Editar scripts/installer/build-windows.ts: const VERSION = '1.0.1'
# Editar scripts/installer/windows/install.ps1: $ProductVersion = '1.0.1'
# Editar scripts/installer/windows/install.cmd: v1.0.1, studiocodeai-lyacloud-1.0.1.tgz
# Editar scripts/installer/windows/lyacloud-setup-x64.sed: studiocodeai-lyacloud-1.0.1.tgz
# Editar README.md: substituir todos 1.0.0 → 1.0.1

# Rebuild
bun run build
bun run build:installer:windows

# Commit + tag
git add -A
git commit -m "release: v1.0.1 - fix provider list + bitmaps + public installers repo

- Provider list: Ollama Local 1o, Gitlawb Opengateway ultimo
- Fix bitmap 'a' minusculo (3 linhas com 11 chars -> 10 chars)
- Fix bitmap 'D' maiusculo (mistura 9/10 chars -> 10 chars)
- Workflow publica artefatos no repo publico lyacloud-installers
- README atualizado para v1.0.1

Refs: Studio CodeAI · Luis Cardozo"

git tag -a v1.0.1 -m "Lya Cloud v1.0.1 - provider order + bitmap fixes"
git push origin main
git push origin v1.0.1
```

---

## 7️⃣ Validar instalação pública

Aguardar ~5-10 min após o push da tag. Acompanhar build em:
- https://github.com/StudioCodeAI/lyacloud/actions

Quando ✅, validar:

```powershell
# Verificar que o release apareceu no repo público
Invoke-RestMethod https://api.github.com/repos/StudioCodeAI/lyacloud-installers/releases/latest

# Desinstalar versão atual
npm uninstall -g @studiocodeai/lyacloud

# Instalar do release público
npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.1/studiocodeai-lyacloud-1.0.1.tgz

# Validar
lya --version    # 1.0.1 (Lya Cloud)
lya              # ver letras + /provider
```

---

## 🚨 Risco / Edge cases

| Risco | Mitigação |
|-------|-----------|
| Gerador `integrations:generate` desfaz o ORDERED_PROVIDER_PRESETS | Investigar Opção B no item 1 antes de v1.0.2 |
| PAT expira em 1 ano | Anotar no calendário; regenerar pra v1.1.0 |
| Repo público mostra "0 releases" inicial | Normal — só aparece após o primeiro `git push --tags` |
| iexpress falha de novo no workflow | OK — `.zip` + `.tgz` já são suficientes |

---

## ✅ Critérios de "feito"

- [ ] `/provider` mostra "Ollama" na posição 1 e "Gitlawb Opengateway" na última
- [ ] Letras "Lya Cloud" renderizam sem desalinhamento no `a`
- [ ] Repo `StudioCodeAI/lyacloud-installers` existe e é público
- [ ] Release v1.0.1 no repo público com `.tgz` + `.zip` + `.exe`
- [ ] `npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.1/studiocodeai-lyacloud-1.0.1.tgz` funciona em terminal limpo
- [ ] README do repo privado tem link pro repo público de releases

---

## 📞 Mensagem pra Luis quando terminar

> ✅ Lya Cloud v1.0.1 publicada.
>
> **Instalação pública (qualquer terminal):**
> ```bash
> npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.1/studiocodeai-lyacloud-1.0.1.tgz
> ```
>
> **Validar:**
> ```bash
> lya --version    # 1.0.1
> lya              # ver wordmark
> ```
>
> Código-fonte continua privado em StudioCodeAI/lyacloud. Releases públicas em StudioCodeAI/lyacloud-installers.
