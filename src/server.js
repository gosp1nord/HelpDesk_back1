const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();
const tickets = [];

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
    case 'createTicket': {
      const { name, description } = ctx.request.body;
      tickets.push({
        id: ID,
        name,
        description,
        status: false,
        created: ID,
      });
      ctx.response.body = tickets;
      return;
    }
    case 'editTicket': {
      const { id, name, description } = ctx.request.body;
      tickets.some((item) => {
        if (item.id === Number(id)) {
          item.name = name;
          item.description = description;
        }
      });
      ctx.response.body = tickets;
      return;
    }
    case 'completeTicket': {
      let { id, status } = ctx.request.body;
      if (status && status === '1') {
        status = true;
      } else if (status && status === '0') {
        status = false;
      }
      tickets.some((item) => {
        if (item.id === Number(id)) {
          item.status = status;
        }
      });
      ctx.response.body = { id, status };
      return;
    }
    case 'dellTicket': {
      let index;
      for (let i = 0; i < tickets.length; i += 1) {
        if (tickets[i].id === Number(id)) {
          index = i;
          break;
        }
      }
      tickets.splice(index, 1);
      ctx.response.body = tickets;
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
