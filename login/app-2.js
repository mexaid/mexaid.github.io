// Your web app's Firebase configuration (ENTER YOUR FIREBASE CONFIGURATION DETAILS)
var firebaseConfig = {
    apiKey: "AIzaSyBWLZ6D4RjdnwLxiSrQbIbJJ3VqbsDbth0",
  authDomain: "blog-andre-c7dec.firebaseapp.com",
  databaseURL: "https://blog-andre-c7dec-default-rtdb.firebaseio.com",
  projectId: "blog-andre-c7dec",
  storageBucket: "blog-andre-c7dec.appspot.com",
  messagingSenderId: "145107204999",
  appId: "1:145107204999:web:59c1a4e4c4438c39b2b122",
  measurementId: "G-6KG5DR3SWH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

        var provider = new firebase.auth.GoogleAuthProvider();
        var login = document.querySelector('.login');

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // console.log(user);
            window.location = 'home.html';
          }
        });

        login.addEventListener('click', (e) => {
          firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
              window.location = 'home.html'
            }).catch((error) => {
              console.log(error);
            });
        })

var form = document.querySelector('#loginForm');
var r_form = document.querySelector('#registerForm');
var reset_form = document.querySelector('#resetForm');
var message = document.querySelector('#messageDiv');
var message_value = document.querySelector('.message');
var sign_out = document.querySelector("#signOut");

// check if user is logged in or not
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if(window.location.pathname != '/home.html'){
            window.location = 'home.html';
        }
    } else {
        if(window.location.pathname === '/home.html'){
            window.location = 'index.html';
        }
    }
});

// user login
if(form){
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;
    
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location = 'home.html';
        })
        .catch((error) => {
            message.style.display = 'block';
            message_value.innerText = error.message;
            setTimeout(function(){
                message.style.display = 'none';
            }, 3000);
        });
    })
}

// user register
if(r_form){
    r_form.addEventListener('submit', function(e) {
        e.preventDefault();
        let email = r_form.email.value;
        let password = r_form.password.value;
    
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location = 'home.html';
        })
        .catch((error) => {
            message.style.display = 'block';
            message_value.innerText = error.message;
            setTimeout(function(){
                message.style.display = 'none';
            }, 3000);
        });
    })
}

// password reset 
if(reset_form){
    reset_form.addEventListener('submit', function(e) {
        e.preventDefault();
        let email = reset_form.email.value;
    
        firebase.auth().sendPasswordResetEmail(email)
        .then((userCredential) => {
            message.style.display = 'block';
            message_value.innerText = 'Email has been send!';
            window.location = 'index.html';
        })
        .catch((error) => {
            message.style.display = 'block';
            message_value.innerText = error.message;
            setTimeout(function(){
                message.style.display = 'none';
            }, 3000);
        });
    })
}

// sign out  
if(sign_out){
    sign_out.addEventListener('click', function(e) {
        firebase.auth().signOut().then(() => {
            window.location = 'index.html';
        }).catch((error) => {
        // An error happened.
        });
    })
}
