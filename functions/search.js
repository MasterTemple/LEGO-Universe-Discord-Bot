module.exports = {
  async search(db){
    return new Promise((resolve, reject) => {

      db.serialize(function() {
        // These two queries will run sequentially.
        db.run("INSERT INTO foo VALUES (?)", 1, function() {
        // These queries will run in parallel and the second query will probably
        // fail because the table might not exist yet.
      });
      });
    })
  }
}