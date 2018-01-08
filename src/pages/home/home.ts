import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isLoggedIn:boolean = false;
  users: any;

  constructor(private fb: Facebook) {
    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }

  login() {
    console.log('Login clicked');
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        console.log('Got responose');
        if(res.status === "connected") {
          this.isLoggedIn = true;
          console.log(res);
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
        
        // console.log("User data yy"+this.users);
        console.log("User data"+JSON.stringify(this.users));
        // console.log("User data j"+this.users.json);

        // Get big profile image
        this.getBigProfileImageFbAPI(userid);

      })
      .catch(e => {
        console.log(e);
      });
  }

  // getBigProfileImage(usreId) {
  //   let path = 'https://graph.facebook.com/'+usreId+'/picture?height=720';
  //   let encodedPath = encodeURI(path);
  //   let timeoutMS = 10000;

  //   this.http.get(encodedPath)
  //       .map(res => res.json()).subscribe(data => {
  //           let responseData = data;
  //           console.log('big profile picture : '+responseData);
  //       },
  //       err => {
  //           console.log('error in ETPhoneHome');
  //       });
  // }

  
  getBigProfileImageFbAPI(userId) {
    this.fb.api("/"+userId+'/picture?height=720',["public_profile"])
    .then(res => {

      this.users.bigPicture=res.data.url;
      // console.log(res);
      console.log("profile picture "+JSON.stringify(res));
    })
    .catch(e => {
      console.log(e);
    });
  }

}
