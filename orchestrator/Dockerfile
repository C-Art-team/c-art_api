FROM node:lts-alpine
WORKDIR /orchestrator
COPY . .
RUN npm install --production
ENV PORT=4000
ENV NODE_ENV=production
ENV APP_URL=
ENV USERS_URL=
ENV REDIS_PORT=
ENV REDIS_HOST=
ENV REDIS_PASSWORD=
EXPOSE 4000
CMD ["npm", "run", "start"]