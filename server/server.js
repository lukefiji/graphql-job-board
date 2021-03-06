const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const fs = require('fs');

const PORT = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

// GraphQL
const typeDefs = fs.readFileSync('./schema.gql', { encoding: 'utf-8' });
const resolvers = require('./resolvers');
// Tie together type definitions and resolvers into an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use(
  // Apply CORS middleware to all requests
  cors(),
  // GraphQL requests are in JSON format
  bodyParser.json(),
  // ExpressJWT - A middleware to check if a user is authenticated
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false
  })
);

// Make schema accessible via the `/graphql` endpoint
app.use(
  '/graphql',
  graphqlExpress(req => ({
    schema,
    // You can pass anything you want into a context
    context: { user: req.user && db.users.get(req.user.sub) } // req.user comes from ExpressJWT middleware
  }))
);
// Make graphical interface accessible via the `/graphiql` endpoint
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find(user => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
