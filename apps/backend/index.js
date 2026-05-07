const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`Encounter ID API running on port ${PORT}`);
});
