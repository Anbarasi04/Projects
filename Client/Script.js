function openCategory() {
    document.getElementById('categoryModal').style.display = "block";
}

function closeCategory() {
    document.getElementById('categoryModal').style.display = "none";
}

function closeStory() {
    document.getElementById('storyModal').style.display = "none";
}

function openStory() {
    document.getElementById('storyModal').style.display = "block";
}

async function generateStory(type) {
    closeCategory();
    document.getElementById('storyTitle').innerText = '';
    document.getElementById('storyText').innerText = '';
    document.getElementById('copyBtn').style.display = 'none';
    document.getElementById('storyModal').style.display = 'flex';
    const storyText = document.getElementById('storyText');
    storyText.innerHTML = `<span class="generating-text">Generating your story</span>`;
    try{
        const res = await fetch('http://127.0.0.1:8000/story', {
            method: "POST",
            body: JSON.stringify({storyType:type}),
            headers:{
                'Content-Type': "application/json"
            }
        });
        const data = await res.json();

        let parsedData;
        if (typeof data === "string") {
            parsedData = JSON.parse(data);
        }
       else if (typeof data.text === "string") {
          parsedData = JSON.parse(data.text);
       } 
       else {
         parsedData = data;
       }

        document.getElementById('storyTitle').innerText = parsedData.StoryTitle;
        document.getElementById('storyText').innerText = parsedData.StoryContent;
        document.getElementById('copyBtn').style.display =  'block';
    }
    catch(err){
        storyText.innerText = "Something went wrong.Please try again.";
    }
}

function copyStory() {
    const text = document.getElementById('storyText').innerText;
    navigator.clipboard.writeText(text);
}

document.addEventListener("DOMContentLoaded", function () {
    const catModal = document.getElementById('categoryModal');
    const storyModal = document.getElementById('storyModal');

    if (catModal) {
        catModal.addEventListener("click", function (event) {
            if (event.target === catModal) {
                closeCategory();
            }
        });
    }

    if(storyModal) {
        storyModal.addEventListener("click", function(event)
        {
          if(event.target == storyModal){
             closeStory();
          }
         });
    }
});
