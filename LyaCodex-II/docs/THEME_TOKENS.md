# Theme Tokens — LyaCode / LyaCodex II

> **O que agrada os olhos, agrada o coração.**

Este arquivo documenta os temas oficiais do LyaCode para uso no app principal, extensões, complementos, páginas, CLIs visuais e projetos derivados.

## Temas oficiais

```text
Lya Deep Dark        — padrão
Lya Glass Dev        — premium/glass, inspirado em IDE moderna
Lya Classic Terminal — preto, simples e direto
```

---

# 1. Lya Deep Dark

Tema padrão do LyaCode.

Indicado para:

- uso diário;
- terminal moderno;
- experiência premium sem exagero;
- equilíbrio entre estética e foco.

## CSS selector

```css
[data-theme="lya-deep-dark"]
```

## Cores

```css
--bg-primary:    #0d0d0f;
--bg-secondary:  #111114;
--bg-tertiary:   #1a1a1f;
--bg-glass:      rgba(13, 13, 15, 0.92);

--panel-gradient-primary:   rgba(124, 58, 237, 0.18);
--panel-gradient-secondary: rgba(34, 197, 94, 0.10);

--text-primary:   #ffffff;
--text-secondary: #c8c8d0;
--text-muted:     #555560;

--color-green:  #22c55e;
--color-yellow: #eab308;
--color-red:    #ef4444;
--color-blue:   #3b82f6;

--accent-primary: #7c3aed;
--accent-hover:   #6d28d9;
--accent-glow:    rgba(124, 58, 237, 0.3);
```

---

# 2. Lya Glass Dev

Tema visual premium, inspirado em interfaces modernas de IDE com profundidade, transparência, blur e brilho controlado.

Indicado para:

- first run;
- painéis de IA;
- dashboards;
- modo apresentação;
- experiência visual marcante.

## CSS selector

```css
[data-theme="lya-glass-dev"]
```

## Cores

```css
--bg-primary:    #0b0d13;
--bg-secondary:  rgba(17, 19, 30, 0.86);
--bg-tertiary:   rgba(33, 37, 56, 0.74);
--bg-glass:      rgba(14, 16, 26, 0.70);

--panel-gradient-primary:   rgba(137, 127, 255, 0.25);
--panel-gradient-secondary: rgba(79, 255, 190, 0.14);

--text-primary:   #f7f8ff;
--text-secondary: #c6c9df;
--text-muted:     #737993;

--color-green:  #4fffb9;
--color-yellow: #facc15;
--color-red:    #fb7185;
--color-blue:   #8bb7ff;

--accent-primary: #8b7cff;
--accent-hover:   #a095ff;
--accent-glow:    rgba(139, 124, 255, 0.34);
```

---

# 3. Lya Classic Terminal

Tema direto, preto, limpo e técnico.

Indicado para:

- programadores raiz;
- foco total;
- terminal puro;
- ambientes de baixa distração;
- uso em telas OLED.

## CSS selector

```css
[data-theme="lya-classic-terminal"]
```

## Cores

```css
--bg-primary:    #000000;
--bg-secondary:  #050505;
--bg-tertiary:   #0d0d0d;
--bg-glass:      rgba(0, 0, 0, 0.96);

--panel-gradient-primary:   rgba(255, 255, 255, 0.00);
--panel-gradient-secondary: rgba(34, 197, 94, 0.04);

--text-primary:   #e8e8e8;
--text-secondary: #b7b7b7;
--text-muted:     #6a6a6a;

--color-green:  #22c55e;
--color-yellow: #d6b94a;
--color-red:    #ef4444;
--color-blue:   #60a5fa;

--accent-primary: #22c55e;
--accent-hover:   #16a34a;
--accent-glow:    rgba(34, 197, 94, 0.18);
```

---

# Tokens compartilhados

Estes tokens existem em todos os temas:

```css
--bg-primary
--bg-secondary
--bg-tertiary
--bg-glass
--panel-gradient-primary
--panel-gradient-secondary

--text-primary
--text-secondary
--text-muted

--color-green
--color-yellow
--color-red
--color-blue

--accent-primary
--accent-hover
--accent-glow

--border-color
--border-hover

--radius-sm
--radius-md
--radius-lg

--shadow-sm
--shadow-md
--shadow-glow
```

---

# Regras de uso

## Verde

Use para:

- online;
- ready;
- local engine ativo;
- sucesso;
- Lya acordada.

## Amarelo

Use para:

- opção recomendada;
- destaque `⭐ OpenAI GPT Local`;
- atenção não perigosa.

## Vermelho

Use apenas para:

- erro;
- risco;
- perigo;
- ação destrutiva.

## Azul/Roxo

Use para:

- IA;
- engine;
- inteligência;
- links;
- painéis premium.

---

# Filosofia visual

Terminal tem que ser escuro.

Mas escuro não precisa ser sem alma.

> Uma ferramenta poderosa que parece frágil perde confiança.  
> Uma ferramenta poderosa que parece sólida cria desejo de uso.
