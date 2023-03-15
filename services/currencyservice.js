const axios = require('axios');
require('axios-debug-log/enable')
class CurrencyService {
  constructor() {

  }
  async get_usd_rates() {
    try {
      let response = await axios.get('https://www.nbrb.by/api/exrates/rates?periodicity=0')
      let rate = []
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]['Cur_Abbreviation'] == 'USD' || response.data[i]['Cur_Abbreviation'] == 'EUR') {
          rate.push(response.data[i])
        }
      }
      
      return rate
    }
    catch (error) {
      console.log(error)
      return []
    }
  }

}
module.exports = { CurrencyService }
