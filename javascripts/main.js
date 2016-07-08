toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-full-width"
}

var validator = new FormValidator('tv_guide_form', [{
  name: 'tv_guide_input',
  display: 'wikipedia url',
  rules: 'required|valid_url|callback_is_wikipedia'
}], function(errors, event) {
  
  if (errors.length > 0) {
    // Show the errors
    for (var error of errors) {
      console.log(error.message);
      toastr.error(error.message);
    }
  }

  if (event.type == "submit"){
    tvGuideSubmit(event);
  }

});

validator.registerCallback('is_wikipedia', function(value) {
  if (value.indexOf("wikipedia.org") > -1) {
    return true;
  }
  return false;
})
.setMessage('is_wikipedia', "Please input a valid wikipedia url like 'https://en.wikipedia.org/wiki/List_of_Adventure_Time_episodes'");

var tvGuideSubmit = function(event){
	event.preventDefault();
	var myurl = "https://wiki-scripts.herokuapp.com/v1/wiki?url=" + $("#tv_guide_input").val();
	// var myurl = "http://localhost:3000/v1/wiki?url=" + $("#tv_guide_input").val();
	$.ajax({url: myurl, 
    success: function(result){
      download(result);
    },
    error: function(error){
      if (error.status == 200){
        toastr.success(error.responseText);
      } else {
        toastr.info("Something went wrong!");
      }
    }
  });
}

var download = function(data) {
  var filename = "tv-guide.ics";
  var blob = new Blob([data], {type: 'text/calendar'});
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  }
  else{
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;        
    document.body.appendChild(elem)
    elem.click();        
    document.body.removeChild(elem);
  }
}