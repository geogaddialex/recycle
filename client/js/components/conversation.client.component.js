// angular.module('myApp', []).component( 'conversation', {

//         bindings: {
//           conversation: '=',
//           user: '='
//         },
//         controller: function () {

//           //getConversation

//           function sendMessage(){

//               var messageToCreate = {

//                   sender: this.user,
//                   content: this.message
//               }

//               MessageService.createMessage( messageToCreate ).then( function( createdMessage ){ 

//                   this.conversation.messages.push( createdMessage.data )
//                   this.message = ""
//                   saveConversation()

//               })

//           }

//           function saveConversation( ){

//               ConversationService.updateConversation( this.conversation ).then( function( ){


//               }, function(){
//                   alert( "Conversation not saved" );
//               })

//           }


//           this.increment = increment;
//           this.decrement = decrement;
//         },
//         template: [
//           '<div class="row"><h5>Messages</h5></div>',
//             '<div id="displayMessages">',
//             '<div class="row message" ng-repeat="messageToDisplay in $ctrl.conversation.messages  | orderBy : \'-timestamp\'">',
//                 '<div class="col-xs-5 messageInfo" ng-if="messageToDisplay.timestamp">[{{ formatTimestamp(messageToDisplay.timestamp, \'short\') }}] <b>{{ getUserName( messageToDisplay.sender ) }}:</b> </div>',
//                 '<div class="col-xs-7 messageContent">{{ messageToDisplay.content }}</div>',
//             '</div>',
//           '</div>',
//           '<div id="messageForm" class="row">',
//               '<input type="text" id="messageInput" placeholder="Type a message" ng-model="$ctrl.message" ng-keydown="$event.keyCode === 13 && $ctrl.sendMessage()" />',
//               '<button class="btn" id="messageButton" ng-click="$ctrl.sendMessage( )">Send</button>',
//           '</div>'
//         ].join('')
//     });


(function(){

  "use strict";

  angular.module("myApp", []).component( 'conversation', {
    template: "Hello from configuration list"
  });

})();

// angular.module('myApp', []).component( 'conversation', {
//   template: "Hello from configuration list"
// });