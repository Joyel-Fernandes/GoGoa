
(function () {
  /* ---------- Tab switching ---------- */
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  /* ---------- Helpers ---------- */
  function pluralize(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function addDays(dateStr, days) {
    var d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function diffDays(a, b) {
    var d1 = new Date(a + 'T00:00:00');
    var d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / 86400000);
  }

  function formatDate(str) {
    return new Date(str + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /* ---------- Hotels panel ---------- */
  var destinationEl = document.getElementById('destination');
  var checkinEl = document.getElementById('checkin');
  var checkoutEl = document.getElementById('checkout');
  var guestsValueEl = document.getElementById('guests-value');
  var nightsValueEl = document.getElementById('nights-value');
  var guestsMinusBtn = document.getElementById('guests-minus');
  var guestsPlusBtn = document.getElementById('guests-plus');
  var nightsMinusBtn = document.getElementById('nights-minus');
  var nightsPlusBtn = document.getElementById('nights-plus');
  var hotelsStatusEl = document.getElementById('hotels-status');
  var hotelsForm = document.getElementById('panel-hotels');

  var guests = 2;
  var nights = 3;
  var MIN_GUESTS = 1, MAX_GUESTS = 12;
  var MIN_NIGHTS = 1, MAX_NIGHTS = 30;

  function renderGuests() {
    guestsValueEl.textContent = pluralize(guests, 'guest');
    guestsMinusBtn.disabled = guests <= MIN_GUESTS;
    guestsPlusBtn.disabled = guests >= MAX_GUESTS;
  }

  function renderNights() {
    nightsValueEl.textContent = pluralize(nights, 'night');
    nightsMinusBtn.disabled = nights <= MIN_NIGHTS;
    nightsPlusBtn.disabled = nights >= MAX_NIGHTS;
  }

  guestsPlusBtn.addEventListener('click', function () {
    if (guests < MAX_GUESTS) { guests++; renderGuests(); }
  });
  guestsMinusBtn.addEventListener('click', function () {
    if (guests > MIN_GUESTS) { guests--; renderGuests(); }
  });

  nightsPlusBtn.addEventListener('click', function () {
    if (nights < MAX_NIGHTS) {
      nights++;
      renderNights();
      checkoutEl.value = addDays(checkinEl.value, nights);
    }
  });
  nightsMinusBtn.addEventListener('click', function () {
    if (nights > MIN_NIGHTS) {
      nights--;
      renderNights();
      checkoutEl.value = addDays(checkinEl.value, nights);
    }
  });

  checkinEl.addEventListener('change', function () {
    if (!checkinEl.value) return;
    checkoutEl.value = addDays(checkinEl.value, nights);
  });

  checkoutEl.addEventListener('change', function () {
    var d = diffDays(checkinEl.value, checkoutEl.value);
    if (d > 0) {
      nights = Math.min(d, MAX_NIGHTS);
      renderNights();
    } else {
      checkoutEl.value = addDays(checkinEl.value, nights);
    }
  });

  renderGuests();
  renderNights();

  hotelsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var dest = destinationEl.value.trim();
    hotelsStatusEl.classList.remove('show');
    if (!dest) {
      hotelsStatusEl.textContent = 'Please enter a destination.';
      return;
    }
    hotelsStatusEl.textContent = 'Searching hotels…';
    setTimeout(function () {
      hotelsStatusEl.classList.add('show');
      hotelsStatusEl.textContent =
        'Found stays in ' + dest + ' — ' + formatDate(checkinEl.value) + ' to ' +
        formatDate(checkoutEl.value) + ', ' + pluralize(guests, 'guest') + ', ' +
        pluralize(nights, 'night') + '.';
    }, 650);
  });

  /* ---------- Taxis panel ---------- */
  var pickupEl = document.getElementById('pickup');
  var dropoffEl = document.getElementById('dropoff');
  var pickupTimeEl = document.getElementById('pickup-time');
  var vehicleEl = document.getElementById('vehicle');
  var taxisStatusEl = document.getElementById('taxis-status');
  var taxisForm = document.getElementById('panel-taxis');

  taxisForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var pickup = pickupEl.value.trim();
    var dropoff = dropoffEl.value.trim();
    taxisStatusEl.classList.remove('show');

    if (!pickup || !dropoff) {
      taxisStatusEl.textContent = 'Please enter both pickup and drop-off locations.';
      return;
    }
    if (!pickupTimeEl.value) {
      taxisStatusEl.textContent = 'Please choose a pickup date & time.';
      return;
    }

    taxisStatusEl.textContent = 'Finding rides…';
    setTimeout(function () {
      taxisStatusEl.classList.add('show');
      var vehicleName = vehicleEl.value.split('—')[0].trim();
      taxisStatusEl.textContent = vehicleName + ' rides found from ' + pickup + ' to ' + dropoff + '.';
    }, 650);
  });
})();
