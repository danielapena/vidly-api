const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.insertMany([{ name: "Genre1" }, { name: "Genre2" }]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "Genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Genre1");
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Genre1";
    });

    const exec = async () => {
      return await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is greater than 50 characters", async () => {
      name = new Array(53).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });
  });
});
