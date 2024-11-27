const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
/* Set up your test imports here */

const topicData = require("../db/data/test-data/topics");
const articleData = require("../db/data/test-data/articles");
const { captureRejectionSymbol } = require("supertest/lib/test");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(topicData);
      });
  });

  test("404: Responds with a 404 error if endpoint not found", () => {
    return request(app)
      .get("/api/notATopic")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object with the correct keys", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body: {article}}) => {
      expect(article).toMatchObject([{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }])
    })
  })

  test("400: Responds with a 400 error if passed an invalid id", () => {
    return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then(({body: {message}}) => {
      expect(message).toBe("Invalid Id")
    })
  })

  test("404: responds with a 404 error if passed a valid Id that does not exist in the database", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body: {message}}) => {
      expect(message).toBe("Invalid input")
    })
  })

})


describe("GET: /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toHaveLength(13)
      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
          article_img_url: expect.any(String)
        })
      })
    })
  })

  test("200: Response should not contain a body property", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      articles.forEach((article) => {
        expect(article).not.toHaveProperty("body")
      })
    })
  })
})

describe("GET /api/articles/:article_id/comments", () =>  {
  test("200: Responds with an array of comment objects associated with the article_id", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments).toHaveLength(11)
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          votes: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String)
        })
      })
    })
  })
})


describe("POST /api/articles/:article_id/comments", () =>  {
  test("201: Responds with a newly posted comment object", () => {
    const data = {
      username: "butter_bridge",
      body: "I am so cool."

    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(data)
    .expect(201)
    .then(({body: {comment}}) => {
        expect(comment[0]).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          votes: 0,
          author:"butter_bridge",
          body: "I am so cool.",
          created_at: expect.any(String)
        })
      })
    })

    test("400: Responds with a 400 error if incorrect body is passed", () => {
      const data = {}
      return request(app)
      .post("/api/articles/1/comments")
      .send(data)
      .expect(400)
      .then(({body: {message}}) => {
        expect(message).toBe("Invalid Request")
      })
      })

      test("400: Responds with a 400 error if body is passed with incorrect data types", () => {
        const data = {
          username: 1,
          body: true
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(data)
        .expect(400)
        .then(({body: {message}}) => {
          expect(message).toBe("invalid data types inputted in body")
        })
        })
  })

  describe("PATCH /api/articles/:article_id", () => {
    test("200: Should respond with an updated article object", () => {
      const data = {
        inc_votes: 1
      }
      return request(app)
      .patch("/api/articles/1/")
      .send(data)
      .expect(200)
      .then(({body: {article}}) => {
        expect(article).toHaveLength(1)
        expect(article).toMatchObject([{
          article_id: 1,
          votes: 101,
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String)
        }])
      })
    })

    test("400: Responds with a 400 error if incorrect body is passed", () => {
      const data = {
        inc_votes: "string"
      }
      return request(app)
      .patch("/api/articles/1/")
      .send(data)
      .expect(400)
      .then(({body: {message}}) => {
        expect(message).toBe("Invalid Request")
      })
    })

    test("400: Responds with a 400 error if passed an invalid id", () => {
      const data = {
        inc_votes: 2
      }
      return request(app)
      .patch("/api/articles/notAnId/")
      .send(data)
      .expect(400)
      .then(({body: {message}}) => {
        expect(message).toBe("Invalid Id")
      })
    })

    test("404: responds with a 404 error if passed a valid Id that does not exist in the database", () => {
      const data = {
        inc_votes: 2
      }
      return request(app)
      .patch("/api/articles/1000/")
      .send(data)
      .expect(404)
      .then(({body: {message}}) => {
        expect(message).toBe("Invalid input")
      })
    })
  
  })
