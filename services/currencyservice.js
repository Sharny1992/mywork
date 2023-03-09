const axios = require('axios');
require('axios-debug-log/enable')
class CurrencyService {
  constructor() {

  }
  async get_usd_rates() {
    try {
      let response = await axios.get(`https://www.nbrb.by/api/exrates/rates/431`)

      return response.data.Cur_OfficialRate
    }
    catch (error) {
      console.log(error)
      return -1
    }
  }

}
module.exports = { CurrencyService }
