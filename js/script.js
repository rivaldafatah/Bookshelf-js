const bacaa = [];
const RENDER_BACA = 'render-baca';
const SAVED_BACA = 'saved-baca';
const STORAGE_KEY = 'baca_APPS';

function generateId() {
    return +new Date();
  }

  function generateBacaObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    };
  }

  function findBaca(bacaId) {
    for (const bacaItem of bacaa) {
      if (bacaItem.id === bacaId) {
        return bacaItem;
      }
    }
    return null;
  }
  
  function findBacaIndex(bacaId) {
    for (const index in bacaa) {
      if (bacaa[index].id === bacaId) {
        return index;
      }
    }
    return -1;
  }

  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser Anda tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(bacaa);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_BACA));
    }
  }

  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const baca of data) {
        bacaa.push(baca);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_BACA));
  }

  function makeBaca(bacaObject) {

    const {id, title, author, year, isCompleted} = bacaObject;
  
    const textTitle = document.createElement('h2');
    textTitle.innerText = title;

    const textAuthor = document.createElement('h2');
    textAuthor.innerText = author;
  
    const textYear = document.createElement('p');
    textYear.innerText = year;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `baca-${id}`);
  
    if (isCompleted) {
  
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.addEventListener('click', function () {
        undoBacaFromCompleted(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeBacaFromCompleted(id);
      });
  
      container.append(undoButton, trashButton);
    } else {
  
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.addEventListener('click', function () {
        addBacaToCompleted(id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeBacaFromCompleted(id);
      });
  
      container.append(checkButton, trashButton);
    }
  
    return container;
  }


  function addBaca() {
    const baca = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bacaObject = generateBacaObject(generatedID, baca, author, year, isComplete, false);
    alert('Buku berhasil ditambahkan');
    bacaa.push(bacaObject);
  
    document.dispatchEvent(new Event(RENDER_BACA));
    saveData();
  }

  function addBacaToCompleted(bacaId /* HTMLELement */) {
    const bacaTarget = findBaca(bacaId);
  
    if (bacaTarget == null) return;
  
    bacaTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_BACA));
    saveData();
  }

  function removeBacaFromCompleted(bacaId /* HTMLELement */) {
    const bacaTarget = findBacaIndex(bacaId);
    const konfirmasi = window.confirm("Apakah ingin dihapus?");
    if(konfirmasi) {
        if (bacaTarget === -1) return;
    
    bacaa.splice(bacaTarget, 1);
    document.dispatchEvent(new Event(RENDER_BACA));
    saveData();
    alert('Berhasil menghapus buku');
    }
    else{
        alert('Gagal menghapus buku');
    }
  }

  function undoBacaFromCompleted(bacaId /* HTMLELement */) {

    const bacaTarget = findBaca(bacaId);
    if (bacaTarget == null) return;
  
    bacaTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_BACA));
    saveData();
  }

  document.addEventListener('DOMContentLoaded', function () {

    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBaca();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  document.addEventListener(SAVED_BACA, () => {
    console.log('Data Buku berhasil di simpan.');
  });

  document.addEventListener(RENDER_BACA, function () {
    const uncompletedBACAList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    uncompletedBACAList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bacaItem of bacaa) {
      const bacaElement = makeBaca(bacaItem);
      if (bacaItem.isCompleted) {
        listCompleted.append(bacaElement);
      } else {
        uncompletedBACAList.append(bacaElement);
      }
    }
  });






