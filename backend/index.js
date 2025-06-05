const app = require("./src/app.js");
const dotenv = require("dotenv");
dotenv.config();

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
