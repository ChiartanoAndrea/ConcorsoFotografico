# Immagine ufficiale Node.js leggera
FROM node:20-slim

# Installa i pacchetti C++ necessari per compilare driver SQLite nativi (es. better-sqlite3 o sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Assegna la porta interna definita in fly.toml
ENV PORT=8080
ENV NODE_ENV=production

# Copia i file delle dipendenze e installa solo quelle di produzione
COPY package*.json ./
RUN npm ci --only=production

# Copia il codice del tuo backend
COPY . .

# Assicurati che la cartella /data esista
RUN mkdir -p /data

EXPOSE 8080

CMD ["npm", "start"]