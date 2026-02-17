# Usa imagem leve do Node.js
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json ./

# Instala dependências
RUN npm install

# Copia o código do backend
COPY server.js ./

# Cria a pasta pública e copia o frontend
RUN mkdir public
COPY index.html ./public/index.html

# Cria a pasta de dados (onde ficará a memória) e define permissões
RUN mkdir data && chown -R node:node /app/data

# Expõe a porta 80
EXPOSE 80

# Inicia o servidor
CMD ["node", "server.js"]