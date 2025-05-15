const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));
app.use(express.json());

const precios = {
  "Pizza": 3,
  "Hamburguesa": 3,
  "Vegetal": 3,
  "Refresco": 1,
  "Agua": 0.5,
  "Chocolatina": 1,
  "Tortita/Crep": 1,
  "Ensalada": 3,
  "Croissant": 3,
  "Helado": 1
};

let stock = {};
for (let producto in precios) {
  stock[producto] = 7;
}

app.post("/pedido", (req, res) => {
  const { nombre, items } = req.body;
  const pedidoFinal = {};
  let total = 0;

  for (let producto in items) {
    const cantidad = items[producto];
    if (stock[producto] >= cantidad) {
      stock[producto] -= cantidad;
      const precio = precios[producto];
      pedidoFinal[producto] = {
        cantidad,
        precio,
        total: cantidad * precio
      };
      total += cantidad * precio;
    } else {
      return res.json({
        exito: false,
        mensaje: `Solo quedan ${stock[producto]} unidades de ${producto}.`
      });
    }
  }

  console.log(`Pedido de ${nombre}:`, pedidoFinal, `Total: ${total} €`);

  res.json({
    exito: true,
    pedido: pedidoFinal,
    total
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor iniciado en puerto", PORT);
});
