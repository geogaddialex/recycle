module.exports = {

    'facebookAuth' : {
        'clientID'      : '1827883733922990',
        'clientSecret'  : '83b3a2a056200b5a7632c0b10c476d4a',
        'callbackURL'   : '/api/auth/facebook/callback/',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'googleAuth' : {
        'clientID'      : '779256761900-g13hg85pkn7vc7bqb4gn00309ndrvcio.apps.googleusercontent.com',
        'clientSecret'  : 'xXKc6hgSzQXCfg0rak_Y_1nA',
        'callbackURL'   : '/api/auth/google/callback'
    }

};
