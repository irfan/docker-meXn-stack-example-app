FROM node:16
USER node
WORKDIR /apis/booking_manager
COPY --chown=node:node . .
RUN npm install
EXPOSE 8080
CMD ["node", "src/index.js"]
