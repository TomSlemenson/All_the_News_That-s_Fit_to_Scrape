// GET ARTICLES
$.getJSON("/articles", data => {
  $("#articles").empty();
  for (let i = 0; i < data.length; i++) {
    $("#articles").prepend('<div class="mb-4"><h3>' + data[i].title + '</h3><p>' + data[i].summary1 + " " + data[i].summary2 + '</p><a class="btn btn-primary article_a" href="' + data[i].link + '" target="blank">Read More</a><a data-id="' + data[i]._id + '" href="#" data-toggle="modal" data-target="#exampleModal" class="ml-4 btn btn-primary article_a" id="addComment">Add Comment</a><a data-id="' + data[i]._id + '" href="#" class="ml-4 btn btn-primary article_a" id="deleteArticle">Delete Article</a></div>');
  }
});

// SCRAPE ALTPRESS
$(document).on("click", "#altpressNews", () => {
  $.ajax({
    method: "GET",
    url: "/scrapealtpress"
  }).then(data => {
    console.log(data)
    location.reload();
    alert("Altpress scrape Complete")
  });
});

// SCRAPE MTV
$(document).on("click", "#mtvNews", () => {
  $.ajax({
    method: "GET",
    url: "/scrapemtv"
  }).then(data => {
    console.log(data)
    location.reload();
    alert("MTV scrape Complete")
  });
});

// GO TO COMMENTS
$(document).on("click", "#addComment", function () {
  let thisId = $(this).attr("data-id");
  refreshComments(thisId)
  refreshPopupInput(thisId);
});

// DELETE THE ARTICLE
$(document).on("click", "#deleteArticle", function () {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  }).then(() => location.reload());
});

// ADD A COMMENT
$(document).on("click", "#savenote", function () {
  let thisId = $(this).attr("data-id");

  if ($("#titleinput").val().length >= 1 && $("#bodyinput").val().length >= 1) {

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val(),
        article: thisId
      }
    }).then(data => {
      console.log(data);
      let thisId_popup = $("#addNote").children("h2").attr("data-id")
      refreshComments(thisId_popup)
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  } else {
    alert("To add a comment you must complite all form field")
  }
});

// DELETE A COMMENT
$(document).on("click", "#deletenote", function () {
  let thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  }).then(data => {
    let thisId_popup = $("#addNote").children("h2").attr("data-id")
    refreshComments(thisId_popup)
  })
});

// UPDATE A COMMENT
$(document).on("click", "#updatenote", function () {
  let thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "PUT",
    url: "/notes/" + thisId,
    data: {
      title: $("#title_note").val(),
      body: $("#body_note").val(),
    }
  }).then(data => alert("Your Comment was updated!"))
});

// DISPLAY THE COMMETS FORM
const refreshPopupInput = thisId => {
  $("#addNote").empty();
  $("#notes").empty();
  $("#notesH3").empty();

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(data => {
    console.log(data);

    $("#addNote").append("<h2" + " data-id='" + thisId + "' style='color:black'>" + data.title + "</h2>");
    $("#addNote").append("<small style='color:black'>Comment Title</small>");
    $("#addNote").append("<input style='width:100%; border:0.8px solid black; height:36px; border-radius:4px;' class='mb-2 color:black' id='titleinput' name='title' >");
    $("#addNote").append("<small style='color:black'>Add Your Comment</small>");
    $("#addNote").append("<textarea id='bodyinput' style='width:100%; border:0.8px solid black; border-radius:4px; height: 200px; color:black' name='body'></textarea>");
    $("#addNote").append("<button class='btn btn-primary mt-2 color:black' data-id='" + data._id + "' id='savenote'>Add Note</button>");
  });
}

// DISPLAY THE COMMENTS FROM THE ARTICLE
const refreshComments = thisId => {
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId,
  }).then(data => {
    console.log(data)

    $("#notes").empty();
    $("#notesH3").empty();

    if (data.length >= 1) {
      $("#notesH3").append("<hr>")
      $("#notesH3").append('<h5 class="text-center mt-5 mb-5" style="color:black">Comments<br><small class="text-primary" style="font-size:12px;">Click on top of the comment to edit it.</small></h5>')
    }

    for (let i = 0; i < data.length; i++) {
      let newDiv = $('<div style="color:black" class=" mt-2 pt-4">')
      newDiv.append('<input style="width:100%; border:none; height:36px; font-weight: 500; font-size:18px" class="mb-2" id="title_note"></input>')
      newDiv.append('<textarea style="height:100px; border:none; width:100%; color:black" id="body_note"></textarea>')
      newDiv.append("<button class='btn btn-primary mt-2' data-id='" + data[i]._id + "' id='deletenote'>Delete Note</button>");
      newDiv.append("<button class='btn btn-primary ml-2 mt-2' data-id='" + data[i]._id + "' id='updatenote'>Update Note</button>")
      newDiv.append("<hr>")
      $("#notes").prepend(newDiv);
      $("#title_note").val(data[i].title);
      $("#body_note").val(data[i].body);
    }
  });

}
