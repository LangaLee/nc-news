const { formatArticles } = require("../utils/model.utils");
const { articleData, commentData } = require("../db/data/test-data/index");

describe.only("testing utils", () => {
  describe("formatArticles", () => {
    test("does not mutate the data passed", () => {
      const input = [
        {
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: 1602986400000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ];
      const input1 = [
        {
          body: "This is a bad article name",
          votes: 1,
          author: "butter_bridge",
          article_id: 6,
          created_at: 1602433380000,
        },
      ];
      formatArticles(input, input1);
      expect(input).toEqual([
        {
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: 1602986400000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ]);
      expect(input1).toEqual([
        {
          body: "This is a bad article name",
          votes: 1,
          author: "butter_bridge",
          article_id: 6,
          created_at: 1602433380000,
        },
      ]);
    });
    test("return the articles without the body property", () => {
      const output = formatArticles(articleData, commentData);
      output.forEach((article) => {
        expect(article.hasOwnProperty("body")).toBe(false);
      });
    });
    test("return the articles with the comment_count added", () => {
      const testArticles = [
        {
          article_id: 1,
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
        {
          article_id: 2,
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ];
      const testComments = [
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 1,
          created_at: 1586179020000,
        },
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 1,
          created_at: 1586179020000,
        },
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 2,
          created_at: 1586179020000,
        },
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 1,
          created_at: 1586179020000,
        },
      ];

      const output = formatArticles(testArticles, testComments);
      output.forEach((article) => {
        if (article.article_id === 1) {
          expect(article.comment_count).toBe(3);
        } else {
          expect(article.comment_count).toBe(1);
        }
      });
    });
  });
});
