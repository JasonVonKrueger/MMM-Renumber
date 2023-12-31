Module.register('MMM-Renumber', {
  defaults: {

  },

  start() {
    this.className = 'hidden';
    this.number = Math.floor(Math.random() * 9);
    this.numbers = [];
    this.numbers.push(this.number);
    this.player_guesses = [];
    this.level = 1;
    this.max_levels = this.config.maxLevels || 10;

    Log.info("Starting module: " + this.name + " with identifier: " + this.identifier);
  },

  getStyles() {
    return ['MMM-Renumber.css'];
  },

  getDom() {
    const wrapper = document.createElement('div');
    wrapper.className = this.className;

    let markup = `
          <div id="mmm-renumber">
            <div class="title">Renumber</div>
            <div id="game_box">
            <div>Remember this number:
              <div id="number">${this.number}</div>
            </div>
            
            <div id="player_message" class="hidden">
              Enter the number you saw: 
              <div><input type="text" id="player_guess" /></div>
            </div>
            <div id="result_message"></div> 
            </div>
          </div> 
    `;

    wrapper.innerHTML = markup;
    return wrapper;
  },

  async handleGuess(data) {
    document.querySelector('#player_guess').value += data.number;
    this.player_guesses.push(parseInt(data.number));

    console.log('guesses: ' + this.player_guesses);
    console.log('numbers: ' + this.numbers);

    if (this.player_guesses.length === this.numbers.length) {
      if (this.player_guesses.join('') === this.numbers.join('')) {
        document.querySelector('#result_message').innerHTML = 'Good job!';
        await this.sleep(1200);
        this.reset(true);
      } 
      else {
        document.querySelector('#result_message').innerHTML = 'Nope! Try again.';
        await this.sleep(1200);
        this.reset(false);
      }
    }
  },

  async showNumber() {
    let n = Math.floor(Math.random() * 9);
    await this.sleep(2500);

    document.querySelector('#number').innerHTML = document.querySelector('#number').innerHTML.replace(/\w|\W/gi, '*');
    document.querySelector('#player_message').classList.remove('hidden');
  },

  reset(result) {
    if (result) this.level++;
    else this.level = 1;

    //this.config.maxLevels

    this.numbers.length = 0;
    this.player_guesses.length = 0;
    document.querySelector('#player_message').classList.add('hidden');
    document.querySelector('#player_guess').value = '';
    document.querySelector('#result_message').innerHTML = '';

    //this.showNumber();
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // sendSocketNotification(notification, payload) {
  //   this.socket().sendNotification(notification, payload);
  // },

  notificationReceived(notification, payload, sender) {
    this.sendSocketNotification("blah_blah");

    if (sender) {
      Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
    } else {
      Log.log(this.name + " received a system notification: " + notification);
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === 'RENUMBER_CLIENT_CONNECTED') {
      //document.querySelector('#mmm-renumber').classList.remove('hidden');
      this.className = '';
      this.updateDom();

      this.showNumber();
    }

    if (notification === 'RENUMBER_NUMPAD_BUTTON_CLICK') {
      console.log(payload.number)
      this.handleGuess(payload);
    }

    
    //this.hide();
    //document.querySelector('#number').innerHTML = JSON.stringify(payload);
    Log.log(this.name + " received a fat socket notification: " + notification + " - Payload: " + JSON.stringify(payload));
  },

})