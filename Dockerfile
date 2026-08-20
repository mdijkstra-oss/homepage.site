# The site as a container: a Node builder, then nginx holding the built assets
# and nothing else. Nothing outside this repository is read, so a git URL is a
# complete build context and a machine holding neither a clone nor Node can
# still build the image.

FROM node:22-alpine AS build

WORKDIR /src

# The manifests are their own layer so that editing a source file does not
# reinstall the dependency tree.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Compiled into the bundle rather than read at run time, so the image is
# specific to one backend URL and a change of URL is a rebuild. vite.config.ts
# throws when this is unset, which is what stops an image shipping with a
# placeholder.
ARG VITE_AGENT_URL
ENV VITE_AGENT_URL=$VITE_AGENT_URL
ARG VITE_POSTHOG_KEY
ENV VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY
RUN npm run build

FROM nginx:alpine-slim

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

# The packaged entrypoint templates configuration and adjusts ownership, both of
# which need root. Naming nginx directly skips it.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
