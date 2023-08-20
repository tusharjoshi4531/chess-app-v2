import { config } from "dotenv";
config();

import app from "./src/app";
import { PORT } from "./src/config/config";

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});
