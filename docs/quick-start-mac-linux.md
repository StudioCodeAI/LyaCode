# Lya Cloud Quick Start for macOS and Linux

This guide uses a standard shell such as Terminal, iTerm, bash, or zsh.

## 1. Install Node.js

Install Node.js 22 LTS or newer from:

- `https://nodejs.org/`

Then check it:

```bash
node --version
npm --version
```

## 2. Install Lya Cloud

```bash
npm install -g @studiocodeai/lyacloud@latest
```
On Arch Linux, you can alternatively install Lya Cloud via the community-maintained [AUR package](https://aur.archlinux.org/packages/lyacloud):

```bash
paru -S lyacloud
```
## 3. Pick One Provider

### Option A: OpenAI

Replace `sk-your-key-here` with your real key.

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_MODEL=gpt-4o

lyacloud
```

### Option B: DeepSeek

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-v4-flash

lyacloud
```

Use `deepseek-v4-pro` when you want the stronger model. `deepseek-chat` and `deepseek-reasoner` still work as DeepSeek's legacy API aliases.

### Option C: Ollama

Install Ollama first from:

- `https://ollama.com/download`

Then run:

```bash
ollama pull llama3.1:8b

export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.1:8b

lyacloud
```

No API key is needed for Ollama local models.

### Option D: LM Studio

Install LM Studio first from:

- `https://lmstudio.ai/`

Then in LM Studio:

1. Download a model (e.g., Llama 3.1 8B, Mistral 7B)
2. Go to the "Developer" tab
3. Select your model and enable the server via the toggle

Then run:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_MODEL=your-model-name
# export OPENAI_API_KEY=lmstudio  # optional: some users need a dummy key

lyacloud
```

Replace `your-model-name` with the model name shown in LM Studio.

No API key is needed for LM Studio local models (but uncomment the `OPENAI_API_KEY` line if you hit auth errors).

### Option E: Using a .env file (Optional)

If you prefer to keep your keys in a `.env` file instead of exporting them individually, note that Lya Cloud does not load `.env` files automatically. You must explicitly pass it:

```bash
lyacloud --provider-env-file .env
```

Keep `.env` out of git because it contains secrets.
The explicit loader accepts provider/setup variables. Export runtime/debug variables from your shell or launcher instead.

## 4. If `lyacloud` Is Not Found

Close the terminal, open a new one, and try again:

```bash
lyacloud
```

## 5. If Your Provider Fails

Check the basics:

### For OpenAI or DeepSeek

- make sure the key is real
- make sure you copied it fully

### For Ollama

- make sure Ollama is installed
- make sure Ollama is running
- make sure the model was pulled successfully

### For LM Studio

- make sure LM Studio is installed
- make sure LM Studio is running
- make sure the server is enabled (toggle on in the "Developer" tab)
- make sure a model is loaded in LM Studio
- make sure the model name matches what you set in `OPENAI_MODEL`

## 6. Updating Lya Cloud

**Via npm:**
```bash
npm install -g @studiocodeai/lyacloud@latest
```

**Via AUR:**
```bash
paru
```
*(Or use your preferred AUR helper like `yay -Syu`)*

## 7. Uninstalling Lya Cloud

**Via npm:**
```bash
npm uninstall -g @studiocodeai/lyacloud
```

**Via AUR (Arch Linux):**
```bash
paru -Rns lyacloud
```

## Need Advanced Setup?

Use:

- [Advanced Setup](advanced-setup.md)
  For Codex, Gemini, Mistral, LiteLLM, provider profiles, and runtime diagnostics.
