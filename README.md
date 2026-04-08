# Maksym Prysyazhnikov Portfolio

## Local development

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`

## Production build

1. Build the app:
   `npm run build`
2. Start the production server:
   `npm run start`

The production server serves the `dist` folder and exposes a health endpoint at `/health`.

## Docker

Build the image:

`docker build -t maksym-prysyazhnikov-portfolio .`

Run it locally:

`docker run --rm -p 3000:3000 maksym-prysyazhnikov-portfolio`

## Railway

1. Push this project to GitHub.
2. Create a new Railway project from the repository.
3. Railway will detect the [Dockerfile](C:\Users\Макс\Desktop\maksym-prysyazhnikov-portfolio\Dockerfile) and build the container automatically.
4. Open the generated Railway domain after the first successful deploy.

Railway injects the `PORT` environment variable automatically, and this app is already configured to use it.
