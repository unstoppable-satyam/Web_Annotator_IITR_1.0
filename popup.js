var Dates = [];
const setDOMInfo = info => {
  Dates = [];
  console.log(info);
  for (let i = 0; i < info.length; i++) {
    Dates.push(info[i].Date);
    let div1 = document.createElement('div');
    let span = document.createElement('span');
    let p = document.createElement('p');
    div1.classList.add('HighlightedText');
    div1.setAttribute("id", info[i].id.toString() + "*");
    div1.style.backgroundColor = info[i].colour;
    if (info[i].colour == "#95C8F3" || info[i].colour == 'rgb(149, 200, 243)') div1.style.color = 'rgb(14 105 182)';
    else if (info[i].colour == "#FFDC74" || info[i].colour == 'rgb(255, 220, 116)') div1.style.color = 'rgb(176 137 20)';
    else if (info[i].colour == "#FBAC87" || info[i].colour == 'rgb(251, 172, 135)') div1.style.color = 'rgb(158 63 18)';
    else if (info[i].colour == "#F3A6C8" || info[i].colour == 'rgb(243, 166, 200)') div1.style.color = 'rgb(206 30 108)';
    else if (info[i].colour == "#AEB5FF" || info[i].colour == 'rgb(174, 181, 255)') div1.style.color = 'rgb(20 34 179)';
    else if (info[i].colour == "#81E3E1" || info[i].colour == 'rgb(129, 227, 225)') div1.style.color = 'rgb(10 158 155)';
    else if (info[i].colour == "#B3E561" || info[i].colour == 'rgb(179, 229, 97)') div1.style.color = 'rgb(89 136 13)';
    span.innerText = info[i].Date;
    p.innerText = info[i].innerText + '\n\nComment: ' + info[i].textareaText;
    p.style.backgroundColor = div1.style.backgroundColor;
    span.style.backgroundColor = div1.style.backgroundColor;
    let button = document.createElement('button');
    button.innerText = "Copy";
    button.classList.add("bt");
    button.setAttribute("id", info[i].id);
    button.style.border = '2px solid black'; // Add border to button
    button.style.transition = 'background-color 1s linear'; // Smooth transition
    changeButtonColor(button); // Start changing color
    div1.appendChild(button);
    div1.appendChild(p);
    div1.appendChild(span);
    document.body.appendChild(div1);
    changeBorderColor(div1); // Start changing border color
  };
  attachEventListeners();
};

window.addEventListener('DOMContentLoaded', () => {
  // existing code...
  const dl = document.getElementById('download');
  console.log('download element exists?', !!dl);
  if (dl) {
    console.log('backgroundImage CSS:', getComputedStyle(dl).backgroundImage);
    // log runtime URL candidate
    console.log('runtime url:', chrome.runtime.getURL('images/pngwing.com.png'));
  }
});


const attachEventListeners = () => {
  const bts = document.getElementsByClassName('bt');
  for (let i = 0; i < bts.length; i++) {
    bts[i].addEventListener("click", () => {
      console.log(bts[i]);
      let doc = document.getElementById(bts[i].getAttribute('id').toString() + "*");
      let value = doc.querySelector('p').innerText;
      console.log(doc);
      navigator.clipboard.writeText(value);
    });
  }

  const keywordInput = document.getElementById('keyword');
  if (keywordInput) {
    keywordInput.addEventListener('input', searchDivs);
  }

  const dateSelect = document.getElementById('dateSelect');
  if (dateSelect) {
    dateSelect.addEventListener('change', sortDivs);
  }

  const download = document.getElementById('download');
  if (download) {
    download.addEventListener('click', downloadPDF);
  }
};

// Function to change button color smoothly
function changeButtonColor(button) {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF2'];
  let colorIndex = 0;
  setInterval(() => {
    button.style.backgroundColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
  }, 1000); // Change color every second
}

// Function to change border color smoothly
function changeBorderColor(div) {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF2'];
  let colorIndex = 0;
  setInterval(() => {
    div.style.borderColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
  }, 1000); // Change color every second
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id,
      { from: 'popup', subject: 'DOMInfo' },
      // ...also specifying a callback to be called 
      //    from the receiving end (content script).
      setDOMInfo);
  });
});

// Function to download content as PDF
async function downloadPDF() {
  document.body.style.fontSize = '20px';
  document.getElementsByClassName('navbar')[0].style.display = 'none';
  let d = document.getElementsByClassName('bt');
  for (let i = 0; i < d.length; i++) d[i].style.visibility = "hidden";
  await html2pdf().from(document.body).save('output.pdf');
  for (let i = 0; i < d.length; i++) d[i].style.visibility = "visible";
  document.getElementsByClassName('navbar')[0].style.display = 'flex';
  document.body.style.fontSize = '';
}

function searchDivs() {
  console.log("Searching");
  // Get the keyword from the input field
  const keyword = document.getElementById('keyword').value.toLowerCase();

  // Get all div elements
  const divs = document.getElementsByClassName('HighlightedText');

  // Loop through all div elements
  for (let i = 0; i < divs.length; i++) {
      const div = divs[i].querySelector('p');
      console.log(div);
      // Check if the inner text of the div contains the keyword
      if (div.innerText.toLowerCase().includes(keyword)) {
        console.log("IF");
          // Add highlight class to the div
          divs[i].classList.remove('hide');
      } else if (keyword != "") {
        console.log("ELSE");
          // Remove highlight class from the div
          divs[i].classList.add('hide');
      }
  }
}

function sortDivs() {
  console.log("DATEEEEEING");
  const selected = document.getElementById('dateSelect').value;
  if (selected == 'Date') {
    document.body.innerHTML = document.getElementsByClassName('navbar')[0].outerHTML;
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          setDOMInfo);
    });
  } else if (selected == 'style') {
    const divs = document.getElementsByClassName('HighlightedText');
    var temp = Array.from(divs);

    function getBackgroundColor(element) {
      return window.getComputedStyle(element).backgroundColor;
    }

    const sortedDivs = temp.sort((a, b) => {
        const colorA = getBackgroundColor(a);
        const colorB = getBackgroundColor(b);
        return colorA.localeCompare(colorB);
    });

    const body = document.body;
    sortedDivs.forEach(div => body.appendChild(div));
  }
}
