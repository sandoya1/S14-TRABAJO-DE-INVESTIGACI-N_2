import express, { Request,Response,Application } from "express";
import { IApp } from "../interface/Iservidor";
import morgan from "morgan";
import routerCargo from "../routes/cargo.routes";
import routerPrincipal from "../routes/principal";
import cors from 'cors'

export class App implements IApp {
  public app: Application;
  private _portDefault: number;
  constructor(private port: number = 3000) {
    this.app = express(); // se crea el servidor de express en app
    this._portDefault = port;
    this.settings()
    this.middlewares()
    this.routes()
  }
  settings() {
    this.app.set("port", this._portDefault || process.env.PORT);
    
  }

  middlewares() {
    this.app.use(morgan("dev")); // muestra x consola mensajes en desarrollo
    // recibir datos de formulario como json
    this.app.use(express.urlencoded({ extended: true }));
    // recibe datos como json(no de formularios)
    this.app.use(express.json({ type: "*/*" }));
    this.app.use(cors());
  }

  routes() {
    // this.app.get("/",(req: Request,res: Response) => {
    //    res.send("Bienvenidos a mi app")
    // })
    this.app.use(routerPrincipal)
    this.app.use("/cargos", routerCargo);
   
  }

  async listen(): Promise<void> {
    await this.app.listen(this.app.get("port"));
    console.log(`Server on port => ${this.app.get("port")}`);
  }
}

