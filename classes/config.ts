import {env} from '../env';

const config ={
    PORT: env.PORT,
    db_user:env.DB_USER,
    db_name:env.DB_NAME,
    db_host:env.DB_HOST,
    db_port:env.DB_PORT
}

export default config;