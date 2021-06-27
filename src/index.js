const Koa = require("koa");
const { ApolloServer } = require("apollo-server-koa");
const session = require("koa-session");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const { userAgent } = require("koa-useragent");
const convert = require("koa-convert");
const requestIp = require("request-ip");
const config = require("dotenv");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

config.config();
const configValues = process.env;
// this represents a maxage of three months
const configurations =
  configValues.NODE_ENV === "production"
    ? require("../configs/production.json")
    : require("../configs/development.json");

const CountriesAPI = require("./datasources/Countries");
const NameAPI = require("./datasources/Name");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => {
    const clientIp = requestIp.getClientIp(ctx.req);
    return {
      session: ctx.req.session,
      cookie: ctx.cookie,
      userAgent: ctx.userAgent,
      clientIp,
    };
  },
  dataSources: () => ({
    country: new CountriesAPI(),
    name: new NameAPI(),
  }),
  formatError: (err) => {
    err.extensions.exception = "";
    if (
      new RegExp(
        "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"
      ).test(err.message)
    ) {
      err.message =
        "Oops! An error occurred somewhere. Please try again later.";
    }
    return err;
  },
  introspection: configValues.NODE_ENV !== "production",
  playground: configValues.NODE_ENV !== "production",
});
const app = new Koa();

app.use(logger());

// use random keys to sign the data
app.keys = configurations.session.keys;

const whitelist = configValues.ORIGIN.split(",");

const checkOriginAgainstWhitelist = (ctx) => {
  const requestOrigin = ctx.accept.headers.origin;
  if (!whitelist.includes(requestOrigin)) {
    return ctx.throw(`🙈 ${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
};

app.use(
  convert(
    cors({
      origin: checkOriginAgainstWhitelist,
      credentials: true,
    })
  )
);

app.use(userAgent);

app.use(
  helmet({
    contentSecurityPolicy:
      configValues.NODE_ENV === "production" ? undefined : false,
  })
);
// add the ecnryption secret key
// configurations.session.options.secretKey = Buffer.from(configValues.COOKIE_ENCRYPTION_KEY, 'base64');
app.use(session(configurations.session.options, app));

app.use((ctx, next) => {
  // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
  // context, see https://github.com/apollographql/apollo-server/issues/1551
  ctx.cookie = ctx.cookies;
  ctx.req.session = ctx.session;
  return next();
});

server.applyMiddleware({ app });

const http = app.listen({ port: configValues.SERVER_PORT || 4000 }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${configValues.SERVER_PORT || 4000}${
      server.graphqlPath
    }`
  );
});

module.exports = http;
