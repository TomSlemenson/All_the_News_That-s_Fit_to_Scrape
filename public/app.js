// GET ARTICLES
$.getJSON("/articles", function (data) {
  $("#articles").empty();
  for (var i = 0; i < data.length; i++) {
    $("#articles").prepend('<div class="mb-4"><h3>' + data[i].title + '</h3><p>' + data[i].summary1 + " " + data[i].summary2 + '</p><a class="btn btn-primary" href="' + data[i].link + '" target="blank">Read More</a><a data-id="' + data[i]._id + '" href="#" type="button" data-toggle="modal" data-target="#exampleModal"class="ml-4 btn btn-primary" id="addComment">Add Comment</a><a data-id="' + data[i]._id + '" href="#" class="ml-4 btn btn-primary" id="deleteArticle">Delete Article</a></div>');
  }
});

// SCREPE ALTPRESS
$(document).on("click", "#altpressNews", function () {
  $.ajax({
    method: "GET",
    url: "/scrapealtpress"
  }).then(function (data) {
    console.log(data)
    location.reload();
    alert("Altpress scrape Complete")
  });
});

// SCREPE MTV
$(document).on("click", "#mtvNews", function () {
  $.ajax({
    method: "GET",
    url: "/scrapemtv"
  }).then(function (data) {
    console.log(data)
    location.reload();
    alert("MTV scrape Complete")
  });
});

// GO TO COMMENTS
$(document).on("click", "#addComment", function () { 
  var thisId = $(this).attr("data-id");
  refreshPopup(thisId);

});

// DELETE THE ARTICLE
$(document).on("click", "#deleteArticle", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  }).then(function () {
    location.reload();
  });
});

// ADD A COMMENT
$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  if($("#titleinput").val().length >= 1 && $("#bodyinput").val().length >= 1) {

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val(),
      article: thisId
    }
  }).then(function (data) {
    console.log(data);
    var thisId_popup = $("#addNote").children("h2").attr("data-id")
    refreshPopup(thisId_popup)
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
} else {
  alert("To add a comment you must complite all form field")
}
});

// DELETE A COMMENT
$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  }).then(function (getnotes) {
    var thisId_popup = $("#addNote").children("h2").attr("data-id")
    refreshPopup(thisId_popup)
  })
});

// UPDATE A COMMENT
$(document).on("click", "#updatenote", function () {
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "PUT",
    url: "/notes/" + thisId,
    data: {
      title: $("#title_note").val(),
      body: $("#body_note").val(),
    }
  }).then(function (data) {
    alert("Your Comment was updated!")
  })
});

function refreshPopup(thisId) {
  $("#addNote").empty();
  $("#notes").empty();

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function (data) {
    console.log(data);

    $("#addNote").append("<h2" + " data-id='" + thisId + "' style='color:black'>" + data.title + "</h2>");
    $("#addNote").append("<small style='color:black'>Comment Title</small>");
    $("#addNote").append("<input style='width:100%; height:36px;' class='mb-2 color:black' id='titleinput' name='title' >");
    $("#addNote").append("<small style='color:black'>Add Your Comment</small>");
    $("#addNote").append("<textarea id='bodyinput' style='width:100%; height: 200px; color:black' name='body'></textarea>");
    $("#addNote").append("<button class='btn btn-dark mt-2 color:black' data-id='" + data._id + "' id='savenote'>Add Note</button>");
    // GET THE NOTES FROM THE ARTICLE
    $.ajax({
      method: "GET",
      url: "/notes/" + thisId,
    }).then(function (data) {
      console.log(data)
     
      if(data.length >= 1) {
        $("#addNote").append('<br class="mt-2"><hr><br>')
        $("#addNote").append('<h5 class="text-center" style="color:black">Comments</h5>')
        }

      for (var i = 0; i < data.length; i++) {
        var newDiv = $('<div style="color:black" class=" mt-2 pt-4 pb-4">')
        newDiv.append('<input style="width:100%; height:36px;" class="mb-2" id="title_note"></input>')
        newDiv.append('<textarea style="height:150px; width:100%; color:black" id="body_note"></textarea>')
        newDiv.append("<button class='btn btn-dark mt-2' data-id='" + data[i]._id + "' id='deletenote'>Delete Note</button>");
        newDiv.append("<button class='btn btn-dark ml-2 mt-2' data-id='" + data[i]._id + "' id='updatenote'>Update Note</button>")
        $("#notes").prepend(newDiv);
        $("#title_note").val(data[i].title);
        $("#body_note").val(data[i].body);
      }
    });
  });
}
