# TransLog 3D — Plataforma de Gestão de Cargas, Telemetria & IA Preditiva

Uma plataforma web moderna para monitoramento de transporte de cargas, visualização 3D de frotas e planta virtual de contêineres em tempo real com motor de Inteligência Artificial para prevenção de riscos alimentado por feedback.

---

## 🚀 Como Subir para o GitHub

1. No seu terminal (PowerShell ou CMD na pasta do projeto):
```bash
git init
git add .
git commit -m "Initial commit: TransLog 3D Web App"
```

2. Crie um repositório no GitHub (ex: `translog-3d`).

3. Vincule o repositório remoto e faça o push:
```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/translog-3d.git
git push -u origin main
```

---

## 🌐 Como Fazer Deploy no Render.com

1. Acesse **[Render.com](https://render.com)** e faça login com sua conta do GitHub.
2. Clique no botão **New +** e selecione **Web Service**.
3. Conecte o repositório `translog-3d` recém-criado.
4. O Render detectará automaticamente as configurações através do arquivo `render.yaml`:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Clique em **Create Web Service**.

Em poucos segundos, sua aplicação estará **Online no ar** com certificado SSL grátis!

---

## 🛠️ Tecnologias Utilizadas
- **React 18 & Three.js**: Renderização tridimensional interativa (WebGL) de caminhões, navios, aviões e interior do contêiner.
- **Node.js HTTP Engine**: Servidor otimizado para deploy em nuvem.
- **Motor de IA Preditiva**: Algoritmo de aprendizado continuo com feedback de clientes.
