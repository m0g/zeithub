import * as assert from "assert";
import * as request from "supertest";
import app from "./index";

describe("Get api/me", function() {
  this.timeout(3000);

  it("should respond with 403 if not logged", function(done) {
    request(app)
      .get("/api/me")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(403)
      .end(function(err) {
        console.log("end", err);
        done();
      });
  });
});

describe("Sign up", function() {
  it("should create a new user and return a token", function(done) {
    request(app)
      .post("/api/sign/up")
      .send({ username: "test", password: "test123", email: "test@te.st" })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        const { user, token } = res.body;

        assert.equal(user.id, 1);
        assert.equal(user.name, "test");
        assert.equal(user.email, "test@te.st");
        assert.ok(token);

        done();
      });
  });
});

after(() => {
  process.exit(0);
});
