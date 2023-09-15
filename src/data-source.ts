import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "contacts",
    entities: ["src/entities/*{.ts,.js}"],
    logging: true,
    migrations: ["src/migrations/*{.ts,.js}"],
})