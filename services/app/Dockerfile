FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install --production
ENV PORT=4002
ENV NODE_ENV=production
ENV MIDTRANS_TOKEN=
ENV DATABASE_URL=
EXPOSE 4002
CMD ["npm", "run", "start"]