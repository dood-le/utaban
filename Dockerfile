FROM node:22-slim

WORKDIR /app

# Copy pre-built output
COPY .output .output

# Install server-side dependencies
RUN cd .output/server && npm install

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
