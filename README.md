# Maksym Prysiazhnikov Portfolio

Personal portfolio website built with React and Express.
The site includes a floating AI assistant powered by OpenRouter, clickable technology detail pages, and learning platform sections connected to Maksym's background.

## Local development

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and set both `OPENROUTER_KEYS` and `OPENROUTER_MODEL` if you want the AI chat widget enabled.
   `OPENROUTER_KEYS` can contain one key or multiple keys separated by commas, semicolons, or new lines.
3. Start the dev server:
   `npm run dev`

## Production build

1. Build the app:
   `npm run build`
2. Start the production server:
   `npm run start`

The production server serves the `dist` folder and exposes a health endpoint at `/health`.
It also exposes `POST /api/chat` as a server-side proxy for the floating OpenRouter chat widget.

## Docker

Build the image:

`docker build -t maksym-prysyazhnikov-portfolio .`

Run it locally:

`docker run --rm -p 3000:3000 -e OPENROUTER_KEYS=key_one,key_two -e OPENROUTER_MODEL=deepseek/deepseek-chat maksym-prysyazhnikov-portfolio`

## Railway

1. Push this project to GitHub.
2. Create a new Railway project from the repository.
3. Railway will detect the [Dockerfile](C:\Users\Макс\Desktop\maksym-prysyazhnikov-portfolio\Dockerfile) and build the container automatically.
4. Open the generated Railway domain after the first successful deploy.

Railway injects the `PORT` environment variable automatically, and this app is already configured to use it.
