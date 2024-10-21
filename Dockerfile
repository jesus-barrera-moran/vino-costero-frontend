# Usa la imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Establece la variable de entorno para producción
ENV NODE_ENV=staging

# Establece la variable de entorno del puerto para Google Cloud Run
ENV PORT=3001

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
