import { Application } from "express";
import rcon from './rcon';
import server from './server';

export default (app: Application) => {
	app.use('/rcon', rcon);
	app.use('/server', server);
	console.log("Added routes");

}