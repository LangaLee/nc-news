/*
should remove the body property 
should add comment count 
*/
function formatArticles(articleData, commentData) {
  const articleDataCopy = JSON.parse(JSON.stringify(articleData));
  const commentDataCopy = JSON.parse(JSON.stringify(commentData));

  const result = articleDataCopy.map((article) => {
    delete article.body;
    let numOfComments = 0;
    commentDataCopy.forEach((comment) => {
      if (comment.article_id === article.article_id) {
        numOfComments++;
      }
    });
    article.comment_count = numOfComments;
    return article;
  });
  return result;
}

module.exports = { formatArticles };
