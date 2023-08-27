

const path = "../../data/cart.json";

class Products {
  getAll = async () => {
    if (fs.existsSync(path)) {
      try {
        let result = await fs.promises.readFile(path, "utf-8");
        let data = JSON.parse(result);
        return data;
      } catch (err) {
        console.log("No se pudo leer el archivo: " + err);
      }
    } else {
      return [];
    }
  };
  
  saveProduct = async (product) => {
    try {
      let products = await this.getAll();
      if (products.length === 0) {
        // Primer producto
        product.id = 1;
        products.push(product);
        await fs.promises.writeFile(path, JSON.stringify(products));
      } else {
        product.id = products[products.length - 1].id + 1;
        products.push(product);
        await fs.promises.writeFile(path, JSON.stringify(products));
      }
    } catch (err) {
      console.log("No se pudo escribir el archivo: " + err);
    }
  };
}