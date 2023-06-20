const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();
const tickets = [];
const ticketsDescription = {};

app.use(cors());
app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  const now = new Date();
  const ID = now.getTime();
  switch (method) {
    case 'allTickets': {
      ctx.response.body = tickets;
      return;
    }
    case 'ticketById': {
      let currentTicket = {};
      tickets.some((item) => {
        if (item.id === Number(id)) {
          currentTicket = item;
          currentTicket.description = ticketsDescription[id];
        }
      });
      ctx.response.body = currentTicket;
      return;
    }
    case 'createTicket': {
      const { name, description, status } = ctx.request.body;
      tickets.push({
        id: ID,
        name,
        status,
        created: ID,
      });
      ticketsDescription[ID] = description;
      ctx.response.body = {
        id: ID,
        name,
        description,
        status,
        created: ID,
      };
      return;
    }
    default: {
      ctx.response.status = 404;
    }
  }
});

const server = http.createServer(app.callback());
const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
});
