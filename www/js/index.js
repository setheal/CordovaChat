/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    API_URL: "https://plbchat.herokuapp.com/messages",
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        document.getElementById("send").addEventListener("click", this.postMessage.bind(this));
        this.getMessagesAtInterval();
    },

    // Call getMessages() at interval
    getMessagesAtInterval: function() {
        setInterval(() => {
            this.getMessages();
        }, 500);
    },

    // Call the chat API
    getMessages: function() {
        fetch(this.API_URL)
            .then(response => response.json())
            .then(responseJson => {
                this.displayChat(responseJson);
            }).catch(err => {
                console.log(err);
            })
    },

    // Display the messages in the chat
    displayChat: function(messages) {
        messages.reverse();
        let chat = document.getElementById("chat");

        // Remove all the messages in the chat
        while (chat.firstChild) {
            chat.removeChild(chat.firstChild);
        }

        // "for of" is like a foreach
        for(let message of messages) {
            if(message.length != 0 
                && message.pseudo.length != 0
                && message.message.length != 0) {

                    let elMessage = document.createElement("p");
                    elMessage.innerText = `${message.pseudo} : ${message.message}`

                    chat.appendChild(elMessage);
                }
        }
    },

    // Add new message
    postMessage: function() {
        let pseudo = document.getElementById("username").value;
        let message = document.getElementById("message").value;

        let fetchOptions = {
            method: "POST",
            mode: "no-cors",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            body: `pseudo=${pseudo}&message=${message}`
        }

        // Send the request only if a pseudo and a message are given.
        if(pseudo.length != 0 && message.length != 0) {
            fetch(this.API_URL, fetchOptions)
            .then(response => response.json())
            .then(responseJson => {
                this.addMessage(response);
            })
            .catch(err => console.log(err));
        }
    },

    // add a message on top of the list
    addMessage: function(response) {
        let chat = document.getElementById("chat");
        let firstChild = chat.firstChild;

        if(response.pseudo.length != 0 && response.message.length != 0) {
            let message = `${response.pseudo} : ${response.message}`;

        chat.insertBefore(message, firstChild);
        }
    }
};

app.initialize();