export const APP_RELEASE_HISTORY = Object.freeze([
  Object.freeze({
    version: '1.3.0',
    summary: 'This release includes the following improvements.',
    changes: Object.freeze([
      'Added a PayPal donation option with a configurable payment link.',
      'Added Telegram, email, and WhatsApp contact links.',
      'Added first-run notification permission onboarding and app update checks with release history.',
      'Added native timer-completion notifications for Android and iOS, including lock-screen and notification-center delivery.',
      'Changed timer completion alarms to use the selected Settings tone and repeat until the timer is stopped; removed alarm.mp3 playback.',
      'Documented native notification and app update configuration requirements.'
    ])
  }),
  Object.freeze({
    version: '1.2.0',
    summary: 'Added app update checks and release history, first-run notification permission onboarding, PayPal donation support, and selected alarm sounds for native apps.'
  }),
  Object.freeze({
    version: '1.1.0',
    summary: 'Added app version history and a one-time update notice, with PWA reload and mobile store links.'
  }),
  Object.freeze({
    version: '1.0.0',
    summary: 'Initial release with battery and charger profiles, charge-time estimates, history, safety guidance, and PWA support.'
  })
]);
