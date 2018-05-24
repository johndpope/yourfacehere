import ReactGA from 'react-ga';

class GoogleAnalytics {
  constructor() {
    this.ga = ReactGA
    this.ga.initialize('UA-111793162-1')
    this.isLocal = window.location.hostname === 'localhost'
  }
  pageview(key) {
    !this.isLocal && this.ga.pageview(key)
  }
  event(data) {
    !this.isLocal && this.ga.event(data)
  }
}


const analytics = new GoogleAnalytics()

export default analytics
