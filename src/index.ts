import dotenv from "dotenv";
import startup from "./startup";
dotenv.config();

startup();

// .env
/*
API_KEY -- API KEY secret to connect to the API
RCONPASSWORD -- rcon password set on the gmod servers
GMODSERVER_DATA_PATH -- path to the data folder of the gmod servers
*/
