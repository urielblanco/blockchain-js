import { app, p2pservice } from './app';

const { HTTP_PORT = 3000 } = process.env;

app.listen(HTTP_PORT, () => {
  console.log(`Service HTTP: ${HTTP_PORT} listening...`);
  p2pservice.listen();
});
