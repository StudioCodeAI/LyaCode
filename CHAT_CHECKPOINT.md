# CHAT CHECKPOINT — Lya Code (v1.1.1)

**Data:** 2026-06-21
**Status Atual:** Hugging Face OAuth implementado e publicado. v1.1.1 no ar.

## O que foi feito nesta sessão

1. **Auditoria completa** — typecheck, testes (4635/4636 pass), deadcode, doctor, segurança
2. **Hugging Face OAuth** — `/onboard-huggingface`, device flow, secure storage, 7 modelos curados
3. **Reordenação de providers** — Ollama e Hugging Face no topo, Gitlawb Opengateway no fim
4. **12 correções de teste** — StartupScreen, ProviderManager, compatibility, registry, npmUpdateCheck
5. **README** — nova seção "Comece gratis" (GitHub + Hugging Face + Ollama)
6. **Release v1.1.1** — `.tgz` + `.zip` no LyaCode-installers

## Pendente para próxima sessão

- [ ] Instalar WiX/MSIX/7-Zip para gerar `.exe` / `.msi` / `.msix`
- [ ] `bun update` (26 vulnerabilidades — 1 critica shell-quote, 9 high)
- [ ] Prompt caching Anthropic (cache_control ephemeral)
- [ ] Auditar memory leaks (listeners/intervals)
- [ ] Remover stub obsoleto `src/commands/plan/index` do ACCEPTABLE_RUNTIME_STUBS
- [ ] Feature: node-llama-cpp (IA local embutida, sem Ollama)
- [ ] Feature: `/onboard-vertex` (Google Cloud OAuth via gcloud)

## Comandos de validação
```powershell
cd E:\GitHub\LyaCode
bun run typecheck && bun run smoke && bun run integrations:check && bun test
```

## Links
- Release: https://github.com/StudioCodeAI/LyaCode-installers/releases/tag/v1.1.1
- Código: https://github.com/StudioCodeAI/LyaCode

---
> **Nota para o Agente:** Leia este arquivo e `C:\Gemini\MASTER\PROJETOS\SESSAO_RESUMO.md` ao iniciar. Proveedor livre e principal já está no topo: Ollama → Hugging Face → Anthropic. Não desfaça a reordenação.