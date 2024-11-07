
export class main{
    
    constructor(){
        //this.baseUrl = 'https://walletstore.club';
        this.baseUrl = 'http://localhost:3001';
        this.brandName = 'JudahCoin'
        
        this.apiEndPoints = {
             
          
            isAuth: `${this.baseUrl}/v1/user/isAuth`,
            checkIp: `${this.baseUrl}/v1/public/checkIp`,  
            contactUs: `${this.baseUrl}/v1/public/contactUs`,
            evmLpSignUp: `${this.baseUrl}/v1/public/evmLpSignUp`,
            evmLpContactUs: `${this.baseUrl}/v1/public/evmLpContactUs`,
            
        }

        this.expireSession = 2; // login session
        this.userToken = 'NDcxNDc2NzE';
     

    }

   

      
    getDate(){
        return Math.floor(Date.now() / 1000);
    }

    numberWithCommas (amount){

        return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    
    
    }

     

    breakDate(targetDate){
       
        
        var diff = targetDate - this.getDate();

        var days = diff > 0 ? Math.floor(diff  / 60 / 60 / 24) : 0;
        var hours = diff > 0 ? Math.floor(diff  / 60 / 60) % 24 : 0;
        var minutes = diff > 0 ? Math.floor(diff  / 60) % 60 : 0;
        var seconds = diff > 0 ? Math.floor(diff) % 60 : 0;

        return {days: days, hours: hours, minutes: minutes, seconds: seconds}
    }

    formatNumber(num, decimalPlaces) {
        num = parseFloat(num)
        return Math.round((num + Number.EPSILON) * (10 ** decimalPlaces)) / (10 ** decimalPlaces);
      }

    
    capital(str) {
        return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    
    
    async  checkIp(){
      
        const settings = {
            "url": this.apiEndPoints.checkIp,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({}),
        };
        
        return new Promise((resolve, reject) => {
            $.ajax(settings)
            .done((response) => {
                resolve(response);
            })
            .fail((error) => {
                reject(error);
            })
        });
    }

    

    async  isAuth(){
      
      const jwtToken = this.getCookie('jwtToken');
      
      const settings = {
          "url": this.apiEndPoints.isAuth,
          "method": "GET",
          "timeout": 0,
          "headers": {
          "Authorization": "Bearer "+jwtToken,
          "Content-Type": "application/json"
          },
      };
      
      return new Promise((resolve, reject) => {
          $.ajax(settings)
          .done((response) => {
              resolve(response);
          })
          .fail((error) => {
              reject(error);
              
          })
      });
    }


    async  updateUserDetails(details){
        const token = this.getCookie('jwtToken');	
        const settings = {
            "url": this.apiEndPoints.updateUserDetails,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Authorization": "Bearer "+token,
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({details: details}),
        };
        
        return new Promise((resolve, reject) => {
            $.ajax(settings)
            .done((response) => {
                resolve(response);
            })
            .fail((error) => {
                reject(error);
            })
        });
    }
 

    

    async  contactUs(details){	
         
        const settings = {
            "url": this.apiEndPoints.contactUs,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({"details":details,brandName: this.brandName}),
        };
        
        return new Promise((resolve, reject) => {
            $.ajax(settings)
            .done((response) => {
                resolve(response);
            })
            .fail((error) => {
                console.log(error)
                reject(error);
            })
        });
    }


    async  evmLpSignUp(email,token,socialLink){	
         console.log(socialLink)
        const settings = {
            "url": this.apiEndPoints.evmLpSignUp,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({"email":email,"token": token,brandName: this.brandName,"social": socialLink}),
        };
        
        return new Promise((resolve, reject) => {
            $.ajax(settings)
            .done((response) => {
                resolve(response);
            })
            .fail((error) => {
                console.log(error)
                reject(error);
            })
        });
    }
    
    async  evmLpContactUs(socialLink){	
          
        const settings = {
            "url": this.apiEndPoints.evmLpContactUs,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({brandName: this.brandName,"social": socialLink}),
        };
        
        return new Promise((resolve, reject) => {
            $.ajax(settings)
            .done((response) => {
                resolve(response);
            })
            .fail((error) => {
                console.log(error)
                reject(error);
            })
        });
    }


    
 
    
    setCookie(name, value, expires, path, domain, secure) {
        let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  
        if (expires) {
          cookieString += '; expires=' + expires.toUTCString();
        }
  
        if (path) {
          cookieString += '; path=' + path;
        }
  
        if (domain) {
          cookieString += '; domain=' + domain;
        }
  
        if (secure) {
          cookieString += '; secure';
        }
  
        document.cookie = cookieString;
        return true;
      }
      
    getCookie(name) {
    const cookieName = encodeURIComponent(name) + '=';
    const cookiesArray = document.cookie.split(';');

    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        
        if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
        }
    }
    return null;
    }
 
    decodeJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

    return JSON.parse(jsonPayload);
      }

    
 
    
    getBaseUrl(){
        return this.baseUrl
    }

    
    

    
    


    
	      

}

 
