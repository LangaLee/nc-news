const app = require("./app");

const { PORT = 3000 } = process.env;

app.listen(3000, () => {
  console.log(`We are live on radio 3000`);
});
