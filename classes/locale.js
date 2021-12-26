const {readFile} = require('fs').promises
const {locale_path} = require('./../config.json')
const {XMLParser} = require('fast-xml-parser')
class locale {
  constructor(){

  }
  async load(){
    // load xml file
    return new Promise(async(resolve, reject) => {

      const parser = new XMLParser();
      const xml = await readFile(locale_path)
      this.json = parser.parse(xml).localization.phrases.phrase
      console.log(this.json);
      resolve()
    })
  }
  async getObjectName(){
    // get the english name from an id
  }
  // functions for mission text
}

module.exports = locale
