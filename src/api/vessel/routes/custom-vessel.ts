/**
 * vessel router
 */


module.exports = {
    routes: [
      { // Path defined with a URL parameter
        method: 'POST',
        path: '/vessel/scrap',
        handler: 'vessel.ScrapeVessel',
        
      }
    ]
  }
