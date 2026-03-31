# 🚀 Guia de Publicação: StepForge

Este guia vai te ajudar a deixar o seu GitHub impecável para a vaga de estágio. Siga os passos abaixo:

---

## 1. 📸 Capturando as Telas (Screenshots)

Para o README ficar bonitão, precisamos de imagens de qualidade. 

### Dicas para as fotos:
1. **Web (PWA)**:
   - Abra o `localhost:5173` no Chrome.
   - Aperte `F12` e clique no ícone de "dispositivo móvel" (segundo ícone no topo esquerdo do painel de desenvolvedor).
   - Escolha "iPhone 12 Pro" ou "Pixel 7" no topo.
   - Tire prints das seguintes telas:
     - **Dashboard**: Com os gráficos e resumo.
     - **Detalhes do Grupo**: Mostrando os membros e o ranking.
     - **Perfil**: Mostrando o calendário de treinos.
2. **Mobile (Android)**:
   - Se estiver usando o emulador, use a ferramenta de "Screen Capture" do próprio Android Studio para salvar imagens limpas.

### Onde salvar:
Salve as imagens na pasta que acabei de criar: `docs/screenshots/`.
Renomeie as fotos para:
- `dashboard.png`
- `social.png`
- `profile.png`

---

## 2. 🛠️ Subindo para o GitHub (Do Zero)

Siga estes comandos no terminal da raiz do projeto:

1. **Inicializar o Git**:
   ```bash
   git init
   ```

2. **Adicionar os arquivos**:
   ```bash
   git add .
   ```

3. **Primeiro Commit**:
   ```bash
   git commit -m "feat: initial commit - StepForge platform"
   ```

4. **Conectar ao GitHub**:
   - Vá ao seu GitHub e crie um novo repositório chamado `stepforge`. **Não** marque a opção de criar README ou .gitignore (já temos eles).
   - Copie a URL do seu repositório e rode:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/stepforge.git
   ```

5. **Enviar os arquivos**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## 3. 💡 Dica de Ouro para o Estágio

No seu LinkedIn, ao postar sobre o projeto:
- Marque as tecnologias: #React #NestJS #TypeScript #CleanCode.
- Fale sobre o **Monorepo**: *"Neste projeto, utilizei uma estrutura de monorepo para compartilhar tipos entre o App Mobile e a Web, garantindo consistência total nos dados."* (Isso mostra que você entende de arquitetura!)

---

**Qualquer dúvida na hora de rodar os comandos, me chama!**
