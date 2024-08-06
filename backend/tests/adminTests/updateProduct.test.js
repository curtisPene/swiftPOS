const mongoose = require("mongoose");
const app = require("../../app");
const request = require("supertest");

describe("PATCH api/admin/product/:productId", async () => {
  let admin1, admin2, location1, location2, product1, product2, accessToken;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.connection.close();
  });

  test("Update product with correct request body and auth", async () => {
    const response = await request(app).patch("/api/admin/product").send({
      brand: "dfsdfs lkdjl",
      description: "lsjojdiofj dosj dsoifdo",
      category: "Household Supplies",
    });
  });
});
