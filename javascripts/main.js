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
    for (var error of errors) {
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
  // var myurl = "http://localhost:3000/v1/wiki/?url=" + $("#tv_guide_input").val();
	$.ajax({url: myurl, 
    success: function(result){
      download(result);
    },
    error: function(error){
      if (error.status == 200){
        toastr.success(error.responseText);
      }
    }
  });
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var tvGuideQuery = function(){
  var myurl = "https://wiki-scripts.herokuapp.com/v1/wiki/calendar?title=" + getParameterByName("title");
  // var myurl = "http://localhost:3000/v1/wiki/calendar?title=" + getParameterByName("title");
  $.ajax({url: myurl, 
    success: function(result){
      download(result);
    },
    error: function(error){
      if (error.status == 200){
      }
    }
  });
}

var download = function(data) {
  var uriContent = "data:text/calendar," + encodeURIComponent(data);
  location.href = uriContent;
}