//toastr config options
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-full-width"
}

//set the base url for development or production
// const baseURL = "http://localhost:3000/v1/" //development
const baseURL = "https://wiki-scripts.herokuapp.com/v1/" //production

//append the 10 most recently queried shows to the 'recent' list
$.ajax({url: baseURL + "recent", 
  success: (results) => {
    for (let result of results) {
      let myurl = `${baseURL}${escape(result)}/calendar.ics`;
      $('#recent').append(`<div><a href=${myurl}>${result}.ics</a></div>`); 
    }
  },
  error: (error) => {
    if (error.status == 200){
      toastr.success(error.responseText);
    }
  }
});


$("#tv_guide_submit").click((event) => {
  event.preventDefault();

  let input = $("#tv_guide_input").val();
  if (input == "" || input == null) {
    toastr.error("Please enter a valid show name or wiki url");
    return;
  }
  let myurl;

  //hit the wiki endpoint if it's a wiki page -- else the name endpoint
  if (input.indexOf("wikipedia.org") > -1) {
    myurl = baseURL + "wiki/?url=" + input;
  } else {
    myurl = baseURL + "" + escape(input) + "/calendar.ics" ;
  }

  //hit the endpoint to findOrCreate the calendar
  $.ajax({url: myurl, 
    success: (result) => {
      //append the link below search
      linkify(myurl, input);
    },
    error: (error) => {
      if (error.status == 200){
        toastr.success(error.responseText);
      } else {
        toastr.error("Unable to process page. The error has been logged");
      }
    }
  });
});

//reveal the results section and append the new url to it
const linkify = (url, input) => {
  $("#results").removeClass("hidden");
  $('#results').append("<div><a href="+url+">"+ input +".ics</a><div>");
}
