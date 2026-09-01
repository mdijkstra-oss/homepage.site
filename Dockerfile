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

# A Serverless Container has no host to run a log collector on and no second
# container to put one beside, so the shipper is carried here.
RUN apk add --no-cache curl jq

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /usr/share/nginx/html

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/ship.sh /usr/local/bin/ship.sh

ENV BETTERSTACK_SERVICE=site

USER nginx

EXPOSE 8080

# The packaged entrypoint templates configuration and adjusts ownership, both of
# which need root, so it is bypassed.

# The packaged image stops on QUIT, nginx's graceful shutdown. A shell cannot
# forward QUIT to a child it started asynchronously, so the runtime is asked for
# TERM instead and nginx does a fast shutdown. It serves static files in
# milliseconds, so there is no long request for the graceful path to protect.
STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/local/bin/entrypoint.sh", "nginx", "-g", "daemon off;"]
