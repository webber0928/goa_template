const _ = require('lodash');
const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
  Table,
 } = require('actions-on-google');
const app = dialogflow({ debug: true });


// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_ONE = 'title';

// Constant for image URLs
const IMG_URL_AOG = 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png';
const IMG_URL_GOOGLE_ALLO = 'https://allo.google.com/images/allo-logo.png';
const IMG_URL_GOOGLE_HOME = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const IMG_URL_GOOGLE_PIXEL = 'https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png';
const IMG_URL_MEDIA = 'http://storage.googleapis.com/automotive-media/album_art.jpg';
// const MEDIA_SOURCE = 'http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3';
const MEDIA_SOURCE = 'https://developers.google.com/actions/downloads/ssml/ssml-17.mp3';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: 'You selected the first item in the list or carousel',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
  [SELECTION_KEY_GOOGLE_ALLO]: 'You selected Google Allo!',
};

const intentSuggestions = [
  'Media',
  'normal ask'
];

app.middleware((conv) => {
  conv.hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
  conv.hasAudioPlayback =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
  console.log('middleware: ', conv.hasScreen, conv.hasAudioPlayback)
});

exports.customEntry = (req, res, next) => {
  // Welcome
  app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Hi there!');
    conv.ask('I can show you basic cards, lists and carousels ' +
        'as well as suggestions on your phone.');
    conv.ask(new Suggestions(intentSuggestions));
  });

  app.intent('normal ask', (conv) => {
    conv.ask('Ask me to show you a list, carousel, or basic card.');
    conv.ask(new Suggestions(intentSuggestions));
  });

  // Media response
  app.intent('media response', (conv) => {
    if (!conv.hasAudioPlayback) {
      conv.ask('Sorry, this device does not support audio playback.');
      return;
    }
    conv.ask('This is the first simple response for a media response');
    conv.ask(new MediaObject({
      name: 'Jazz in Paris',
      url: MEDIA_SOURCE,
      description: 'A funky Jazz tune',
    }));
    conv.ask(new Suggestions(intentSuggestions));
  });

  // Handle a media status event
  app.intent('media status', (conv) => {
    const mediaStatus = conv.arguments.get('MEDIA_STATUS');
    let response = 'Unknown media status received.';
    if (mediaStatus && mediaStatus.status === 'FINISHED') {
      response = 'Hope you enjoyed the tunes!';
    }
    conv.ask(response);
    conv.ask(new Suggestions(intentSuggestions));
  });

  // Leave conversation
  app.intent('normal bye', (conv) => {
    conv.close('Okay see you later!');
  });


  return next();
};

exports.googleDialogflow = app;