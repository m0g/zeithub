import * as assert from "assert";
import * as request from "supertest";
import app from "./index";

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

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

after(() => {
  process.exit(0);
});
