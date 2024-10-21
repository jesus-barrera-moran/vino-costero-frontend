# Usa la imagen oficial de Node.js como base
FROM node:18-alpine AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Usa una imagen de servidor web ligero para servir el contenido estático
FROM nginx:alpine

# Copia los archivos compilados al directorio que NGINX utiliza para servir archivos estáticos
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 3001 para el contenedor
EXPOSE 3001

# Inicia NGINX
CMD ["nginx", "-g", "daemon off;"]
