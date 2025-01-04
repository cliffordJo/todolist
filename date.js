
var getDate = function(){
    let today = new Date();
    let options = { 
    weekday: "long",
    day: "numeric",
    month: "long"
    };
    return today.toLocaleDateString("en-US", options)

     
};
exports = getDate ;

 //so 3 methods of using modules was shown  remember .export is for anything in that page you want to export 

exports.getDay = function(){
    let today = new Date();
    let options = { 
    weekday: "long",
    };
    return today.toLocaleDateString("en-US", options)
};

 