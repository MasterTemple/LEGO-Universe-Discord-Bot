class Item {
  constructor(){

  }
  async create(cdclient, id){
    return new Promise(async(resolve, reject) => {
      this.cdclient = cdclient;
      this.id = id;
    })
  }

}
module.exports = Item