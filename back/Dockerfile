FROM node:20-slim

# Instalar dependências de OCR e PDF
RUN apt-get update && apt-get install -y \
    tesseract-ocr tesseract-ocr-por tesseract-ocr-eng \
    poppler-utils \
    libglib2.0-0 libsm6 libxext6 libxrender1 libfontconfig1 \
    fonts-liberation \
    libnss3 libatk-bridge2.0-0 libdrm2 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libxss1 libasound2 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Criar diretórios para processamento de arquivos
RUN mkdir -p uploads/activities/temp uploads/activities/pages uploads/activities/adapted

EXPOSE 3001

CMD ["npm", "run", "dev"]