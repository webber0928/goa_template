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
const MEDIA_SOURCE = 'http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: 'You selected the first item in the list or carousel',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
  [SELECTION_KEY_GOOGLE_ALLO]: 'You selected Google Allo!',
};

const intentSuggestions = [
  'Basic Card',
  'Browse Carousel',
  'Carousel',
  'List',
  'Media',
  'Suggestions',
  'Table',
];

app.middleware((conv) => {
  conv.hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
  conv.hasAudioPlayback =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});

exports.customEntry = (req, res, next) => {
  // Welcome
  app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new SimpleResponse({
      speech: 'Hi there!',
      text: 'Hello there!',
    }));
    conv.ask(new SimpleResponse({
      speech: 'I can show you basic cards, lists and carousels ' +
        'as well as suggestions on your phone.',
      text: 'I can show you basic cards, lists and carousels as ' +
        'well as suggestions.',
    }));
    conv.ask(new Suggestions(intentSuggestions));
  });

  app.intent('normal ask', (conv) => {
    conv.ask('Ask me to show you a list, carousel, or basic card.');
  });

  // Suggestions
  app.intent('suggestions', (conv) => {
    if (!conv.hasScreen) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    }
    conv.ask('This is a simple response for suggestions.');
    conv.ask(new Suggestions('Suggestion Chips'));
    conv.ask(new Suggestions(intentSuggestions));
    conv.ask(new LinkOutSuggestion({
      name: 'Suggestion Link',
      url: 'https://assistant.google.com/',
    }));
  });

  // Basic card
  app.intent('basic card', (conv) => {
    if (!conv.hasScreen) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    }
    conv.ask('This is the first simple response for a basic card.');
    conv.ask(new Suggestions(intentSuggestions));
    // Create a basic card
    conv.ask(new BasicCard({
      text: `This is a basic card.  Text in a basic card can include "quotes" and
      most other unicode characters including emoji 📱.  Basic cards also support
      some markdown formatting like *emphasis* or _italics_, **strong** or
      __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
      things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                  // a line break to be rendered in the card.
      subtitle: 'This is a subtitle',
      title: 'Title: this is a title',
      buttons: new Button({
        title: 'This is a button',
        url: 'https://assistant.google.com/',
      }),
      image: new Image({
        url: IMG_URL_AOG,
        alt: 'Image alternate text',
      }),
    }));
    conv.ask(new SimpleResponse({
      speech: 'This is the second simple response.',
      text: 'This is the 2nd simple response.',
    }));
  });


// List
app.intent('list', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is a simple response for a list.');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a list
  conv.ask(new List({
    title: 'List Title',
    items: {
      // Add the first item to the list
      [SELECTION_KEY_ONE]: {
        synonyms: [
          'synonym of title 1',
          'synonym of title 2',
          'synonym of title 3',
        ],
        title: 'Title of First List Item',
        description: 'This is a description of a list item.',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the list
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: IMG_URL_GOOGLE_HOME,
          alt: 'Google Home',
        }),
      },
      // Add the third item to the list
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: IMG_URL_GOOGLE_PIXEL,
          alt: 'Google Pixel',
        }),
      },
      // Add the last item to the list
      [SELECTION_KEY_GOOGLE_ALLO]: {
        title: 'Google Allo',
        synonyms: [
          'Allo',
        ],
        description: 'Introducing Google Allo, a smart messaging app that ' +
          'helps you say more and do more.',
        image: new Image({
          url: IMG_URL_GOOGLE_ALLO,
          alt: 'Google Allo Logo',
        }),
      },
    },
  }));
});

// Carousel
app.intent('carousel', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is a simple response for a carousel.');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a carousel
  conv.ask(new Carousel({
    items: {
      // Add the first item to the carousel
      [SELECTION_KEY_ONE]: {
        synonyms: [
          'synonym of title 1',
          'synonym of title 2',
          'synonym of title 3',
        ],
        title: 'Title of First Carousel Item',
        description: 'This is a description of a carousel item.',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: IMG_URL_GOOGLE_HOME,
          alt: 'Google Home',
        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: IMG_URL_GOOGLE_PIXEL,
          alt: 'Google Pixel',
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_GOOGLE_ALLO]: {
        title: 'Google Allo',
        synonyms: [
          'Allo',
        ],
        description: 'Introducing Google Allo, a smart messaging app that ' +
          'helps you say more and do more.',
        image: new Image({
          url: IMG_URL_GOOGLE_ALLO,
          alt: 'Google Allo Logo',
        }),
      },
    },
  }));
});

// Browse Carousel
app.intent('browse carousel', (conv) => {
  const a11yText = 'Google Assistant Bubbles';
  const googleUrl = 'https://google.com';
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is an example of a "Browse Carousel"');
  // Create a browse carousel
  conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Title of item 1',
        url: googleUrl,
        description: 'Description of item 1',
        image: new Image({
          url: IMG_URL_AOG,
          alt: a11yText,
        }),
        footer: 'Item 1 footer',
      }),
      new BrowseCarouselItem({
        title: 'Title of item 2',
        url: googleUrl,
        description: 'Description of item 2',
        image: new Image({
          url: IMG_URL_AOG,
          alt: a11yText,
        }),
        footer: 'Item 2 footer',
      }),
    ],
  }));
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

  // React to list or carousel selection
  app.intent('item selected', (conv, params, option) => {
    let response = 'You did not select any item from the list or carousel';
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
      response = SELECTED_ITEM_RESPONSES[option];
    } else {
      response = 'You selected an unknown item from the list or carousel';
    }
    conv.ask(response);
  });

  app.intent('card builder', (conv) => {
    if (!conv.hasScreen) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    }
    conv.ask(...conv.incoming);
    conv.ask(new BasicCard({
      text: `Actions on Google let you build for
      the Google Assistant. Reach users right when they need you. Users don’t
      need to pre-enable skills or install new apps.  \n  \nThis was written
      in the fulfillment webhook!`,
      subtitle: 'Engage users through the Google Assistant',
      title: 'Actions on Google',
      buttons: new Button({
        title: 'Developer Site',
        url: 'https://developers.google.com/actions/',
      }),
      image: new Image({
        url: IMG_URL_AOG,
        alt: 'Actions on Google',
      }),
    }));
  });

  app.intent('table builder', (conv) => {
    if (!conv.hasScreen) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    }
    conv.ask('You can include table data like this')
    conv.ask(new Table({
      dividers: true,
      columns: ['header 1', 'header 2', 'header 3'],
      rows: [
        ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
        ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
      ],
    }));
  });

  // Leave conversation with card
  app.intent('bye card', (conv) => {
    if (!conv.hasScreen) {
      conv.ask('Sorry, try this on a screen device or select the phone ' +
        'surface in the simulator.');
      return;
    }
    conv.ask('Goodbye, World!');
    conv.close(new BasicCard({
      text: 'This is a goodbye card.',
    }));
  });

  // Leave conversation with SimpleResponse
  app.intent('bye response', (conv) => {
    conv.close(new SimpleResponse({
      speech: 'Okay see you later',
      text: 'OK see you later!',
    }));
  });

  // Leave conversation
  app.intent('normal bye', (conv) => {
    conv.close('Okay see you later!');
  });


  return next();
};

exports.googleDialogflow = app;