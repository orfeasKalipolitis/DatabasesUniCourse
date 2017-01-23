/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loginPOST() {
    if(document.getElementById("usern").checkValidity() === false) {
        alert("Please input username");
        return;
    }else if(document.getElementById("userp").checkValidity() === false) {
        alert("Please input password");
        return;
    }
    
    var usern = $("#usern").val();
    var userp = sha1($("#userp").val());
    
    var object = new Object();
    object.usern = usern;
    object.userp = userp;
    
    var request = JSON.stringify(object);
    var url = "login";
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.authstatus === "authenticated") {
                /**
                var cltype = whatAmIPOST();
                if(cltype === "company") {
                    // get employy name
                }else if(cltype === "merchant") {
                    // other page
                }else if(cltype === "CCC") {
                    // CCC specific page
                }
                */
                window.location.href = "buyCap.html";
            }else if(jsonObj.authstatus === "already_authenticated"){
                alert("You hace already loggen-in from another device and never logged-out.");
                loginPage();
            }else if(jsonObj.authstatus === "unauthorised") {
                alert("Username - password combo was wrong, please try again.");
                loginPage();
            }else{
                alert("Something went terribly wrong.");
                loginPage();
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function registerPOST() {
    // Every client
    if(document.getElementById("usern").checkValidity() === false) {
        alert("Please input username");
        return;
    }else if(document.getElementById("userp").checkValidity() === false) {
        alert("Please input password");
        return;
    }else if($('input[name="accountType"]:checked').length === 0) {
        alert("Please choose an account type");
        return;
    }
    
    
    var usern = $("#usern").val();
    var userp = sha1($("#userp").val());
    var client= $('input[name="accountType"]:checked').val();
    
    var object = new Object();
    var first;
    var last;
    // Company Specific
    var firsts = {};
    var lasts = {}; 
    if (client === 'company') {
        if(document.getElementById("howMany").checkValidity() === false) {
            alert("Please input number of employees between 1 and 5");
            return;
        }
        var num = $("#howMany").val();
        object.num = num;
        object.employees = [];
        for(var i = 0; i < num; i++) {
            if(document.getElementById("first"+i).checkValidity() === false) {
                alert("Please input first name for empoyee #" +(i+1));
                return;
            }
            if(document.getElementById("last"+i).checkValidity() === false) {
                alert("Please input last name for empoyee #" +(i+1));
                return;
            }
            firsts[i] = $("#first"+i).val();
            lasts[i] = $("#last"+i).val();
            var obj = new Object();
            obj.first = firsts[i];
            obj.last = lasts[i];
            object.employees.push(obj);
        }
        if(document.getElementById("name").checkValidity() === false) {
                alert("Please input name for your company");
                return;
            }
        object.name = $("#name").val();
    }else{
        // Client is either individual or merchant
        if(document.getElementById("first").checkValidity() === false) {
            alert("Please input a first name");
            return;
        }else if(document.getElementById("last").checkValidity() === false) {
            alert("Please input a last name");
            return;
        }
        first = $("#first").val();
        last  = $("#last").val();
        object.first = first;
        object.last  = last;
    }
    
    object.usern = usern;
    object.userp = userp;
    object.client= client;
    object.action= "register";
    
    var request = JSON.stringify(object);
    var url = "register";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.regstatus === "success") {
                alert("You have successfully registered a new account.");
                loginPage();
            }else if(jsonObj.regstatus === "failure" && jsonObj.reason === "user_exists"){
                $("#usern").val("");
                return;
            }else{
                alert("Something went terribly wrong.");
                registerPage();
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function whatAmIPOST() {
    var object = new Object();
    object.action = "userkind";
    
    var request  = JSON.stringify(object);
    var url = "cs360";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything went OK
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.status === "success") {
                return jsonObj.client;
            }else{
                alert("Failure.");
                return;
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function buyPagePOST() {
    buyPage();
    var object = new Object();
    object.action = "getmerchants";
    
    var request  = JSON.stringify(object);
    var url = "cs360";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything went OK
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.status === "success") {
                
            }else{
                alert("Failure.");
                return;
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

// Redirections

function buyPage() {
    window.location.href = "buySome.html";
}

function registerPage() {
    window.location.href = "register.html";
    $("#companyStuff").hide();
}

function loginPage() {
    window.location.href = "index.html";
}

function logOutPOST() {
    var object = new Object();
    object.action= "logout";
    
    var request = JSON.stringify(object);
    var url = "logout";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            var jsonObj = JSON.parse(xhr.responseText);
            if(jsonObj.logoutstatus === "success") {
                loginPage();
            }else{
                alert("You did something you shouldn't be doing.");
                return;
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

/**
 * Delete active user IF no debt
 * @returns {undefined}
 */
function deleteMePOST() {
    var object = new Object();
    object.action= "unregister";
    
    var request = JSON.stringify(object);
    var url = "register";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                $("body").html("SUCCESS deletion of account");
            }else{
                $("body").html("You owe us money");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function payDebtPagePOST() {
    var object = new Object();
    object.action= "howMuchDoIOwe";
    
    var request = JSON.stringify(object);
    var url = "debtquestion";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                window.location.href = "payStuff.html";
                //add amount in debt right now 
            }else{
                $("body").html("You owe us money");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function payPOST() {
    var object = new Object();
    if(document.getElementById("payAmount").checkValidity() === false) {
        alert("Please pay at least 1€");
        return;
    }
    
    object.amount = $("#payAmount").val();
    
    var request = JSON.stringify(object);
    var url = "debtpay";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                $("#grabMe").html("Thanks for giving us your money.");
            }else{
                $("body").html("You owe us money");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

function returnPagePOST() {
    transactionsPOST();
    // populate with transactions, check which one to return and send
    // new POST request for return
}

function transactionsPOST() {
    var object = new Object();
    object.action= "gettransactions";
    
    var request = JSON.stringify(object);
    var url = "transaction";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                $("#grabMe").html("");
                // populate with transactions
            }else{
                $("body").html("You owe us money");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

// CCC specific functions

/**
 * Should show clients that are in good sanding towards CCC
 * @returns {undefined}
 */
function goodClientsPOST() {
    var object = new Object();

    var request = JSON.stringify(object);
    var url = "goodStanding";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                // parse JSON response from back-end
                $("body").html("");
            }else{
                $("body").html("ERROR");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

/**
 * Should show clients that are in good sanding towards CCC
 * Sorted list of them
 * @returns {undefined}
 */
function badClientsPOST() {
    var object = new Object();

    var request = JSON.stringify(object);
    var url = "badStanding";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                // parse JSON response from back-end
                $("body").html("");
            }else{
                $("body").html("ERROR");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}

/**
 * Give 5% discount to best merchant by CCC
 * @returns {undefined}
 */
function discountPOST() {
    var object = new Object();

    var request = JSON.stringify(object);
    var url = "discount";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            // Everything OK
            if(xhr.responseText === "OK") {
                // parse JSON response from back-end
                $("body").html("");
            }else{
                $("body").html("ERROR");
            }
        }
    };
    
    xhr.setRequestHeader('ContentType','application/json');
    xhr.send(request);
}