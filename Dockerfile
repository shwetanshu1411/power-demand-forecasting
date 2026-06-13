FROM python:3.11

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY ml/requirements.txt ./ml/
RUN pip install --no-cache-dir -r ml/requirements.txt

COPY . .

EXPOSE 5000

WORKDIR /app/backend

CMD ["npm", "start"]