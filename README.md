# Desafio Alimentario 
## Web Application Backend
This is a NodeJS application backend for connecting to the database and third part APIs. 
The front-end application connects to this backend and shares data via `GraphQl`

This is an [Apollo Server](https://www.apollographql.com/docs/apollo-server/) project bootstrapped with [`koa js`](https://www.apollographql.com/docs/apollo-server/v1/servers/koa/).

## Getting Started

To start the project, create an .env file then copy paste the values in env.example.
After that, install the npm packages and start the project

```bash
yarn
# then
yarn start
```

### Setting Up Sequelize Data Models and Migrations
This project uses Sequelize to connect to the Database, This allows for multiple Database dialects all interchangeable within the project itself.
Read more on [`Sequelize`](https://sequelize.org/docs/v6/getting-started/).

#### Available Sequelize commands
```bash
# Install Sequelize
yarn add --save sequelize

# Install sequilize-cli - if not already installed globally
yarn add sequelize-cli

# To install mysql2 after sequilize
yarn add --save mysql2
```

```bash
# To create a table from a model
sequelize migration:create --name create_[table_name]_table
```

```bash
# To create the database with all tables
sequelize db:migrate
```

```bash
# To undo the latest database action
sequelize db:migrate:undo
```

```bash
# To undo all database migration actions
sequelize db:migrate:undo all
```

```bash
# To check for any running ports
netstat -vanp tcp | grep 5052
```

### Viewing the Application on the browser

Open [http://localhost:5052/graphql](http://localhost:5052/graphql) with your browser to check out the Graphql Playground.
